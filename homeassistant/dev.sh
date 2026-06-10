#!/bin/sh

CURRENT_DIR=$(cd "$(dirname "$0")" && pwd)
ROOT_DIR=$(cd "$CURRENT_DIR/../.." && pwd)

# Function to find all .env.example files and create .env if they don't exist
init_env_files() {
  find "$1" -type f -name ".env.example" 2>/dev/null | while read -r example_file; do
    env_file="$(dirname "$example_file")/.env"
    if [ ! -f "$env_file" ]; then
      cp "$example_file" "$env_file"
    fi
  done
}

init_env_files "$CURRENT_DIR"
init_env_files "$ROOT_DIR/services"

docker compose --profile "*" stop
docker compose -f "$CURRENT_DIR/compose.yml" up -d --build --force-recreate --remove-orphans
