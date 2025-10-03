#!/bin/sh

docker compose down --rmi all --volumes --remove-orphans
docker image prune -af
docker volume prune -f
docker network prune -f

sudo rm -rf ./database/.volume