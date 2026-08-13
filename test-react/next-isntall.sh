#!/bin/bash

# Pede ao usuário o nome da pasta
read -p "Digite o nome da pasta onde o Next.js será instalado (ex: next): " FOLDER_NAME

# Verifica se o usuário não deixou em branco
if [ -z "$FOLDER_NAME" ]; then
  echo "❌ Erro: O nome da pasta não pode ser vazio."
  exit 1
fi

# Descobre o caminho absoluto do diretório onde este script está salvo
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Pega o UID e GID do usuário atual para evitar problemas de permissão (root) nos arquivos gerados
USER_ID=$(id -u)
GROUP_ID=$(id -g)

echo "🚀 Iniciando a criação do projeto Next.js na pasta '$FOLDER_NAME' via Docker..."

# Roda um container temporário mapeando a pasta exata do script (SCRIPT_DIR)
# Trocado de node:20 para node:22 porque a versão mais recente do pnpm exige o Node 22
docker run --rm -it \
  -v "$SCRIPT_DIR:/app" \
  -w /app \
  node:22 \
  bash -c "
    corepack enable pnpm && \
    pnpm create next-app@latest $FOLDER_NAME --yes && \
    chown -R $USER_ID:$GROUP_ID $FOLDER_NAME && \
    rm -rf .pnpm-store
  "

echo "✅ Projeto Next.js criado com sucesso em: $SCRIPT_DIR/$FOLDER_NAME"
