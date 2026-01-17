"""
Abstract base class for Speaker Diarization backends.

Provides a consistent interface for speaker diarization across different backends.
AssemblyAI format: times in milliseconds, speakers as A, B, C, etc.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from pathlib import Path

from src.models.stt import DiarizationStats, OverlapSegment, Speaker, SpeakerSegment, Utterance


@dataclass
class DiarizationResult:
    """Internal result from speaker diarization (AssemblyAI format)."""

    speakers: list[Speaker] = field(default_factory=list)
    segments: list[SpeakerSegment] = field(default_factory=list)
    utterances: list[Utterance] = field(default_factory=list)  # AssemblyAI format
    overlaps: list[OverlapSegment] = field(default_factory=list)
    stats: DiarizationStats | None = None
    rttm: str | None = None  # RTTM format output


# Helper function to convert speaker index to AssemblyAI letter format
def speaker_index_to_letter(index: int) -> str:
    """Convert speaker index (0, 1, 2...) to letter (A, B, C...)."""
    return chr(ord('A') + index)


def speaker_id_to_letter(speaker_id: str) -> str:
    """Convert speaker ID (SPEAKER_00, SPEAKER_01...) to letter (A, B, C...)."""
    try:
        # Extract number from SPEAKER_XX format
        if speaker_id.startswith("SPEAKER_"):
            index = int(speaker_id.split("_")[1])
            return speaker_index_to_letter(index)
        return speaker_id
    except (ValueError, IndexError):
        return speaker_id


class DiarizationBackend(ABC):
    """Abstract base class for speaker diarization backends."""

    @abstractmethod
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
        """
        Perform speaker diarization on an audio file.

        Args:
            audio_path: Path to the audio file.
            num_speakers: Exact number of speakers (if known).
            min_speakers: Minimum number of speakers.
            max_speakers: Maximum number of speakers.
            min_segment_duration: Minimum segment duration in seconds.
            merge_gaps: Merge segments with gaps smaller than this (seconds).
            **kwargs: Additional backend-specific options.

        Returns:
            DiarizationResult with speaker segments and statistics.

        Raises:
            DiarizationServiceError: If diarization fails.
        """
        ...

    @abstractmethod
    async def diarize_bytes(
        self,
        audio_data: bytes,
        audio_format: str = "wav",
        num_speakers: int | None = None,
        min_speakers: int | None = None,
        max_speakers: int | None = None,
        **kwargs: object,
    ) -> DiarizationResult:
        """
        Perform diarization on audio from bytes.

        Args:
            audio_data: Raw audio data.
            audio_format: Audio format (wav, mp3, etc.).
            num_speakers: Exact number of speakers.
            min_speakers: Minimum speakers.
            max_speakers: Maximum speakers.
            **kwargs: Additional options.

        Returns:
            DiarizationResult.
        """
        ...

    @abstractmethod
    async def health_check(self) -> bool:
        """
        Check if the diarization backend is healthy.

        Returns:
            True if backend is operational.
        """
        ...

    def generate_rttm(
        self,
        segments: list[SpeakerSegment],
        audio_id: str = "audio",
    ) -> str:
        """
        Generate RTTM format output from segments.

        RTTM (Rich Transcription Time Marked) format:
        SPEAKER <file> 1 <start> <duration> <NA> <NA> <speaker> <NA> <NA>
        
        Note: RTTM uses seconds, but our segments use milliseconds (AssemblyAI format).

        Args:
            segments: List of speaker segments (times in milliseconds).
            audio_id: Audio file identifier.

        Returns:
            RTTM formatted string.
        """
        lines = []
        for seg in segments:
            # Convert from milliseconds to seconds for RTTM format
            start_sec = seg.start / 1000.0
            duration_sec = (seg.end - seg.start) / 1000.0
            line = f"SPEAKER {audio_id} 1 {start_sec:.3f} {duration_sec:.3f} <NA> <NA> {seg.speaker} <NA> <NA>"
            lines.append(line)
        return "\n".join(lines)

    def compute_speaker_stats(
        self,
        segments: list[SpeakerSegment],
    ) -> dict[str, Speaker]:
        """
        Compute statistics per speaker (AssemblyAI format: milliseconds).

        Args:
            segments: List of speaker segments (times in milliseconds).

        Returns:
            Dictionary mapping speaker ID to Speaker with stats.
        """
        speaker_data: dict[str, list[SpeakerSegment]] = {}

        for seg in segments:
            if seg.speaker not in speaker_data:
                speaker_data[seg.speaker] = []
            speaker_data[seg.speaker].append(seg)

        # Compute total duration across all speakers for percentage calculation
        total_all_speakers = sum(
            seg.end - seg.start for segs in speaker_data.values() for seg in segs
        )

        speakers = {}
        for speaker_id, segs in speaker_data.items():
            total_duration = sum(s.end - s.start for s in segs)  # Already in ms
            avg_duration = int(total_duration / len(segs)) if segs else 0
            percentage = (total_duration / total_all_speakers * 100) if total_all_speakers > 0 else 0

            speakers[speaker_id] = Speaker(
                id=speaker_id,
                total_duration=total_duration,  # In milliseconds
                num_segments=len(segs),
                avg_segment_duration=avg_duration,  # In milliseconds
                percentage=round(percentage, 2),
            )

        return speakers
