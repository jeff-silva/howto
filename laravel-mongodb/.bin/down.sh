#!/bin/sh
set -e

PROJECT_NAME=${1:-$(basename "$PWD")}
echo "🚨 Limpando tudo do projeto: $PROJECT_NAME"

# desce serviços, remove volumes e redes
docker compose -p "$PROJECT_NAME" down --volumes --remove-orphans || true

# remove volumes órfãos
docker volume rm $(docker volume ls -q --filter name="$PROJECT_NAME") 2>/dev/null || true

# remove redes órfãs
docker network rm $(docker network ls -q --filter name="$PROJECT_NAME") 2>/dev/null || true

# remove imagens associadas ao projeto (filtra)
docker rmi -f $(docker images "$PROJECT_NAME*" -q) 2>/dev/null || true

# limpa cache de build
docker builder prune -af

echo "✅ Ambiente zerado! (vai rebuildar do zero ao dar 'docker compose build --no-cache && docker compose up -d')"