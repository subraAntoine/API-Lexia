"""
Abstract base class for STT (Speech-to-Text) backends.

Provides a consistent interface for speech recognition across different backends.
Backend uses seconds (float) internally. API layer converts to milliseconds (int) for AssemblyAI compatibility.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from pathlib import Path
from typing import AsyncIterator, BinaryIO

from src.models.stt import StreamingTranscriptChunk


# =============================================================================
# Internal types for backends (times in seconds as float)
# =============================================================================

@dataclass
class WordResult:
    """A word result from transcription (internal, times in seconds)."""
    text: str
    start: float  # Start time in seconds
    end: float    # End time in seconds
    confidence: float = 1.0
    speaker: str | None = None


@dataclass
class SegmentResult:
    """A segment result from transcription (internal, times in seconds)."""
    id: int
    text: str
    start: float  # Start time in seconds
    end: float    # End time in seconds
    confidence: float = 1.0
    words: list[WordResult] = field(default_factory=list)
    speaker: str | None = None


@dataclass
class TranscriptionResult:
    """Internal result from STT transcription (times in seconds)."""

    text: str
    segments: list[SegmentResult] = field(default_factory=list)
    words: list[WordResult] = field(default_factory=list)
    language: str = "fr"
    language_confidence: float = 1.0
    duration: float = 0.0


@dataclass
class AudioInfo:
    """Information about an audio file."""

    duration: float  # Duration in seconds
    sample_rate: int  # Sample rate in Hz
    channels: int  # Number of channels
    format: str  # Audio format (wav, mp3, etc.)
    size_bytes: int  # File size in bytes


class STTBackend(ABC):
    """Abstract base class for STT backends."""

    @abstractmethod
    async def transcribe(
        self,
        audio_path: Path | str,
        language: str | None = None,
        word_timestamps: bool = True,
        **kwargs: object,
    ) -> TranscriptionResult:
        """
        Transcribe an audio file.

        Args:
            audio_path: Path to the audio file.
            language: Language code (e.g., 'fr', 'en'). Auto-detect if None.
            word_timestamps: Include word-level timestamps.
            **kwargs: Additional backend-specific options.

        Returns:
            TranscriptionResult with text and timing information.

        Raises:
            STTServiceError: If transcription fails.
        """
        ...

    @abstractmethod
    async def transcribe_bytes(
        self,
        audio_data: bytes,
        audio_format: str = "wav",
        language: str | None = None,
        word_timestamps: bool = True,
        **kwargs: object,
    ) -> TranscriptionResult:
        """
        Transcribe audio from bytes.

        Args:
            audio_data: Raw audio data.
            audio_format: Audio format (wav, mp3, etc.).
            language: Language code. Auto-detect if None.
            word_timestamps: Include word-level timestamps.
            **kwargs: Additional options.

        Returns:
            TranscriptionResult.
        """
        ...

    @abstractmethod
    async def transcribe_stream(
        self,
        audio_stream: AsyncIterator[bytes],
        sample_rate: int = 16000,
        language: str | None = None,
        **kwargs: object,
    ) -> AsyncIterator[StreamingTranscriptChunk]:
        """
        Transcribe streaming audio.

        Args:
            audio_stream: Async iterator of audio chunks.
            sample_rate: Audio sample rate.
            language: Language code.
            **kwargs: Additional options.

        Yields:
            StreamingTranscriptChunk objects.
        """
        ...

    @abstractmethod
    async def get_audio_info(self, audio_path: Path | str) -> AudioInfo:
        """
        Get information about an audio file.

        Args:
            audio_path: Path to the audio file.

        Returns:
            AudioInfo with duration, format, etc.
        """
        ...

    @abstractmethod
    async def health_check(self) -> bool:
        """
        Check if the STT backend is healthy.

        Returns:
            True if backend is operational.
        """
        ...

    def supports_language(self, language: str) -> bool:
        """
        Check if a language is supported.

        Args:
            language: Language code.

        Returns:
            True if language is supported.
        """
        supported = ["fr", "en", "de", "es", "it", "pt", "nl"]
        return language.lower() in supported
