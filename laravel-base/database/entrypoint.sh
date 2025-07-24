#!/bin/bash
set -e

# Start the MySQL service in the background
docker-entrypoint.sh mysqld &

# Wait for MySQL to fully start
until mysqladmin ping -h "127.0.0.1" --silent; do
    echo 'waiting for mysqld to be connectable...'
    sleep 2
done

# Execute the entrypoint.sql script as root
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" < /docker-entrypoint-initdb.d/entrypoint.sql

# Wait for the MySQL service to terminate
wait