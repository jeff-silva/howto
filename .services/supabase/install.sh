#!/bin/sh

SERVICE_DIR=$(cd "$(dirname "$0")" && pwd)

read -p "folder name [src]: " SUPABASE_DIR
SUPABASE_DIR=${SUPABASE_DIR:-src}

if [ -d "$SERVICE_DIR/$SUPABASE_DIR" ]; then
    exit 1
fi

(cd "$SERVICE_DIR" && npx -y supabase init)
(cd "$SERVICE_DIR" && npx -y supabase telemetry disable)

mkdir -m 0777 "$SERVICE_DIR/$SUPABASE_DIR"

git clone --depth 1 https://github.com/supabase/supabase "$SERVICE_DIR/supabase-tmp"
cp -rf "$SERVICE_DIR/supabase-tmp/docker/"* "$SERVICE_DIR/$SUPABASE_DIR"
cp "$SERVICE_DIR/supabase-tmp/docker/.env.example" "$SERVICE_DIR/$SUPABASE_DIR/.env"
rm -rf "$SERVICE_DIR/supabase-tmp"

cd "$SERVICE_DIR/$SUPABASE_DIR"
sh utils/generate-keys.sh
sh utils/add-new-auth-keys.sh
rm ./.env.old ./docker-compose.yml.old