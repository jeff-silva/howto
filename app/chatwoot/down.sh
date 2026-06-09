#!/bin/sh

CURRENT_DIR=$(cd "$(dirname "$0")" && pwd)
docker compose -f "$CURRENT_DIR/compose.yml" down -v --rmi all
