#!/bin/sh
CURRENT_DIR=$(cd "$(dirname "$0")" && pwd)
docker compose -f "$CURRENT_DIR/compose.yml" up -d --build --force-recreate --remove-orphans