#!/bin/bash

# Este script renderiza o arquivo hyperframes/index.html usando o HyperFrames via Docker

echo "🎬 Renderizando vídeo com HyperFrames..."

# Constrói a imagem do HyperFrames baseada no diretório test-hyperframes
docker build -t hyperframes-renderer ../test-hyperframes

# Executa o contêiner gerando video.mp4 a partir de hyperframes/index.html
docker run --rm \
  -v "$(pwd):/app" \
  -v "$(pwd)/.cache:/root/.cache" \
  hyperframes-renderer \
  hyperframes render hyperframes/ -o video.mp4

echo "✅ Vídeo incrível gerado! Verifique o arquivo video.mp4"
