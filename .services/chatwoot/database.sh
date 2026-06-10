#!/bin/sh

CURRENT_DIR=$(cd "$(dirname "$0")" && pwd)

docker compose -f "$CURRENT_DIR/compose.yml" run --rm rails bundle exec rails db:chatwoot_prepare