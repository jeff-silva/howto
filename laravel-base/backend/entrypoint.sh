#!/bin/sh

if [ ! -f "/app/.env" ]; then
  cp "/app/.env.example" "/app/.env"
fi

composer install
php artisan migrate
php artisan db:seed
php artisan serve --host=0.0.0.0 --port=8000
