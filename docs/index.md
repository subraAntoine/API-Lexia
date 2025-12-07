---
layout: default
title: Home
---

# Lexia API

> Production-ready API for LLM inference, Speech-to-Text, and Speaker Diarization.

## Overview

Lexia API is a complete API solution for AI-powered audio processing and language model inference. Built with FastAPI, it provides:

- **LLM Inference**: Chat completion with vLLM backend, streaming, and tool calling
- **Speech-to-Text**: Audio transcription with Whisper (French-optimized)
- **Speaker Diarization**: Speaker separation with Pyannote

## Quick Links

- [API Reference](API) - Complete endpoint documentation
- [Deployment Guide](DEPLOYMENT) - How to deploy in production
- [Production Checklist](PRODUCTION_CHECKLIST) - Pre-launch verification

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Lexia API (FastAPI)                      │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌───────────────┐ │
│  │   LLM   │  │   STT   │  │ Diarize  │  │     Jobs      │ │
│  │ Router  │  │ Router  │  │  Router  │  │    Router     │ │
│  └────┬────┘  └────┬────┘  └────┬─────┘  └───────┬───────┘ │
└───────┼────────────┼────────────┼────────────────┼──────────┘
        │            │            │                │
        ▼            ▼            ▼                ▼
┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
│   vLLM    │  │  Whisper  │  │ Pyannote  │  │  Celery   │
│  Server   │  │  Server   │  │  Server   │  │  Workers  │
│  (GPU)    │  │  (GPU)    │  │  (GPU)    │  │           │
└───────────┘  └───────────┘  └───────────┘  └─────┬─────┘
                                                   │
        ┌──────────────────────────────────────────┤
        ▼                                          ▼
┌───────────────┐                          ┌───────────────┐
│  PostgreSQL   │                          │     Redis     │
│  (Jobs, Keys) │                          │ (Queue/Cache) │
└───────────────┘                          └───────────────┘
```

## Features

### LLM Inference
- OpenAI-compatible API (`/v1/chat/completions`)
- Streaming responses
- Tool/Function calling support
- Multiple model support

### Speech-to-Text
- Async and sync transcription
- French-optimized Whisper model
- Multiple audio formats (WAV, MP3, M4A, FLAC, OGG, WEBM)
- Word-level timestamps

### Speaker Diarization
- Automatic speaker detection
- Configurable speaker count
- Overlap detection
- RTTM format output

### Security & Performance
- API key authentication
- Rate limiting (Redis-backed)
- Async job processing (Celery)
- S3/MinIO storage support

## Quick Start

### Development Mode (No GPU)

```bash
# Clone and navigate
cd API-Lexia

# Copy environment file
cp docker/.env.example docker/.env

# Start dev stack (with mocks)
docker compose -f docker/docker-compose.dev.yml up -d

# API available at http://localhost:8000
# Swagger docs at http://localhost:8000/redoc
```

### Production Mode (GPU)

```bash
# Configure environment
cp docker/.env.example docker/.env
# Edit .env with your settings

# Start production stack
docker compose -f docker/docker-compose.yml up -d

# Check health
curl http://localhost:8000/health
```

## API Examples

### Chat Completion

```bash
curl -X POST -H "Authorization: Bearer lx_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "general7Bv2",
    "messages": [{"role": "user", "content": "Bonjour!"}]
  }' \
  http://localhost:8000/v1/chat/completions
```

### Transcription

```bash
curl -X POST -H "Authorization: Bearer lx_your_key" \
  -F "audio=@audio.wav" \
  -F "language_code=fr" \
  http://localhost:8000/v1/transcriptions
```

### Diarization

```bash
curl -X POST -H "Authorization: Bearer lx_your_key" \
  -F "audio=@meeting.wav" \
  -F "num_speakers=3" \
  http://localhost:8000/v1/diarization
```

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | FastAPI |
| LLM | vLLM |
| STT | Faster-Whisper |
| Diarization | Pyannote.audio |
| Database | PostgreSQL |
| Queue | Celery + Redis |
| Storage | S3/MinIO |

## License

MIT License
