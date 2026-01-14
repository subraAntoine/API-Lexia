"""
Jobs API router.

Provides job management endpoints for async operations.
Jobs track long-running tasks like transcription and diarization.
"""

import time
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.auth import CurrentUser
from src.core.exceptions import JobNotFoundError
from src.core.logging import get_logger
from src.db.repositories.job import JobRepository
from src.db.session import get_db
from src.models.jobs import (
    JobError,
    JobProgress,
    JobResponse,
    JobStatus,
    JobType,
)

logger = get_logger(__name__)

router = APIRouter(prefix="/v1/jobs", tags=["Jobs"])


def map_job_status(status: str) -> JobStatus:
    """Map database status to JobStatus enum."""
    status_map = {
        "pending": JobStatus.PENDING,
        "queued": JobStatus.QUEUED,
        "processing": JobStatus.PROCESSING,
        "completed": JobStatus.COMPLETED,
        "failed": JobStatus.FAILED,
        "cancelled": JobStatus.CANCELLED,
    }
    return status_map.get(status, JobStatus.PENDING)


def map_job_type(job_type: str) -> JobType:
    """Map database type to JobType enum."""
    type_map = {
        "transcription": JobType.TRANSCRIPTION,
        "diarization": JobType.DIARIZATION,
        "transcription_with_diarization": JobType.TRANSCRIPTION_WITH_DIARIZATION,
    }
    return type_map.get(job_type, JobType.TRANSCRIPTION)


@router.get(
    "",
    response_model=list[JobResponse],
    summary="List jobs",
    description="""
List all jobs for the authenticated user.

**Job types:**
- `transcription`: Audio-to-text conversion
- `diarization`: Speaker identification ("who spoke when")
- `transcription_with_diarization`: Both combined

**Job statuses:**
- `pending`: Job created, waiting to be queued
- `queued`: Job in queue, waiting for worker
- `processing`: Job currently being processed
- `completed`: Job finished successfully
- `failed`: Job failed (check `error` field)
- `cancelled`: Job was cancelled by user

**Pagination:**
- Use `limit` and `offset` for pagination
- Default: 50 jobs per page, max 100
""",
    responses={
        200: {"description": "List of jobs retrieved successfully"},
    },
)
async def list_jobs(
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    status: JobStatus | None = Query(None, description="Filter by job status"),
    job_type: JobType | None = Query(None, description="Filter by job type"),
    limit: int = Query(50, ge=1, le=100, description="Maximum number of jobs to return"),
    offset: int = Query(0, ge=0, description="Number of jobs to skip"),
) -> list[JobResponse]:
    """
    List jobs for the authenticated user.

    Returns paginated list of jobs with optional filtering by status and type.
    Jobs are ordered by creation date (newest first).
    """
    start_time = time.time()

    logger.debug(
        "list_jobs_request",
        status_filter=status.value if status else None,
        type_filter=job_type.value if job_type else None,
        limit=limit,
        offset=offset,
        user_id=user.user_id,
    )

    job_repo = JobRepository(db)

    jobs = await job_repo.get_by_user(
        user_id=user.user_id,
        status=status.value if status else None,
        job_type=job_type.value if job_type else None,
        limit=limit,
        offset=offset,
    )

    # Count jobs by status for logging
    status_counts: dict[str, int] = {}
    for job in jobs:
        status_counts[job.status] = status_counts.get(job.status, 0) + 1

    duration_ms = (time.time() - start_time) * 1000
    logger.info(
        "list_jobs_completed",
        total_jobs=len(jobs),
        status_counts=status_counts,
        limit=limit,
        offset=offset,
        has_more=len(jobs) == limit,
        duration_ms=round(duration_ms, 2),
        user_id=user.user_id,
    )

    return [
        JobResponse(
            id=str(job.id),
            type=map_job_type(job.type),
            status=map_job_status(job.status),
            created_at=job.created_at,
            started_at=job.started_at,
            completed_at=job.completed_at,
            progress=JobProgress(
                percentage=job.progress_percent,
                message=job.progress_message,
            ) if job.progress_percent > 0 else None,
            result_url=job.result_url,
            result=job.result,
            error=JobError(
                code=job.error_code or "ERROR",
                message=job.error_message or "Unknown error",
            ) if job.error_message else None,
            metadata=job.extra_data,  # SQLAlchemy reserves 'metadata'
            webhook_url=job.webhook_url,
            user_id=job.user_id,
        )
        for job in jobs
    ]


