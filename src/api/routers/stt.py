"""
Speech-to-Text API router.

Provides transcription endpoints for audio files.
"""

import tempfile
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.auth import CurrentUser
from src.core.config import Settings, get_settings
from src.core.exceptions import (
    FileTooLargeError,
    InvalidAudioFormatError,
    TranscriptionNotFoundError,
    ValidationError,
)
from src.core.logging import get_logger
from src.core.rate_limit import RateLimitedUser
from src.db.repositories.job import JobRepository
from src.db.repositories.transcription import TranscriptionRepository
from src.db.session import get_db
from src.models.stt import (
    LanguageCode,
    TranscriptionJob,
    TranscriptionRequest,
    TranscriptionResponse,
    TranscriptionStatus,
)
from src.services.stt.factory import get_stt_backend
from src.services.storage.factory import get_storage_backend
from src.workers.tasks.transcription import process_transcription

router = APIRouter(prefix="/v1", tags=["Speech-to-Text"])
logger = get_logger(__name__)


SUPPORTED_FORMATS = ["wav", "mp3", "m4a", "flac", "ogg", "webm"]


def validate_audio_format(filename: str) -> str:
    """Validate and return audio format from filename."""
    ext = Path(filename).suffix.lower().lstrip(".")
    if ext not in SUPPORTED_FORMATS:
        raise InvalidAudioFormatError(ext, SUPPORTED_FORMATS)
    return ext


@router.post(
    "/transcriptions",
    response_model=TranscriptionJob,
    status_code=202,
    summary="Create transcription job",
    description="Upload audio and create an async transcription job.",
)
async def create_transcription(
    user: RateLimitedUser,
    settings: Annotated[Settings, Depends(get_settings)],
    db: Annotated[AsyncSession, Depends(get_db)],
    audio: UploadFile | None = File(None, description="Audio file to transcribe"),
    audio_url: str | None = Form(None, description="URL to audio file"),
    language_code: LanguageCode = Form(LanguageCode.FR, description="Language code or 'auto' for detection"),
    language_detection: bool = Form(False, description="Enable automatic language detection"),
    punctuate: bool = Form(True, description="Enable automatic punctuation"),
    format_text: bool = Form(True, description="Enable text formatting"),
    speaker_labels: bool = Form(False, description="Enable speaker diarization"),
    speakers_expected: int | None = Form(None, ge=1, le=20, description="Set exact number of speakers"),
    webhook_url: str | None = Form(None, description="URL to call when transcription is complete"),
) -> TranscriptionJob:
    """
    Create a new transcription job.

    Upload an audio file or provide a URL for transcription.
    Returns a job ID for polling the result.
    """
    start_time = time.time()
    storage = get_storage_backend(settings)
    job_repo = JobRepository(db)
    trans_repo = TranscriptionRepository(db)

    # Validate input: must provide either audio file or audio_url
    if audio is None and audio_url is None:
        logger.warning(
            "transcription_validation_error",
            error="No audio source provided",
            user_id=user.user_id,
        )
        raise ValidationError(
            message="Either 'audio' file or 'audio_url' must be provided.",
            details={"param": "audio"},
        )

    # Validate audio_url format if provided
    if audio_url is not None:
        if not (audio_url.startswith("http://") or audio_url.startswith("https://")):
            logger.warning(
                "transcription_validation_error",
                error="Invalid audio_url format",
                audio_url=audio_url[:100],
                user_id=user.user_id,
            )
            raise ValidationError(
                message="audio_url must be a valid HTTP(S) URL.",
                details={"param": "audio_url", "value": audio_url[:100]},
            )

    # Determine audio source
    audio_storage_key = None
    source_url = audio_url
    audio_format = None
    file_size = None

    if audio is not None:
        # Validate format
        audio_format = validate_audio_format(audio.filename or "audio.wav")

        # Check file size
        audio.file.seek(0, 2)
        file_size = audio.file.tell()
        audio.file.seek(0)

        max_size = settings.stt_max_file_size_mb * 1024 * 1024
        if file_size > max_size:
            logger.warning(
                "transcription_file_too_large",
                file_size_mb=file_size / (1024 * 1024),
                max_size_mb=settings.stt_max_file_size_mb,
                user_id=user.user_id,
            )
            raise FileTooLargeError(
                file_size / (1024 * 1024),
                settings.stt_max_file_size_mb,
            )

        # Upload to storage
        content = await audio.read()
        audio_storage_key = storage.generate_key(
            audio.filename or f"audio.{audio_format}",
            prefix="transcriptions",
        )
        await storage.upload(audio_storage_key, content, f"audio/{audio_format}")
        
        logger.debug(
            "audio_uploaded_to_storage",
            storage_key=audio_storage_key,
            file_size=file_size,
            format=audio_format,
        )

    elif audio_url is not None:
        source_url = audio_url

    # Create job
    job = await job_repo.create(
        job_type="transcription",
        params={
            "language_code": language_code.value,
            "language_detection": language_detection,
            "punctuate": punctuate,
            "format_text": format_text,
            "speaker_labels": speaker_labels,
            "speakers_expected": speakers_expected,
        },
        user_id=user.user_id,
        api_key_id=uuid.UUID(user.api_key_id),
        webhook_url=webhook_url,
    )

    # Create transcription record
    transcription = await trans_repo.create(
        job_id=job.id,
        audio_url=source_url,
        audio_storage_key=audio_storage_key,
        language_code=language_code.value if language_code != LanguageCode.AUTO else None,
        speaker_diarization=speaker_labels,
        word_timestamps=True,  # Always enabled for AssemblyAI compatibility
        user_id=user.user_id,
        api_key_id=uuid.UUID(user.api_key_id),
    )

    await db.commit()

    # Queue async processing
    if audio_storage_key:
        task = process_transcription.delay(
            str(job.id),
            audio_storage_key,
            language_code.value if language_code != LanguageCode.AUTO else None,
            speaker_labels,
            True,  # word_timestamps always enabled for AssemblyAI compatibility
        )
        await job_repo.set_celery_task_id(job.id, task.id)
        await db.commit()

    duration_ms = (time.time() - start_time) * 1000
    logger.info(
        "transcription_job_created",
        job_id=str(job.id),
        transcription_id=str(transcription.id),
        language=language_code.value,
        language_detection=language_detection,
        speaker_labels=speaker_labels,
        has_webhook=webhook_url is not None,
        duration_ms=round(duration_ms, 2),
        user_id=user.user_id,
    )

    return TranscriptionJob(
        id=str(transcription.id),
        status=TranscriptionStatus.QUEUED,
        created_at=job.created_at,
        audio_url=source_url,
    )


