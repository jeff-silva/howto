#!/bin/sh

if [ ! -f "/app/.env" ]; then
  cp "/app/.env.example" "/app/.env"
fi

composer install
# php artisan migrate
php artisan app:migrate
php artisan db:seed
php artisan modular:init
php artisan optimize

exec /usr/bin/supervisord -n -c /etc/supervisord.conf
