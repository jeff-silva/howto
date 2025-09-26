#!/bin/bash
set -e

# Executa o entrypoint OFICIAL, que configura ambiente e troca para usuario mysql
exec docker-entrypoint.sh "$@" &

echo "Esperando MariaDB subir..."
until mariadb-admin ping -h127.0.0.1 --silent; do
  sleep 2
done

echo "Rodando script custom..."
mariadb -uroot -p"$MYSQL_ROOT_PASSWORD" app < /entrypoint.sql

wait -n