@router.get(
    "/transcriptions/{transcription_id}",
    response_model=TranscriptionResponse,
    summary="Get transcription",
    description="Get the status and result of a transcription.",
    responses={
        200: {"description": "Transcription retrieved successfully"},
        400: {"description": "Invalid transcription ID format"},
        404: {"description": "Transcription not found"},
    },
)
async def get_transcription(
    transcription_id: str,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TranscriptionResponse:
    """
    Get transcription by ID.

    Returns the transcription status and result if complete.
    The response format follows AssemblyAI conventions.
    """
    start_time = time.time()

    # Validate UUID format
    try:
        parsed_id = uuid.UUID(transcription_id)
    except ValueError:
        logger.warning(
            "invalid_transcription_id_format",
            transcription_id=transcription_id,
            user_id=user.user_id,
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "message": f"Invalid transcription ID format: {transcription_id}",
                    "type": "invalid_request_error",
                    "param": "transcription_id",
                    "code": "invalid_id_format",
                }
            },
        )

    trans_repo = TranscriptionRepository(db)
    transcription = await trans_repo.get_by_id(parsed_id)

    if transcription is None:
        logger.info(
            "transcription_not_found",
            transcription_id=transcription_id,
            user_id=user.user_id,
        )
        raise TranscriptionNotFoundError(transcription_id)

    # Check ownership (return 404 to avoid leaking existence)
    if transcription.user_id != user.user_id:
        logger.warning(
            "transcription_access_denied",
            transcription_id=transcription_id,
            owner_id=transcription.user_id,
            requester_id=user.user_id,
        )
        raise TranscriptionNotFoundError(transcription_id)

    # Map status (database values to API enum)
    status_map = {
        "queued": TranscriptionStatus.QUEUED,
        "processing": TranscriptionStatus.PROCESSING,
        "completed": TranscriptionStatus.COMPLETED,
        "failed": TranscriptionStatus.ERROR,
        "error": TranscriptionStatus.ERROR,
    }
    status = status_map.get(transcription.status, TranscriptionStatus.QUEUED)

    duration_ms = (time.time() - start_time) * 1000
    logger.info(
        "transcription_retrieved",
        transcription_id=transcription_id,
        status=status.value,
        has_text=transcription.text is not None,
        audio_duration=transcription.audio_duration,
        duration_ms=round(duration_ms, 2),
        user_id=user.user_id,
    )
    
    # Compute overall confidence from words if available
    confidence = None
    if transcription.words:
        word_confidences = [w.get("confidence", 0) for w in transcription.words if isinstance(w, dict)]
        if word_confidences:
            confidence = sum(word_confidences) / len(word_confidences)

    return TranscriptionResponse(
        id=str(transcription.id),
        status=status,
        audio_url=transcription.audio_url,
        audio_duration=int(transcription.audio_duration) if transcription.audio_duration else None,
        text=transcription.text,
        words=transcription.words,
        confidence=confidence,
        utterances=transcription.utterances,
        language_code=transcription.language_detected or transcription.language_code,
        language_detection=transcription.language_code is None,
        language_confidence=transcription.language_confidence,
        punctuate=True,  # Always enabled
        format_text=True,  # Always enabled
        speaker_labels=transcription.speaker_diarization,
        webhook_url=None,  # Not stored in transcription record
        error=transcription.error,
        created_at=transcription.created_at,
        completed_at=transcription.completed_at,
        segments=transcription.segments,  # Legacy
        speakers=transcription.speakers,  # Legacy
        metadata=transcription.extra_data,
    )


