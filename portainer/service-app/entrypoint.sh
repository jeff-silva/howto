#!/bin/sh

if [ ! -f "/app/.env" ]; then
  echo ">>> creating .env"
  cp "/app/.env.example" "/app/.env"
fi

set -a
. /app/.env
set +a

if [ -z "$APP_KEY" ]; then
  echo ">>> generating APP_KEY"
  php artisan key:generate
fi

composer install

php artisan route:clear
php artisan config:clear
php artisan cache:clear
rm -f /app/bootstrap/cache/*.php
php artisan db:seed

exec /usr/bin/supervisord -n -c /etc/supervisord.conf
