#!/bin/bash
# bash -c "$(curl -fsSL https://raw.githubusercontent.com/jeff-silva/snippets/refs/heads/main/elysia/create/run.sh)"

CURRENT_DIR=$(cd "$(dirname "$0")" && pwd)
echo "Current folder: $CURRENT_DIR"

VALUE_DEFAULT="elysia"
echo -e "\nDefine Elysia folder (default: \"$VALUE_DEFAULT\")"
echo "Place: $CURRENT_DIR/$VALUE_DEFAULT";
read -p "New value (empty to keep default): " VALUE
ELYSIA_DIR=${VALUE:-$VALUE_DEFAULT}

mkdir -p "$CURRENT_DIR/$ELYSIA_DIR"

curl -fsSL https://raw.githubusercontent.com/jeff-silva/snippets/refs/heads/main/elysia/create/Dockerfile \
  > "$CURRENT_DIR/$ELYSIA_DIR/Dockerfile"

curl -fsSL https://raw.githubusercontent.com/jeff-silva/snippets/refs/heads/main/elysia/create/compose.yml \
  > "$CURRENT_DIR/$ELYSIA_DIR/compose.yml"

# Trocado o $(pwd) pelo "$CURRENT_DIR" para evitar erros de caminho relativo
docker run --rm -it -v "$CURRENT_DIR":/app -w /app oven/bun bun create elysiajs "$ELYSIA_DIR/project"