@router.post(
    "/transcriptions/sync",
    response_model=TranscriptionResponse,
    summary="Sync transcription",
    description="""
Transcribe audio synchronously (blocking request).

**Use cases:**
- Short audio files (<5 minutes)
- Real-time applications requiring immediate results
- Testing and demos

**Limitations:**
- Maximum file size: 50MB
- Request timeout applies
- No webhook support
- No persistent storage (result not saved)

For longer files or production workloads, use the async `POST /v1/transcriptions` endpoint.
""",
    responses={
        200: {"description": "Transcription completed successfully"},
        400: {"description": "Invalid audio format or file too large"},
        422: {"description": "Validation error"},
        500: {"description": "Transcription service error"},
    },
)
async def sync_transcription(
    user: RateLimitedUser,
    settings: Annotated[Settings, Depends(get_settings)],
    audio: UploadFile = File(..., description="Audio file to transcribe (wav, mp3, m4a, flac, ogg, webm)"),
    language_code: LanguageCode = Form(LanguageCode.FR, description="Language code or 'auto' for detection"),
    punctuate: bool = Form(True, description="Enable automatic punctuation"),
    format_text: bool = Form(True, description="Enable text formatting"),
) -> TranscriptionResponse:
    """
    Synchronous transcription.

    Transcribes audio and returns the result immediately (blocking).
    Best for short audio files (<5 minutes, <50MB).

    The transcription is NOT persisted - use async endpoint for that.
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())

    logger.info(
        "sync_transcription_started",
        request_id=request_id,
        filename=audio.filename,
        content_type=audio.content_type,
        language_code=language_code.value,
        punctuate=punctuate,
        format_text=format_text,
        user_id=user.user_id,
    )

    # Validate format
    try:
        audio_format = validate_audio_format(audio.filename or "audio.wav")
    except InvalidAudioFormatError as e:
        logger.warning(
            "sync_transcription_invalid_format",
            request_id=request_id,
            filename=audio.filename,
            error=str(e),
        )
        raise

    # Check file size (limit for sync: 50MB)
    audio.file.seek(0, 2)
    size = audio.file.tell()
    audio.file.seek(0)

    logger.debug(
        "sync_transcription_file_info",
        request_id=request_id,
        size_bytes=size,
        size_mb=round(size / (1024 * 1024), 2),
        format=audio_format,
    )

    if size > 50 * 1024 * 1024:
        logger.warning(
            "sync_transcription_file_too_large",
            request_id=request_id,
            size_mb=round(size / (1024 * 1024), 2),
            max_mb=50,
        )
        raise FileTooLargeError(
            size / (1024 * 1024),
            50,
        )

    # Save to temp file
    content = await audio.read()
    with tempfile.NamedTemporaryFile(suffix=f".{audio_format}", delete=False) as f:
        f.write(content)
        temp_path = Path(f.name)

    try:
        # Transcribe
        stt_backend = get_stt_backend(settings)

        transcribe_start = time.time()
        result = await stt_backend.transcribe(
            temp_path,
            language=language_code.value if language_code != LanguageCode.AUTO else None,
            word_timestamps=True,  # Always enabled for AssemblyAI compatibility
        )
        transcribe_duration_ms = (time.time() - transcribe_start) * 1000

        # Build words in AssemblyAI format (milliseconds)
        words = [
            {
                "text": w.text,
                "start": int(w.start * 1000),  # Convert to ms
                "end": int(w.end * 1000),      # Convert to ms
                "confidence": w.confidence,
                "speaker": None,  # No diarization in sync mode
            }
            for w in result.words
        ]
        
        # Compute overall confidence
        confidence = None
        if words:
            word_confidences = [w["confidence"] for w in words]
            confidence = sum(word_confidences) / len(word_confidences)

        total_duration_ms = (time.time() - start_time) * 1000

        logger.info(
            "sync_transcription_completed",
            request_id=request_id,
            audio_duration=result.duration,
            text_length=len(result.text) if result.text else 0,
            words_count=len(words),
            language_detected=result.language,
            language_confidence=result.language_confidence,
            transcribe_duration_ms=round(transcribe_duration_ms, 2),
            total_duration_ms=round(total_duration_ms, 2),
            realtime_factor=round(result.duration / (total_duration_ms / 1000), 2) if result.duration > 0 else 0,
            user_id=user.user_id,
        )

        return TranscriptionResponse(
            id=request_id,
            status=TranscriptionStatus.COMPLETED,
            audio_duration=int(result.duration) if result.duration else None,
            text=result.text,
            words=words,
            confidence=confidence,
            language_code=result.language,
            language_detection=language_code == LanguageCode.AUTO,
            language_confidence=result.language_confidence,
            punctuate=True,
            format_text=True,
            speaker_labels=False,
            created_at=datetime.now(timezone.utc),
            completed_at=datetime.now(timezone.utc),
        )

    except Exception as e:
        total_duration_ms = (time.time() - start_time) * 1000
        logger.error(
            "sync_transcription_failed",
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
                    "message": f"Transcription failed: {str(e)}",
                    "type": "transcription_error",
                    "param": None,
                    "code": "stt_service_error",
                }
            },
        )

    finally:
        temp_path.unlink(missing_ok=True)


@router.delete(
    "/transcriptions/{transcription_id}",
    status_code=204,
    summary="Delete transcription",
    description="Delete a transcription and its associated data.",
    responses={
        204: {"description": "Transcription deleted successfully"},
        400: {"description": "Invalid transcription ID format"},
        404: {"description": "Transcription not found"},
    },
)
async def delete_transcription(
    transcription_id: str,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> None:
    """
    Delete a transcription.

    Removes the transcription record and associated audio file from storage.
    This action is irreversible.
    """
    start_time = time.time()

    # Validate UUID format
    try:
        parsed_id = uuid.UUID(transcription_id)
    except ValueError:
        logger.warning(
            "invalid_transcription_id_format_delete",
            transcription_id=transcription_id,
            user_id=user.user_id,
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "message": f"Invalid transcription ID format: {transcription_id}",
                    "type": "invalid_request_error",
                    "param": "transcription_id",
                    "code": "invalid_id_format",
                }
            },
        )

    trans_repo = TranscriptionRepository(db)
    storage = get_storage_backend(settings)

    transcription = await trans_repo.get_by_id(parsed_id)
    if transcription is None:
        logger.info(
            "transcription_not_found_delete",
            transcription_id=transcription_id,
            user_id=user.user_id,
        )
        raise TranscriptionNotFoundError(transcription_id)

    # Check ownership (return 404 to avoid leaking existence)
    if transcription.user_id != user.user_id:
        logger.warning(
            "transcription_delete_access_denied",
            transcription_id=transcription_id,
            owner_id=transcription.user_id,
            requester_id=user.user_id,
        )
        raise TranscriptionNotFoundError(transcription_id)

    # Delete audio from storage
    audio_deleted = False
    if transcription.audio_storage_key:
        try:
            await storage.delete(transcription.audio_storage_key)
            audio_deleted = True
        except Exception as e:
            logger.error(
                "transcription_audio_delete_failed",
                transcription_id=transcription_id,
                storage_key=transcription.audio_storage_key,
                error=str(e),
            )
            # Continue with DB deletion even if storage fails

    # Delete record
    await trans_repo.delete(transcription.id)
    await db.commit()

    duration_ms = (time.time() - start_time) * 1000
    logger.info(
        "transcription_deleted",
        transcription_id=transcription_id,
        audio_deleted=audio_deleted,
        had_audio=transcription.audio_storage_key is not None,
        duration_ms=round(duration_ms, 2),
        user_id=user.user_id,
    )