@router.get(
    "/{job_id}",
    response_model=JobResponse,
    summary="Get job",
    description="""
Get details of a specific job by ID.

**Job information includes:**
- `type`: The kind of job (transcription, diarization, etc.)
- `status`: Current state (pending, queued, processing, completed, failed, cancelled)
- `progress`: Real-time progress for running jobs (percentage, message)
- `result`: Output data when completed (varies by job type)
- `error`: Error details if the job failed

**Polling pattern:**
For async jobs, poll this endpoint periodically until `status` is `completed` or `failed`.
Recommended polling interval: 2-5 seconds.

**Alternative:** Use webhooks to get notified when jobs complete.
""",
    responses={
        200: {"description": "Job retrieved successfully"},
        400: {"description": "Invalid job ID format"},
        404: {"description": "Job not found"},
    },
)
async def get_job(
    job_id: str,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> JobResponse:
    """
    Get job by ID.

    Returns full job details including progress and results.
    Use this endpoint to poll job status or retrieve completed results.
    """
    start_time = time.time()

    # Validate UUID format
    try:
        parsed_id = uuid.UUID(job_id)
    except ValueError:
        logger.warning(
            "invalid_job_id_format",
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
    if job is None:
        logger.info(
            "job_not_found",
            job_id=job_id,
            user_id=user.user_id,
        )
        raise JobNotFoundError(job_id)

    # Check ownership (return 404 to avoid leaking existence)
    if job.user_id != user.user_id:
        logger.warning(
            "job_access_denied",
            job_id=job_id,
            owner_id=job.user_id,
            requester_id=user.user_id,
        )
        raise JobNotFoundError(job_id)

    status = map_job_status(job.status)

    duration_ms = (time.time() - start_time) * 1000
    logger.info(
        "job_retrieved",
        job_id=job_id,
        job_type=job.type,
        status=status.value,
        has_progress=job.progress_percent > 0,
        progress_percent=job.progress_percent,
        has_result=job.result is not None,
        has_error=job.error_message is not None,
        duration_ms=round(duration_ms, 2),
        user_id=user.user_id,
    )

    return JobResponse(
        id=str(job.id),
        type=map_job_type(job.type),
        status=status,
        created_at=job.created_at,
        started_at=job.started_at,
        completed_at=job.completed_at,
        progress=JobProgress(
            percentage=job.progress_percent,
            message=job.progress_message,
        ) if job.progress_percent > 0 else None,
        result_url=job.result_url,
        result=job.result,
        error=JobError(
            code=job.error_code or "ERROR",
            message=job.error_message or "Unknown error",
        ) if job.error_message else None,
        metadata=job.extra_data,  # SQLAlchemy reserves 'metadata'
        webhook_url=job.webhook_url,
        user_id=job.user_id,
    )


@router.delete(
    "/{job_id}",
    status_code=204,
    summary="Cancel job",
    description="""
Cancel a pending or queued job.

**Cancellation rules:**
- Only jobs with status `pending` or `queued` can be cancelled
- Jobs that are already `processing`, `completed`, `failed`, or `cancelled` cannot be cancelled
- Cancellation is immediate and irreversible

**What happens:**
1. The Celery task is revoked (if queued)
2. Job status is set to `cancelled`
3. No webhook is sent for cancelled jobs

**Note:** If you need to stop a job that's already processing, 
contact support as this may require manual intervention.
""",
    responses={
        204: {"description": "Job cancelled successfully"},
        400: {"description": "Invalid job ID format or job cannot be cancelled"},
        404: {"description": "Job not found"},
    },
)
async def cancel_job(
    job_id: str,
    user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    """
    Cancel a job.

    Only pending or queued jobs can be cancelled.
    Processing jobs cannot be cancelled via API.
    """
    start_time = time.time()

    # Validate UUID format
    try:
        parsed_id = uuid.UUID(job_id)
    except ValueError:
        logger.warning(
            "invalid_job_id_format_cancel",
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
    if job is None:
        logger.info(
            "job_not_found_cancel",
            job_id=job_id,
            user_id=user.user_id,
        )
        raise JobNotFoundError(job_id)

    # Check ownership (return 404 to avoid leaking existence)
    if job.user_id != user.user_id:
        logger.warning(
            "job_cancel_access_denied",
            job_id=job_id,
            owner_id=job.user_id,
            requester_id=user.user_id,
        )
        raise JobNotFoundError(job_id)

    # Check if job can be cancelled
    if job.status not in ("pending", "queued"):
        logger.warning(
            "job_cancel_invalid_status",
            job_id=job_id,
            current_status=job.status,
            user_id=user.user_id,
        )
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "message": f"Cannot cancel job with status '{job.status}'. Only pending or queued jobs can be cancelled.",
                    "type": "invalid_request_error",
                    "param": "job_id",
                    "code": "job_not_cancellable",
                }
            },
        )

    # Cancel Celery task if exists
    celery_revoked = False
    if job.celery_task_id:
        try:
            from src.workers.celery_app import app
            app.control.revoke(job.celery_task_id, terminate=True)
            celery_revoked = True
        except Exception as e:
            logger.error(
                "job_celery_revoke_failed",
                job_id=job_id,
                celery_task_id=job.celery_task_id,
                error=str(e),
            )
            # Continue anyway - update status even if revoke fails

    await job_repo.update_status(job.id, "cancelled")
    await db.commit()

    duration_ms = (time.time() - start_time) * 1000
    logger.info(
        "job_cancelled",
        job_id=job_id,
        job_type=job.type,
        previous_status=job.status,
        celery_revoked=celery_revoked,
        had_celery_task=job.celery_task_id is not None,
        duration_ms=round(duration_ms, 2),
        user_id=user.user_id,
    )
