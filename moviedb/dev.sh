#!/bin/sh

sh ./env.sh

export SERVICE_APP_INIT="php artisan octane:start --server=frankenphp --host=0.0.0.0 --port=80 --admin-port=2019 --caddyfile=/app/Caddyfile --watch"

docker compose stop
docker compose up -d --build --force-recreate --remove-orphans