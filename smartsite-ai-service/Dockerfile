# Image lourde (torch + Ultralytics). CI Jenkins reste léger : pas d’installation torch dans venv-ci.
FROM python:3.11-slim-bookworm AS base
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    YOLO_MODEL_PATH=/app/weights/best.pt

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py check_model.py ./
LABEL org.opencontainers.image.title="pismartsite-ai"
RUN mkdir -p /app/weights
EXPOSE 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
