#!/bin/sh

if [ ! -f "/app/.env" ]; then
  cp "/app/.env.example" "/app/.env"
fi

composer install

php artisan optimize
php artisan migrate
php artisan db:seed

exec /usr/bin/supervisord -n -c /etc/supervisord.conf
