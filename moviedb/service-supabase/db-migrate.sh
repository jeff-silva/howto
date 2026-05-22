#!/bin/sh

CURRENT_DIR=$(cd "$(dirname "$0")" && pwd)
MIGRATION_NAME=$(date +"%Y-%m-%d-%H-%m-%S")
cd $CURRENT_DIR

# Load required environment variables safely from .env without being affected by spaces in other variables
eval "$(grep -E "^(POSTGRES_|POOLER_)" "$CURRENT_DIR/src/.env" | sed 's/\r$//')"

DB_URL="postgresql://postgres.$POOLER_TENANT_ID:$POSTGRES_PASSWORD@localhost:$POSTGRES_PORT/$POSTGRES_DB?sslmode=disable"
npx -y supabase db diff --db-url "$DB_URL" -f "schema"
