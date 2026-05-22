#!/bin/sh

CURRENT_DIR=$(cd "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(cd "$CURRENT_DIR/.." && pwd)

sh "$CURRENT_DIR/init.sh"
. "$CURRENT_DIR/src/.env"

DB_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' codewe-db-1)
DB_URL="postgresql://postgres:$POSTGRES_PASSWORD@$DB_IP:$POSTGRES_PORT/$POSTGRES_DB?sslmode=disable"
MIGRATION_NAME=$(date +"%Y_%m_%d")

npx -y supabase db diff --db-url "$DB_URL" -f "$MIGRATION_NAME"
echo $MIGRATION_NAME