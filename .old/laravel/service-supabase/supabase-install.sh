#!/bin/sh

SERVICE_DIR=$(cd "$(dirname "$0")" && pwd)

read -p "folder name [src]: " SUPABASE_DIR
SUPABASE_DIR=${SUPABASE_DIR:-src}

if [ -d "$SERVICE_DIR/$SUPABASE_DIR" ]; then
    exit 1
fi

npx -y supabase init
npx -y supabase telemetry disable

mkdir -m 0777 "$SERVICE_DIR/$SUPABASE_DIR"

git clone --depth 1 https://github.com/supabase/supabase supabase-tmp
cp -rf supabase-tmp/docker/* $SUPABASE_DIR
cp supabase-tmp/docker/.env.example $SUPABASE_DIR/.env
rm -rf ./supabase-tmp

cd ./$SUPABASE_DIR
sh utils/generate-keys.sh
sh utils/add-new-auth-keys.sh
rm ./.env.old ./docker-compose.yml.old
