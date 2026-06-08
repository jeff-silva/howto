#!/bin/sh

env_value() {
    local file="$1"
    local key="$2"
    grep "^${key}=" "$file" | cut -d '=' -f2-
}

CURRENT_DIR=$(cd "$(dirname "$0")" && pwd)
MIGRATION_NAME=$(date +"%Y-%m-%d-%H-%m-%S")
cd $CURRENT_DIR

POOLER_TENANT_ID=$(env_value "./src/.env" "POOLER_TENANT_ID")
POSTGRES_PASSWORD=$(env_value "$CURRENT_DIR/src/.env" "POSTGRES_PASSWORD")
POSTGRES_PORT=$(env_value "$CURRENT_DIR/src/.env" "POSTGRES_PORT")
POSTGRES_DB=$(env_value "$CURRENT_DIR/src/.env" "POSTGRES_DB")

DB_URL="postgresql://postgres.$POOLER_TENANT_ID:$POSTGRES_PASSWORD@localhost:$POSTGRES_PORT/$POSTGRES_DB?sslmode=disable"
npx -y supabase db diff --db-url "$DB_URL" -f "schema" --schema public