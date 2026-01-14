"""
Diarization API router.

Provides speaker diarization endpoints.
Speaker diarization answers: "Who spoke when?"
"""

import tempfile
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.auth import CurrentUser
from src.core.config import Settings, get_settings
from src.core.exceptions import FileTooLargeError, InvalidAudioFormatError, JobNotFoundError
from src.core.logging import get_logger
from src.core.rate_limit import RateLimitedUser
from src.db.repositories.job import JobRepository
from src.db.session import get_db
from src.models.stt import (
    DiarizationResponse,
    DiarizationStats,
    TranscriptionStatus,
)
from src.services.diarization.factory import get_diarization_backend
from src.services.storage.factory import get_storage_backend
from src.workers.tasks.diarization import process_diarization

logger = get_logger(__name__)

router = APIRouter(prefix="/v1", tags=["Diarization"])


SUPPORTED_FORMATS = ["wav", "mp3", "m4a", "flac", "ogg", "webm"]


def validate_audio_format(filename: str) -> str:
    """Validate and return audio format from filename."""
    ext = Path(filename).suffix.lower().lstrip(".")
    if ext not in SUPPORTED_FORMATS:
        raise InvalidAudioFormatError(ext, SUPPORTED_FORMATS)
    return ext


@router.post(
    "/diarization",
    response_model=DiarizationResponse,
    status_code=202,
    summary="Create diarization job",
    description="""
Create an asynchronous speaker diarization job.

**Speaker diarization** identifies "who spoke when" in an audio file without transcribing the content.

**Input options:**
- Upload an audio file directly (`audio` field)
- Provide a URL to an audio file (`audio_url` field)

**Speaker detection:**
- If you know the exact number of speakers, set `num_speakers`
- Otherwise, use `min_speakers` and `max_speakers` to guide detection
- The model will detect speakers automatically if no hints are provided

**Supported formats:** wav, mp3, m4a, flac, ogg, webm

Returns a job ID for polling via `GET /v1/diarization/{job_id}`.
""",
    responses={
        202: {"description": "Diarization job created successfully"},
        400: {"description": "Invalid audio format or missing input"},
        413: {"description": "File too large"},
        422: {"description": "Validation error"},
    },
)
async def create_diarization(
    user: RateLimitedUser,
    settings: Annotated[Settings, Depends(get_settings)],
    db: Annotated[AsyncSession, Depends(get_db)],
    audio: UploadFile | None = File(None, description="Audio file to diarize"),
    audio_url: str | None = Form(None, description="URL of audio file to diarize"),
    num_speakers: int | None = Form(None, ge=1, le=20, description="Exact number of speakers (if known)"),
    min_speakers: int | None = Form(None, ge=1, description="Minimum number of speakers"),
    max_speakers: int | None = Form(None, le=20, description="Maximum number of speakers"),
    webhook_url: str | None = Form(None, description="URL to call when processing completes"),
) -> DiarizationResponse:
    """
    Create a speaker diarization job.

    Identifies speakers and their speaking segments in audio.
    Returns a job ID for polling the result.
    """
    start_time = time.time()

    logger.info(
        "diarization_job_request",
        has_audio_file=audio is not None,
        has_audio_url=audio_url is not None,
        num_speakers=num_speakers,
        min_speakers=min_speakers,
        max_speakers=max_speakers,
        has_webhook=webhook_url is not None,
        user_id=user.user_id,
    )

    # Validate input: must have audio file OR audio_url
    if audio is None and audio_url is None:
        logger.warning(
            "diarization_no_audio_source",
            user_id=user.user_id,
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "message": "Either 'audio' file or 'audio_url' must be provided",
                    "type": "invalid_request_error",
                    "param": "audio",
                    "code": "missing_audio_source",
                }
            },
        )

    # Validate audio_url format
    if audio_url is not None and not (audio_url.startswith("http://") or audio_url.startswith("https://")):
        logger.warning(
            "diarization_invalid_audio_url",
            audio_url=audio_url[:100],
            user_id=user.user_id,
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "message": "audio_url must be a valid HTTP(S) URL",
                    "type": "invalid_request_error",
                    "param": "audio_url",
                    "code": "invalid_url_format",
                }
            },
        )

    storage = get_storage_backend(settings)
    job_repo = JobRepository(db)

    audio_storage_key = None
    source_url = audio_url

    if audio is not None:
        # Validate format
        try:
            audio_format = validate_audio_format(audio.filename or "audio.wav")
        except InvalidAudioFormatError as e:
            logger.warning(
                "diarization_invalid_format",
                filename=audio.filename,
                error=str(e),
                user_id=user.user_id,
            )
            raise

        # Check file size
        audio.file.seek(0, 2)
        size = audio.file.tell()
        audio.file.seek(0)

        max_size = settings.stt_max_file_size_mb * 1024 * 1024
        if size > max_size:
            logger.warning(
                "diarization_file_too_large",
                size_mb=round(size / (1024 * 1024), 2),
                max_mb=settings.stt_max_file_size_mb,
                user_id=user.user_id,
            )
            raise FileTooLargeError(size / (1024 * 1024), settings.stt_max_file_size_mb)

        logger.debug(
            "diarization_file_info",
            filename=audio.filename,
            size_mb=round(size / (1024 * 1024), 2),
            format=audio_format,
        )

        # Upload to storage
        content = await audio.read()
        audio_storage_key = storage.generate_key(
            audio.filename or f"audio.{audio_format}",
            prefix="diarization",
        )
        await storage.upload(audio_storage_key, content, f"audio/{audio_format}")

    # Create job
    job = await job_repo.create(
        job_type="diarization",
        params={
            "num_speakers": num_speakers,
            "min_speakers": min_speakers,
            "max_speakers": max_speakers,
            "audio_url": source_url,
        },
        user_id=user.user_id,
        api_key_id=uuid.UUID(user.api_key_id),
        webhook_url=webhook_url,
    )

    await db.commit()

    # Queue async processing
    if audio_storage_key:
        task = process_diarization.delay(
            str(job.id),
            audio_storage_key,
            num_speakers,
            min_speakers,
            max_speakers,
        )
        await job_repo.set_celery_task_id(job.id, task.id)
        await db.commit()

    duration_ms = (time.time() - start_time) * 1000
    logger.info(
        "diarization_job_created",
        job_id=str(job.id),
        audio_storage_key=audio_storage_key,
        audio_url=source_url,
        num_speakers=num_speakers,
        has_webhook=webhook_url is not None,
        duration_ms=round(duration_ms, 2),
        user_id=user.user_id,
    )

    return DiarizationResponse(
        id=str(job.id),
        status=TranscriptionStatus.QUEUED,
        created_at=job.created_at,
    )


