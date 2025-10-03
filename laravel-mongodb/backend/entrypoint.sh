#!/bin/sh

if [ ! -f "/var/www/html/.env" ]; then
  echo ">>> creating .env"
  cp "/var/www/html/.env.example" "/var/www/html/.env"
fi

set -a
. /var/www/html/.env
set +a

if [ -z "$APP_KEY" ]; then
  echo ">>> generating APP_KEY"
  php artisan key:generate
fi

composer install

php artisan optimize
php artisan migrate
php artisan db:seed

exec /usr/bin/supervisord -n -c /etc/supervisord.conf