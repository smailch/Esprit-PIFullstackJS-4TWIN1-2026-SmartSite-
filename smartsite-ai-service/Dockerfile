# YOLO + FastAPI — wheels PyTorch CPU (plus légers que CUDA), install en deux temps pour stabiliser pip sous Docker Desktop (RAM/disque réduits).
FROM python:3.11-slim-bookworm AS base
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    YOLO_MODEL_PATH=/app/weights/best.pt

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ \
    libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 1) PyTorch CPU seul — moins de concurrence mémoire / disque pendant le téléchargement
RUN pip install --no-cache-dir --timeout=120 --retries 5 \
    torch==2.1.0 torchvision==0.16.0 \
    --index-url https://download.pytorch.org/whl/cpu

COPY requirements.txt .
# 2) Reste du graphe ; torch est déjà satisfait (pas de second gros téléchargement CUDA depuis PyPI)
RUN pip install --no-cache-dir --timeout=120 --retries 5 -r requirements.txt

COPY main.py check_model.py ./
LABEL org.opencontainers.image.title="pismartsite-ai"
RUN mkdir -p /app/weights
EXPOSE 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
