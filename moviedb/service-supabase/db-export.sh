#!/bin/sh

CURRENT_DIR=$(cd "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(cd "$CURRENT_DIR/.." && pwd)

. "$CURRENT_DIR/src/.env"

mkdir -p "$CURRENT_DIR/export"

echo "Exportado em: $(date +'%d/%m/%Y %H:%M:%S')" > "$CURRENT_DIR/export/00-info.md"

DB_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' codewe-db-1)
DB_URL="postgresql://postgres:$POSTGRES_PASSWORD@$DB_IP:$POSTGRES_PORT/$POSTGRES_DB?sslmode=disable"

npx -y supabase db dump --db-url "$DB_URL" -f "$CURRENT_DIR/export/01-schema.sql"
npx -y supabase db dump --db-url "$DB_URL" --data-only -f "$CURRENT_DIR/export/02-data.sql"

mkdir -p "$CURRENT_DIR/export/storage"
docker cp codewe-storage-1:/var/lib/storage/. "$CURRENT_DIR/export/storage/"

tar -czvf "$CURRENT_DIR/export.tar.gz" -C "$CURRENT_DIR/export" .
rm -rf "$CURRENT_DIR/export"