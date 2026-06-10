#!/bin/sh

> "/app/storage/logs/laravel.log"

if [ ! -f "/app/.env" ]; then
  echo ">>> creating .env"
  cp "/app/.env.example" "/app/.env"
fi

set -a
. /app/.env
set +a

# if [ "$SERVICE_APP_INSTALL" = "1" ]; then
#   composer clear-cache
#   composer install --prefer-source
#   npm install
# fi

if [ -z "$APP_KEY" ]; then
  echo ">>> generating APP_KEY"
  php artisan key:generate
fi

php artisan route:clear
php artisan config:clear
php artisan cache:clear

# if [ "$SERVICE_APP_RUN_MIGRATIONS" = "true" ]; then
#   php artisan migrator:run
# fi

exec "$@"