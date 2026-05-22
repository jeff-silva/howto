#!/bin/sh

SERVICE_DIR=$(cd "$(dirname "$0")" && pwd)

read -p "folder name [src]: " LARAVEL_DIR
LARAVEL_DIR=${LARAVEL_DIR:-src}

# sudo rm -rf "$SERVICE_DIR/$LARAVEL_DIR"

if [ -d "$SERVICE_DIR/$LARAVEL_DIR" ]; then
    exit 1
fi

docker run -it --rm -v "$SERVICE_DIR:/app" -w /app laravelsail/php84-composer:latest /bin/bash -c "{
    composer global require laravel/installer
    laravel new $LARAVEL_DIR
    cd $LARAVEL_DIR
    composer require laravel/octane
    php artisan octane:install --server=frankenphp
}"

sudo chmod 0777 -R "$SERVICE_DIR/$LARAVEL_DIR"
