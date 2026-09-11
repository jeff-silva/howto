#!/bin/bash

# Este script renderiza o arquivo hyperframes/index.html usando o HyperFrames via Docker

echo "🎬 Renderizando vídeo com HyperFrames..."

# Constrói a imagem do HyperFrames baseada no diretório atual
docker build --network host -t hyperframes-renderer .

# Executa o contêiner gerando video.mp4 a partir de public/index.html
docker run --rm \
  -v "$(pwd):/app" \
  -v "$(pwd)/.cache:/root/.cache" \
  hyperframes-renderer \
  hyperframes render public/ -o public/video.mp4

echo "✅ Vídeo incrível gerado! Verifique o arquivo video.mp4"
