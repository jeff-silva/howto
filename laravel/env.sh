#!/bin/sh

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)

# Insere variável de ambiente se não existir no arquivo (descomenta e atualiza se estiver comentada)
env_insert() {
  local arquivo=$1
  local chave=$2
  local valor=$3

  # Garante que o arquivo termina com uma quebra de linha antes de anexar
  if [ -f "$arquivo" ] && [ -n "$(tail -c1 "$arquivo" 2>/dev/null)" ]; then
    echo "" >> "$arquivo"
  fi

  if grep -q "^[# ]*${chave}=" "$arquivo"; then
    sed -i "s|^[# ]*${chave}=.*|${chave}=${valor}|" "$arquivo"
  else
    echo "${chave}=${valor}" >> "$arquivo"
  fi
}

# Força valor da variável de ambiente no arquivo (descomenta e atualiza se estiver comentada)
env_update() {
  local arquivo=$1
  local chave=$2
  local valor=$3

  # Garante que o arquivo termina com uma quebra de linha antes de anexar
  if [ -f "$arquivo" ] && [ -n "$(tail -c1 "$arquivo" 2>/dev/null)" ]; then
    echo "" >> "$arquivo"
  fi

  if grep -q "^[# ]*${chave}=" "$arquivo"; then
    sed -i "s|^[# ]*${chave}=.*|${chave}=${valor}|" "$arquivo"
  else
    echo "${chave}=${valor}" >> "$arquivo"
  fi
}

env_value() {
    local file="$1"
    local key="$2"
    grep "^${key}=" "$file" | cut -d '=' -f2-
}

env_create() {
    local folder="$1"
    [ ! -f "$folder/.env" ] && cp "$folder/.env.example" "$folder/.env"
}

# Root
env_create "$ROOT_DIR"
env_insert "$ROOT_DIR/.env" "SERVICE_APP_ENV" "local"
env_insert "$ROOT_DIR/.env" "SERVICE_APP_URL" "http://moviedb.localhost"
env_insert "$ROOT_DIR/.env" "SERVICE_SUPABASE_URL" "http://supabase.moviedb.localhost"
env_insert "$ROOT_DIR/.env" "SERVICE_SUPABASE_STORAGE_BUCKET" "app"

# Service Front
env_create "$ROOT_DIR/service-front"

env_update "$ROOT_DIR/service-front/.env" "SERVICE_APP_ENV" $(env_value "$ROOT_DIR/.env" "SERVICE_APP_ENV")
env_update "$ROOT_DIR/service-front/.env" "SERVICE_APP_URL" $(env_value "$ROOT_DIR/.env" "SERVICE_APP_URL")
env_update "$ROOT_DIR/service-front/.env" "SERVICE_SUPABASE_URL" $(env_value "$ROOT_DIR/.env" "SERVICE_SUPABASE_URL")
env_update "$ROOT_DIR/service-front/.env" "SERVICE_SUPABASE_ANON_KEY" $(env_value "$ROOT_DIR/service-supabase/src/.env" "ANON_KEY")

# Service App
env_create "$ROOT_DIR/service-app/src"

env_update "$ROOT_DIR/service-app/src/.env" "APP_ENV" $(env_value "$ROOT_DIR/.env" "SERVICE_APP_ENV")
env_update "$ROOT_DIR/service-app/src/.env" "APP_URL" $(env_value "$ROOT_DIR/.env" "SERVICE_APP_URL")
env_update "$ROOT_DIR/service-app/src/.env" "QUEUE_CONNECTION" "file"
env_update "$ROOT_DIR/service-app/src/.env" "SESSION_DRIVER" "file"
env_update "$ROOT_DIR/service-app/src/.env" "CACHE_STORE" "file"

env_update "$ROOT_DIR/service-app/src/.env" "DB_CONNECTION" "pgsql"
env_update "$ROOT_DIR/service-app/src/.env" "DB_HOST" "db"
env_update "$ROOT_DIR/service-app/src/.env" "DB_PORT" "5432"
env_update "$ROOT_DIR/service-app/src/.env" "DB_DATABASE" "postgres"
env_update "$ROOT_DIR/service-app/src/.env" "DB_USERNAME" "postgres"
env_update "$ROOT_DIR/service-app/src/.env" "DB_PASSWORD" $(env_value "$ROOT_DIR/service-supabase/src/.env" "POSTGRES_PASSWORD")

env_update "$ROOT_DIR/service-app/src/.env" "SERVICE_SUPABASE_JWT_SECRET" $(env_value "$ROOT_DIR/service-supabase/src/.env" "JWT_SECRET")
env_update "$ROOT_DIR/service-app/src/.env" "SERVICE_SUPABASE_SERVICE_ROLE_KEY" $(env_value "$ROOT_DIR/service-supabase/src/.env" "SERVICE_ROLE_KEY")
env_update "$ROOT_DIR/service-app/src/.env" "SERVICE_SUPABASE_ANON_KEY" $(env_value "$ROOT_DIR/service-supabase/src/.env" "ANON_KEY")
env_update "$ROOT_DIR/service-app/src/.env" "SERVICE_SUPABASE_STORAGE_BUCKET" $(env_value "$ROOT_DIR/.env" "SERVICE_SUPABASE_STORAGE_BUCKET")

# env_update "$ROOT_DIR/service-app/src/.env" "REDIS_CLIENT" "predis"
# env_update "$ROOT_DIR/service-app/src/.env" "QUEUE_CONNECTION" "redis"
# env_update "$ROOT_DIR/service-app/src/.env" "REDIS_HOST" "service-redis"
# env_update "$ROOT_DIR/service-app/src/.env" "REDIS_PASSWORD" "null"
# env_update "$ROOT_DIR/service-app/src/.env" "REDIS_PORT" "6379"