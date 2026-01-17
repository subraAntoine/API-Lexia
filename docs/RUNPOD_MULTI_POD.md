---
layout: default
title: RunPod Multi-Pod Deployment (Diarization)
---

# RunPod Multi-Pod Deployment Guide

Deploy Lexia API with full diarization support using two separate pods.

## Why Multi-Pod?

> **Problem**: pyannote-audio requires torch < 2.5 while vLLM requires torch 2.9+.
> 
> **Solution**: Run them on separate pods with different torch versions.

| Setup | Diarization | Cost | Complexity |
|-------|-------------|------|------------|
| Single-Pod | ❌ No | ~$0.79/h | Simple |
| **Multi-Pod** | ✅ Yes | ~$1.58/h | Medium |

For single-pod setup (without diarization), see [RUNPOD.md](RUNPOD.md).

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RunPod Multi-Pod Architecture                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────┐  │
│  │     POD 1: API + STT + Diarization  │  │      POD 2: LLM (vLLM)      │  │
│  │            A40 (46GB)               │  │         A40 (46GB)          │  │
│  ├─────────────────────────────────────┤  ├─────────────────────────────┤  │
│  │                                     │  │                             │  │
│  │  ┌──────────────────┐               │  │  ┌──────────────────────┐   │  │
│  │  │   API Gateway    │ :8000         │  │  │       vLLM           │   │  │
│  │  │    (FastAPI)     │───────────────┼──┼─▶│      :8005           │   │  │
│  │  └────────┬─────────┘               │  │  │   torch 2.9.0        │   │  │
│  │           │                         │  │  │      ~20GB           │   │  │
│  │     ┌─────┴─────┐                   │  │  └──────────────────────┘   │  │
│  │     ▼           ▼                   │  │                             │  │
│  │  ┌──────────┐  ┌──────────────┐     │  │  Exposed: :8005             │  │
│  │  │   STT    │  │  Diarization │     │  │                             │  │
│  │  │  :8002   │  │    :8003     │     │  └─────────────────────────────┘  │
│  │  │  ~3GB    │  │    ~4GB      │     │                                   │
│  │  │ Whisper  │  │  pyannote    │     │                                   │
│  │  └──────────┘  └──────────────┘     │                                   │
│  │                                     │                                   │
│  │  torch 2.4.1 (pyannote compatible)  │                                   │
│  │  Exposed: :8000                     │                                   │
│  └─────────────────────────────────────┘                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Pod 1: API Gateway + STT + Diarization

### 1.1 Create Pod