@router.get(
    "/diarization/{job_id}",
    response_model=DiarizationResponse,
    summary="Get diarization result",
    description="""
Get the status and result of a diarization job.

**Status values:**
- `queued`: Job is waiting to be processed
- `processing`: Diarization is in progress
- `completed`: Results are ready
- `error`: Processing failed (check `error` field)

**Result fields (when completed):**
- `speakers`: List of detected speakers with statistics
- `segments`: Timeline of who spoke when
- `overlaps`: Segments where multiple speakers talk simultaneously
- `stats`: Processing statistics and metadata
- `rttm`: Rich Transcription Time Marked format (optional)
""",
    responses={
        200: {"description": "Diarization job retrieved successfully"},
        400: {"description": "Invalid job ID format"},
        404: {"description": "Diarization job not found"},
    },
)
async def get_diarization(
    job_id: str,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> DiarizationResponse:
    """
    Get diarization result by job ID.

    Returns the current status and results (if completed).
    """
    start_time = time.time()

    # Validate UUID format
    try:
        parsed_id = uuid.UUID(job_id)
    except ValueError:
        logger.warning(
            "invalid_diarization_job_id_format",
            job_id=job_id,
            user_id=user.user_id,
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "message": f"Invalid job ID format: {job_id}",
                    "type": "invalid_request_error",
                    "param": "job_id",
                    "code": "invalid_id_format",
                }
            },
        )

    job_repo = JobRepository(db)

    job = await job_repo.get_by_id(parsed_id)
    if job is None or job.type != "diarization":
        logger.info(
            "diarization_job_not_found",
            job_id=job_id,
            user_id=user.user_id,
        )
        raise JobNotFoundError(job_id)

    # Check ownership (return 404 to avoid leaking existence)
    if job.user_id != user.user_id:
        logger.warning(
            "diarization_job_access_denied",
            job_id=job_id,
            owner_id=job.user_id,
            requester_id=user.user_id,
        )
        raise JobNotFoundError(job_id)

    # Map status
    status_map = {
        "pending": TranscriptionStatus.QUEUED,
        "queued": TranscriptionStatus.QUEUED,
        "processing": TranscriptionStatus.PROCESSING,
        "completed": TranscriptionStatus.COMPLETED,
        "failed": TranscriptionStatus.ERROR,
        "error": TranscriptionStatus.ERROR,
    }
    status = status_map.get(job.status, TranscriptionStatus.QUEUED)

    response = DiarizationResponse(
        id=str(job.id),
        status=status,
        created_at=job.created_at,
        completed_at=job.completed_at,
    )

    # Populate results if available
    if job.result:
        from src.models.stt import Speaker, SpeakerSegment

        response.speakers = [
            Speaker(**s) for s in job.result.get("speakers", [])
        ]
        response.segments = [
            SpeakerSegment(**s) for s in job.result.get("segments", [])
        ]
        if job.result.get("stats"):
            response.stats = DiarizationStats(**job.result["stats"])
        response.rttm = job.result.get("rttm")

    if job.error_message:
        response.error = job.error_message

    duration_ms = (time.time() - start_time) * 1000
    logger.info(
        "diarization_job_retrieved",
        job_id=job_id,
        status=status.value,
        has_result=job.result is not None,
        num_speakers=len(response.speakers) if response.speakers else 0,
        num_segments=len(response.segments) if response.segments else 0,
        has_error=job.error_message is not None,
        duration_ms=round(duration_ms, 2),
        user_id=user.user_id,
    )

    return response


