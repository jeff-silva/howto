#!/bin/sh

cd "$(dirname "$0")" || exit

docker compose stop
docker compose up -d --build --force-recreate --remove-orphans