1. Go to [runpod.io](https://runpod.io) > Deploy > GPU Pods
2. Select template: **RunPod Pytorch 2.1.0**
3. Choose GPU: **A40** (46GB)
4. Configure:
   - Container Disk: 50GB
   - Volume Disk: 100GB
   - Volume mount path: `/workspace`
   - Expose HTTP ports: `8000`
5. Click **Deploy**

### 1.2 Initial Setup (Pod 1)

```bash
# Install system dependencies
apt-get update
apt-get install -y \
    python3-pip python3-venv \
    postgresql redis-server \
    ffmpeg libsndfile1 \
    git psmisc lsof

# Clone repository
cd /workspace
git clone https://github.com/subraAntoine/API-Lexia
cd API-Lexia

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install PyTorch 2.4.1 (compatible with pyannote-audio)
pip install --upgrade pip wheel setuptools
pip install torch==2.4.1 torchvision==0.23.0 torchaudio==2.4.1

# Install faster-whisper
pip install faster-whisper ctranslate2==4.4.0

# Install pyannote-audio for diarization
pip install pyannote-audio

# Install other dependencies
pip install "numpy<2"
pip install transformers accelerate safetensors sentencepiece tokenizers
pip install librosa soundfile httpx

# Install project requirements
pip install -r requirements.txt
```

### 1.3 Configure PostgreSQL (Pod 1)

```bash
# Start PostgreSQL
service postgresql start

# Configure authentication
cat > /etc/postgresql/14/main/pg_hba.conf << 'EOF'
local   all             postgres                                peer
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
EOF

# Restart PostgreSQL
service postgresql restart

# Create database
su - postgres -c "psql -c \"CREATE USER lexia WITH PASSWORD 'lexia123' SUPERUSER;\""
su - postgres -c "psql -c \"CREATE DATABASE lexia OWNER lexia;\""
```

### 1.4 Configure Environment (Pod 1)

> ⚠️ **Important**: Replace `<POD2_ID>` with the actual Pod 2 ID from RunPod dashboard.

```bash
cat > /workspace/API-Lexia/.env << 'EOF'
APP_ENV=production
APP_HOST=0.0.0.0
APP_PORT=8000
API_SECRET_KEY=your-secret-key-minimum-32-characters-here
API_KEY_SALT=your-salt-16-chars
DATABASE_URL=postgresql+asyncpg://lexia:lexia123@localhost:5432/lexia
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Point LLM to Pod 2 (replace <POD2_ID> with actual pod ID)
LLM_SERVICE_URL=https://twak7scmkeiet4-8005.proxy.runpod.net

# Local STT and Diarization
STT_SERVICE_URL=http://localhost:8002
DIARIZATION_SERVICE_URL=http://localhost:8003

HF_TOKEN=hf_token
STORAGE_BACKEND=local
LOCAL_STORAGE_PATH=/workspace/API-Lexia/data

USE_MOCK_LLM=false
USE_MOCK_STT=false
USE_MOCK_DIARIZATION=false

ENABLE_DIARIZATION=true

RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=60
LOG_LEVEL=INFO
EOF

mkdir -p /workspace/API-Lexia/data
```

### 1.5 Initialize Database (Pod 1)

```bash
PGPASSWORD=lexia123 psql -U lexia -d lexia -h localhost << 'EOF'
-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_hash VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    organization_id VARCHAR(255),
    permissions JSONB,
    rate_limit INTEGER DEFAULT 60,
    is_revoked BOOLEAN DEFAULT FALSE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS ix_api_keys_user_id ON api_keys(user_id);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL,
    priority VARCHAR(10) DEFAULT 'normal' NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    params JSONB,
    result JSONB,
    result_url TEXT,
    progress_percent INTEGER DEFAULT 0 NOT NULL,
    progress_message VARCHAR(255),
    error_code VARCHAR(50),
    error_message TEXT,
    retries INTEGER DEFAULT 0 NOT NULL,
    max_retries INTEGER DEFAULT 3 NOT NULL,
    webhook_url TEXT,
    webhook_sent BOOLEAN DEFAULT FALSE NOT NULL,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    user_id VARCHAR(255),
    extra_data JSONB,
    celery_task_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Transcriptions table
CREATE TABLE IF NOT EXISTS transcriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'processing' NOT NULL,
    audio_url TEXT,
    audio_storage_key VARCHAR(255),
    audio_duration FLOAT,
    audio_format VARCHAR(20),
    language_code VARCHAR(10),
    language_detected VARCHAR(10),
    language_confidence FLOAT,
    speaker_diarization BOOLEAN DEFAULT FALSE NOT NULL,
    word_timestamps BOOLEAN DEFAULT TRUE NOT NULL,
    text TEXT,
    segments JSONB,
    words JSONB,
    speakers JSONB,
    utterances JSONB,
    diarization_segments JSONB,
    diarization_stats JSONB,
    error TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    processing_time FLOAT,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    user_id VARCHAR(255),
    extra_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Usage records table
CREATE TABLE IF NOT EXISTS usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    tokens_input INTEGER DEFAULT 0 NOT NULL,
    tokens_output INTEGER DEFAULT 0 NOT NULL,
    audio_seconds FLOAT DEFAULT 0.0 NOT NULL,
    status_code INTEGER NOT NULL,
    latency_ms FLOAT NOT NULL
);

SELECT 'Tables created successfully!' as status;
EOF
```

### 1.6 Create API Key (Pod 1)

```bash
cd /workspace/API-Lexia
source venv/bin/activate
export PYTHONPATH=/workspace/API-Lexia
export API_KEY_SALT="your-salt-16-chars"
export DATABASE_URL="postgresql+asyncpg://lexia:lexia123@localhost:5432/lexia"

python scripts/create_api_key.py --name "Production Key"
# ⚠️ SAVE THE KEY! It won't be shown again.
```

### 1.7 Create Startup Script (Pod 1)

```bash
cat > /workspace/start-pod1.sh << 'EOF'
#!/bin/bash
set -e

echo "=========================================="
echo "  Pod 1: API + STT + Diarization"
echo "=========================================="

# Start system services
echo "[1/6] Starting PostgreSQL and Redis..."
service postgresql start
service redis-server start
sleep 2

# Activate environment
cd /workspace/API-Lexia
source venv/bin/activate

# Export environment variables
export PYTHONPATH=/workspace/API-Lexia
export DATABASE_URL="postgresql+asyncpg://lexia:lexia123@localhost:5432/lexia"
export REDIS_URL="redis://localhost:6379/0"
export API_SECRET_KEY="your-secret-key-minimum-32-characters-here"
export API_KEY_SALT="your-salt-16-chars"
export STT_SERVICE_URL="http://localhost:8002"
export DIARIZATION_SERVICE_URL="http://localhost:8003"
export STORAGE_BACKEND="local"
export LOCAL_STORAGE_PATH="/workspace/API-Lexia/data"
export HF_TOKEN=hf_token

# ⚠️ UPDATE THIS with your Pod 2 ID
export LLM_SERVICE_URL="https://twak7scmkeiet4-8005.proxy.runpod.net"

# STT Configuration
export USE_TRANSFORMERS=true
export WHISPER_MODEL="Gilbert-AI/gilbert-whisper-distil-fr-v0.2"
export DEVICE=cuda

# Start STT server
echo "[2/6] Starting STT server (Gilbert-Whisper)..."
python -m uvicorn src.services.stt.server:app --host 0.0.0.0 --port 8002 &
STT_PID=$!
sleep 15

if curl -s http://localhost:8002/health > /dev/null; then
    echo "  ✓ STT server started (PID: $STT_PID)"
else
    echo "  ✗ STT server failed to start"
fi

# Start Diarization server
echo "[3/6] Starting Diarization server (pyannote)..."
python -m uvicorn src.services.diarization.server:app --host 0.0.0.0 --port 8003 &
DIAR_PID=$!
sleep 20

if curl -s http://localhost:8003/health > /dev/null; then
    echo "  ✓ Diarization server started (PID: $DIAR_PID)"
else
    echo "  ✗ Diarization server failed to start"
fi

# Start API Gateway
echo "[4/6] Starting API Gateway..."
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 &
API_PID=$!
sleep 5

if curl -s http://localhost:8000/health > /dev/null; then
    echo "  ✓ API Gateway started (PID: $API_PID)"
else
    echo "  ✗ API Gateway failed to start"
fi

# Start Celery worker
echo "[5/6] Starting Celery worker..."
celery -A src.workers.celery_app worker --loglevel=info --concurrency=2 &
CELERY_PID=$!
sleep 3
echo "  ✓ Celery worker started (PID: $CELERY_PID)"

echo ""
echo "=========================================="
echo "  Pod 1 Services Running"
echo "=========================================="
echo "  API Gateway:  http://localhost:8000"
echo "  STT Server:   http://localhost:8002"
echo "  Diarization:  http://localhost:8003"
echo "  LLM (Pod 2):  $LLM_SERVICE_URL"
echo "=========================================="
echo ""

# Keep script running
wait
EOF
chmod +x /workspace/start-pod1.sh
```

---

## Pod 2: LLM (vLLM)

### 2.1 Create Pod

1. Go to [runpod.io](https://runpod.io) > Deploy > GPU Pods
2. Select template: **RunPod Pytorch 2.1.0**
3. Choose GPU: **A40** (46GB) or **A100**
4. Configure:
   - Container Disk: 50GB
   - Volume Disk: 100GB
   - Volume mount path: `/workspace`
   - Expose HTTP ports: `8005`
5. Click **Deploy**
6. **Note the Pod ID** (visible in URL or dashboard) - you'll need it for Pod 1

### 2.2 Initial Setup (Pod 2)

```bash
# Install system dependencies
apt-get update
apt-get install -y python3-pip python3-venv git

# Create workspace
cd /workspace
mkdir -p llm-server
cd llm-server

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install PyTorch 2.9 (required for vLLM)
pip install --upgrade pip wheel setuptools

# Install vLLM
pip install vllm

# Install other dependencies
pip install "numpy<2"
pip install transformers accelerate safetensors sentencepiece tokenizers
```

### 2.3 Configure Environment (Pod 2)

```bash
cat > /workspace/llm-server/.env << 'EOF'
HF_TOKEN=hf_token
EOF
```

### 2.4 Create Startup Script (Pod 2)

```bash
cat > /workspace/start-pod2.sh << 'EOF'
#!/bin/bash
set -e

echo "=========================================="
echo "  Pod 2: vLLM Server"
echo "=========================================="

cd /workspace/llm-server
source venv/bin/activate

export HF_TOKEN=hf_token

echo "Starting vLLM (this takes 2-3 minutes)..."
echo "  Model: Marsouuu/general7Bv2-ECE-PRYMMAL-Martial"
echo "  GPU Memory: 90%"

# Adjust --max-model-len based on your GPU:
#   - 40GB GPU: 8192
#   - 48-50GB GPU: 16384
#   - 80GB GPU: 32768
python -m vllm.entrypoints.openai.api_server \
  --model Marsouuu/general7Bv2-ECE-PRYMMAL-Martial \
  --host 0.0.0.0 \
  --port 8005 \
  --gpu-memory-utilization 0.9 \
  --max-model-len 16384

EOF
chmod +x /workspace/start-pod2.sh
```

### 2.5 Start vLLM (Pod 2)

```bash
/workspace/start-pod2.sh
```

Wait for `Application startup complete` message.

---

## Connecting the Pods

1. **Get Pod 2's URL**: In RunPod dashboard, go to Pod 2 > Connect > HTTP Services
   - Copy the URL for port 8005: `https://<POD2_ID>-8005.proxy.runpod.net`

2. **Update Pod 1's configuration**:
   ```bash
   # On Pod 1, edit the .env file
   nano /workspace/API-Lexia/.env
   
   # Update LLM_SERVICE_URL with Pod 2's URL:
   LLM_SERVICE_URL=https://<POD2_ID>-8005.proxy.runpod.net
   ```

3. **Also update the startup script**:
   ```bash
   nano /workspace/start-pod1.sh
   # Update the LLM_SERVICE_URL export line
   ```

4. **Start Pod 1**:
   ```bash
   /workspace/start-pod1.sh
   ```

---

## Testing Multi-Pod Setup

```bash
# From Pod 1:

# Test STT (local)
curl http://localhost:8002/health

# Test Diarization (local)
curl http://localhost:8003/health

# Test LLM (Pod 2 via proxy)
curl https://<POD2_ID>-8005.proxy.runpod.net/health

# Test API Gateway
curl http://localhost:8000/health

# Full transcription with diarization
curl -X POST http://localhost:8000/v1/transcriptions/sync \
  -H "Authorization: Bearer lx_your_api_key" \
  -F "audio=@/path/to/audio.wav" \
  -F "language_code=fr" \
  -F "speaker_diarization=true"

# LLM via API Gateway
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Authorization: Bearer lx_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"model":"general7Bv2","messages":[{"role":"user","content":"Bonjour!"}]}'
```

---

## Service Status

| Pod | Service | Port | Command to Check |
|-----|---------|------|------------------|
| 1 | API Gateway | 8000 | `curl localhost:8000/health` |
| 1 | STT | 8002 | `curl localhost:8002/health` |
| 1 | Diarization | 8003 | `curl localhost:8003/health` |
| 1 | PostgreSQL | 5432 | `service postgresql status` |
| 1 | Redis | 6379 | `service redis-server status` |
| 2 | vLLM | 8005 | `curl localhost:8005/health` |

---

## Troubleshooting

### Pod 2 Not Reachable from Pod 1

```bash
# Test connectivity from Pod 1
curl -v https://<POD2_ID>-8005.proxy.runpod.net/health

# If timeout, check:
# 1. Pod 2 is running and vLLM started
# 2. Port 8005 is exposed in Pod 2 settings
# 3. Pod ID is correct
```

### GPU Memory Error on Pod 2

```bash
# Kill all Python processes
pkill -9 -f python
sleep 3

# Restart with lower memory settings
python -m vllm.entrypoints.openai.api_server \
  --model Marsouuu/general7Bv2-ECE-PRYMMAL-Martial \
  --port 8005 \
  --gpu-memory-utilization 0.85 \
  --max-model-len 8192
```

### Diarization Fails on Pod 1

```bash
# Check pyannote is installed correctly
pip show pyannote-audio

# Check torch version (should be 2.4.x)
python -c "import torch; print(torch.__version__)"

# Test pyannote import
python -c "from pyannote.audio import Pipeline; print('OK')"
```

### Database Connection Error (Pod 1)

```bash
# Restart PostgreSQL
service postgresql restart

# Check connection
PGPASSWORD=lexia123 psql -U lexia -d lexia -h localhost -c "SELECT 1;"
```

---

## Costs

| Configuration | GPUs | Cost/hour | Use Case |
|---------------|------|-----------|----------|
| Pod 1 (A40) + Pod 2 (A40) | 2x A40 | ~$1.58/h | Full features |
| Pod 1 (RTX 4090) + Pod 2 (A40) | 4090 + A40 | ~$1.23/h | Budget option |
| Pod 1 (A100 40GB) + Pod 2 (A100 40GB) | 2x A100 | ~$3.00/h | High performance |

---

## Updating the Code

### On Pod 1

```bash
# Stop services
pkill -9 -f python
pkill -9 -f celery

# Pull latest
cd /workspace/API-Lexia
git pull origin main

# Reinstall if needed
source venv/bin/activate
pip install -r requirements.txt

# Restart
/workspace/start-pod1.sh
```

### On Pod 2

```bash
# Stop vLLM
pkill -9 -f python

# Restart
/workspace/start-pod2.sh
```
