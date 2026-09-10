#!/bin/bash

# Script para transcrever áudio usando a API da Groq via DOCKER
# Não instala NADA no WSL! Tudo acontece no contêiner.

# Carrega as variáveis do arquivo .env, se ele existir
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$GROQ_API_KEY" ]; then
  echo "❌ Erro: A variável GROQ_API_KEY não foi definida."
  echo "Coloque GROQ_API_KEY=sua_chave no arquivo .env"
  exit 1
fi

if [ -z "$1" ]; then
  echo "Uso: ./transcribe.sh <caminho_do_audio.mp3>"
  exit 1
fi

AUDIO_PATH="$1"

echo "🐳 Subindo contêiner Python Alpine para rodar a transcrição..."

# Roda o script python criado anteriormente de forma encapsulada
docker run --rm \
  -v "$(pwd):/app" \
  -w /app \
  -e GROQ_API_KEY="$GROQ_API_KEY" \
  python:3.11-alpine \
  sh -c "pip install -q requests && python3 transcribe.py '$AUDIO_PATH'"