@router.post(
    "/diarization/sync",
    response_model=DiarizationResponse,
    summary="Sync diarization",
    description="""
Diarize audio synchronously (blocking request).

**Speaker diarization** identifies "who spoke when" in an audio file.

**Use cases:**
- Short audio files (<5 minutes)
- Real-time applications requiring immediate results
- Testing and demos

**Limitations:**
- Maximum file size: 50MB
- Request timeout applies
- No webhook support
- No persistent storage (result not saved)

**Speaker detection:**
- Set `num_speakers` if you know the exact count
- Use `min_speakers` and `max_speakers` for range detection
- Leave empty for automatic detection

For longer files or production workloads, use the async `POST /v1/diarization` endpoint.
""",
    responses={
        200: {"description": "Diarization completed successfully"},
        400: {"description": "Invalid audio format"},
        413: {"description": "File too large (max 50MB)"},
        422: {"description": "Validation error"},
        500: {"description": "Diarization service error"},
    },
)
async def sync_diarization(
    user: RateLimitedUser,
    settings: Annotated[Settings, Depends(get_settings)],
    audio: UploadFile = File(..., description="Audio file to diarize (wav, mp3, m4a, flac, ogg, webm)"),
    num_speakers: int | None = Form(None, ge=1, le=20, description="Exact number of speakers (if known)"),
    min_speakers: int | None = Form(None, ge=1, description="Minimum number of speakers"),
    max_speakers: int | None = Form(None, le=20, description="Maximum number of speakers"),
) -> DiarizationResponse:
    """
    Synchronous diarization for short audio.

    Identifies speakers and returns results immediately (blocking).
    Best for short audio files (<5 minutes, <50MB).

    The result is NOT persisted - use async endpoint for that.
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())

    logger.info(
        "sync_diarization_started",
        request_id=request_id,
        filename=audio.filename,
        content_type=audio.content_type,
        num_speakers=num_speakers,
        min_speakers=min_speakers,
        max_speakers=max_speakers,
        user_id=user.user_id,
    )

    # Validate format
    try:
        audio_format = validate_audio_format(audio.filename or "audio.wav")
    except InvalidAudioFormatError as e:
        logger.warning(
            "sync_diarization_invalid_format",
            request_id=request_id,
            filename=audio.filename,
            error=str(e),
        )
        raise

    # Check file size
    audio.file.seek(0, 2)
    size = audio.file.tell()
    audio.file.seek(0)

    logger.debug(
        "sync_diarization_file_info",
        request_id=request_id,
        size_bytes=size,
        size_mb=round(size / (1024 * 1024), 2),
        format=audio_format,
    )

    if size > 50 * 1024 * 1024:
        logger.warning(
            "sync_diarization_file_too_large",
            request_id=request_id,
            size_mb=round(size / (1024 * 1024), 2),
            max_mb=50,
        )
        raise FileTooLargeError(size / (1024 * 1024), 50)

    # Save to temp file
    content = await audio.read()
    with tempfile.NamedTemporaryFile(suffix=f".{audio_format}", delete=False) as f:
        f.write(content)
        temp_path = Path(f.name)

    try:
        backend = get_diarization_backend(settings)

        diarize_start = time.time()
        result = await backend.diarize(
            temp_path,
            num_speakers=num_speakers,
            min_speakers=min_speakers,
            max_speakers=max_speakers,
        )
        diarize_duration_ms = (time.time() - diarize_start) * 1000

        total_duration_ms = (time.time() - start_time) * 1000

        # Get audio duration from stats if available
        audio_duration = result.stats.audio_duration if result.stats else 0

        logger.info(
            "sync_diarization_completed",
            request_id=request_id,
            audio_duration=audio_duration,
            num_speakers=len(result.speakers) if result.speakers else 0,
            num_segments=len(result.segments) if result.segments else 0,
            num_overlaps=len(result.overlaps) if result.overlaps else 0,
            diarize_duration_ms=round(diarize_duration_ms, 2),
            total_duration_ms=round(total_duration_ms, 2),
            realtime_factor=round(audio_duration / (total_duration_ms / 1000), 2) if audio_duration > 0 else 0,
            user_id=user.user_id,
        )

        return DiarizationResponse(
            id=request_id,
            status=TranscriptionStatus.COMPLETED,
            created_at=datetime.now(timezone.utc),
            completed_at=datetime.now(timezone.utc),
            speakers=result.speakers,
            segments=result.segments,
            overlaps=result.overlaps,
            stats=result.stats,
            rttm=result.rttm,
        )

    except Exception as e:
        total_duration_ms = (time.time() - start_time) * 1000
        logger.error(
            "sync_diarization_failed",
            request_id=request_id,
            error=str(e),
            error_type=type(e).__name__,
            duration_ms=round(total_duration_ms, 2),
            user_id=user.user_id,
        )
        raise HTTPException(
            status_code=500,
            detail={
                "error": {
                    "message": f"Diarization failed: {str(e)}",
                    "type": "diarization_error",
                    "param": None,
                    "code": "diarization_service_error",
                }
            },
        )

    finally:
        temp_path.unlink(missing_ok=True)
