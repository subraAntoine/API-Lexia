import json
from datetime import datetime
from src.models.stt import TranscriptionResponse, TranscriptionStatus, TranscriptionWord, TranscriptionSegment

# Mock data based on user example
words_data = [
    {
      "text": "Bonjour,",
      "start": 0,
      "end": 472,
      "confidence": 0.9,
      "speaker": None
    },
    {
      "text": "bienvenue",
      "start": 472,
      "end": 944,
      "confidence": 0.9,
      "speaker": None
    }
]

segments_data = [
    {
      "id": 0,
      "text": "Bonjour, bienvenue à Montpellier...",
      "start": 0,
      "end": 25040,
      "confidence": 0.9,
      "words": None,
      "speaker": None
    }
]

# Create Pydantic model instance
response = TranscriptionResponse(
    id="4dd79c2e-6a05-403c-910f-fea493aa0daf",
    status=TranscriptionStatus.COMPLETED,
    audio_url=None,
    audio_duration=None,
    text="Bonjour, bienvenue à Montpellier...",
    words=[TranscriptionWord(**w) for w in words_data],
    confidence=0.9,
    utterances=None,
    language_code="fr",
    language_detection=False,
    language_confidence=0.9,
    punctuate=True,
    format_text=True,
    speaker_labels=False,
    speakers_expected=None,
    webhook_url=None,
    webhook_status_code=None,
    error=None,
    created_at=datetime.fromisoformat("2026-01-19T09:33:57.409399"),
    completed_at=datetime.fromisoformat("2026-01-19T09:34:32.283540"),
    segments=[TranscriptionSegment(**s) for s in segments_data],
    speakers=None,
    metadata=None
)

# Dump to JSON
json_output = response.model_dump(mode='json')

print(json.dumps(json_output, indent=2))
