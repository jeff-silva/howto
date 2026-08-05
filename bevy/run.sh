#!/bin/bash
set -e

# Descobre o diretório onde este script está salvo, independente de onde ele for chamado
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Entra na pasta correta do Bevy
cd "$SCRIPT_DIR"

echo "Iniciando a aplicação Bevy em Docker..."

# Roda o Docker Compose
docker compose up --build
