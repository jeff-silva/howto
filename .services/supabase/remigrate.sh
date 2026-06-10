#!/bin/sh
# Deleta ultima migration e a recria

SERVICE_DIR=$(cd "$(dirname "$0")" && pwd)
SUPABASE_MIGRATIONS="$SERVICE_DIR/supabase/migrations"
SUPABASE_MIGRATIONS_LAST=$(ls -1 "$SUPABASE_MIGRATIONS" | tail -n 1)
rm "$SUPABASE_MIGRATIONS/$SUPABASE_MIGRATIONS_LAST"
sh "$SERVICE_DIR/migrate.sh"