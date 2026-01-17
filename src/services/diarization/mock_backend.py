"""
Mock diarization backend for development and testing.
AssemblyAI format: times in milliseconds, speakers as A, B, C, etc.
"""

import asyncio
from pathlib import Path

from src.core.logging import get_logger
from src.models.stt import DiarizationStats, OverlapSegment, Speaker, SpeakerSegment, Utterance
from src.services.diarization.base import DiarizationBackend, DiarizationResult, speaker_index_to_letter

logger = get_logger(__name__)


class MockDiarizationBackend(DiarizationBackend):
    """Mock diarization backend for development (AssemblyAI format)."""

    def __init__(self, response_delay: float = 0.5) -> None:
        self.response_delay = response_delay

    def _generate_mock_result(self, duration_sec: float) -> DiarizationResult:
        """Generate mock diarization result in AssemblyAI format."""
        duration_ms = int(duration_sec * 1000)  # Convert to milliseconds
        
        # Create 2-3 mock speakers with letter format (A, B, C...)
        num_speakers = 2
        speakers = []
        segments = []

        # Generate alternating segments
        current_time_ms = 0
        segment_duration_ms = duration_ms // 8  # 8 segments total

        for i in range(8):
            speaker_letter = speaker_index_to_letter(i % num_speakers)  # A, B, A, B...
            end_time_ms = min(current_time_ms + segment_duration_ms, duration_ms)

            segments.append(
                SpeakerSegment(
                    speaker=speaker_letter,
                    start=current_time_ms,
                    end=end_time_ms,
                    confidence=0.95,
                )
            )
            current_time_ms = end_time_ms

        # Compute speaker stats
        speaker_stats = self.compute_speaker_stats(segments)
        speakers = list(speaker_stats.values())

        # Add one mock overlap (in milliseconds)
        overlaps = []
        if len(segments) > 2:
            overlap_start_ms = segments[1].end - 500  # 500ms before segment end
            overlap_end_ms = segments[1].end
            overlaps.append(
                OverlapSegment(
                    speakers=["A", "B"],
                    start=overlap_start_ms,
                    end=overlap_end_ms,
                    duration=500,  # 500ms
                )
            )

        stats = DiarizationStats(
            version="1.0-mock",
            model="mock-diarization",
            audio_duration=duration_ms,  # In milliseconds
            num_speakers=num_speakers,
            num_segments=len(segments),
            num_overlaps=len(overlaps),
            overlap_duration=sum(o.duration for o in overlaps),  # In milliseconds
            processing_time=int(self.response_delay * 1000),  # In milliseconds
        )

        rttm = self.generate_rttm(segments, "mock_audio")
        
        # Create utterances (AssemblyAI format)
        utterances = [
            Utterance(
                speaker=seg.speaker,
                start=seg.start,
                end=seg.end,
                text="",  # No transcription in diarization-only mode
                confidence=seg.confidence,
            )
            for seg in segments
        ]

        return DiarizationResult(
            speakers=speakers,
            segments=segments,
            utterances=utterances,  # AssemblyAI format
            overlaps=overlaps,
            stats=stats,
            rttm=rttm,
        )

    async def diarize(
        self,
        audio_path: Path | str,
        num_speakers: int | None = None,
        min_speakers: int | None = None,
        max_speakers: int | None = None,
        min_segment_duration: float = 0.0,
        merge_gaps: float = 0.0,
        **kwargs: object,
    ) -> DiarizationResult:
        """Generate mock diarization."""
        logger.info("mock_diarization", audio_path=str(audio_path))

        await asyncio.sleep(self.response_delay)

        # Estimate duration (mock: 60 seconds)
        duration = 60.0
        return self._generate_mock_result(duration)

    async def diarize_bytes(
        self,
        audio_data: bytes,
        audio_format: str = "wav",
        num_speakers: int | None = None,
        min_speakers: int | None = None,
        max_speakers: int | None = None,
        **kwargs: object,
    ) -> DiarizationResult:
        """Generate mock diarization from bytes."""
        logger.info("mock_diarization_bytes", size=len(audio_data))

        await asyncio.sleep(self.response_delay)

        duration = len(audio_data) / (16000 * 2)
        return self._generate_mock_result(duration)

    async def health_check(self) -> bool:
        """Mock backend is always healthy."""
        return True
