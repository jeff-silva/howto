#!/bin/bash
# bash -c "$(curl -fsSL https://raw.githubusercontent.com/jeff-silva/howto/refs/heads/main/bin/laravel/create.sh)"

CURRENT_DIR=$(pwd)
echo "Current folder: $CURRENT_DIR"

VALUE_DEFAULT="laravel"
echo -e "\nDefine folder (default: \"$VALUE_DEFAULT\")"
echo "Place: $CURRENT_DIR/$VALUE_DEFAULT";
read -p "New value (empty to keep default): " VALUE
LARAVEL_DIR=${VALUE:-$VALUE_DEFAULT}

# Folders
mkdir -p "$CURRENT_DIR/$LARAVEL_DIR"

# Dockerfile
FILENAME="$CURRENT_DIR/$LARAVEL_DIR/Dockerfile"
[ -f $FILENAME ] || cat << EOF > $FILENAME
FROM php:8.4-cli
WORKDIR /app

RUN apt-get update && apt-get install -y \
  git unzip supervisor inotify-tools \
  && rm -rf /var/lib/apt/lists/*

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions pdo_mysql pdo_pgsql zip exif bcmath sockets gd pcntl

RUN mkdir -p /usr/src/php/ext/swoole \
    && curl -L https://github.com/swoole/swoole-src/archive/refs/tags/v6.0.0.tar.gz | tar xz -C /usr/src/php/ext/swoole --strip-components=1 \
    && docker-php-ext-install swoole

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
COPY --from=node:20 /usr/local/bin /usr/local/bin
COPY --from=node:20 /usr/local/lib /usr/local/lib

RUN chown -R www-data:www-data /app

COPY ./zz-custom.ini /usr/local/etc/php/conf.d/zz-custom.ini

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
EOF

# compose.yml
FILENAME="$CURRENT_DIR/$LARAVEL_DIR/compose.yml"
[ -f $FILENAME ] || cat << EOF > $FILENAME
x-app-base: &app-base
  build: .
  env_file: [./project/.env]
  expose: [80]
  restart: unless-stopped
  volumes:
    - ./project:/app

services:
  $LARAVEL_DIR:
    <<: *app-base
    ports: ["80:80", "5173:5173"]
    command: php artisan octane:start --server=swoole --host=0.0.0.0 --port=80 \${OCTANE_WATCH:-}

  $LARAVEL_DIR-schedule:
    <<: *app-base
    command: php artisan schedule:work
    healthcheck:
      disable: true

  $LARAVEL_DIR-queue:
    <<: *app-base
    command: php artisan queue:work
    healthcheck:
      disable: true
EOF

# entrypoint.sh
FILENAME="$CURRENT_DIR/$LARAVEL_DIR/entrypoint.sh"
[ -f $FILENAME ] || cat << EOF > $FILENAME
#!/bin/sh

php artisan route:clear
php artisan config:clear
php artisan cache:clear

exec "\$@"
EOF

# zz-custom.ini
FILENAME="$CURRENT_DIR/$LARAVEL_DIR/zz-custom.ini"
[ -f $FILENAME ] || cat << EOF > $FILENAME
memory_limit = 8G
post_max_size = 8G
upload_max_filesize = 8G
max_execution_time = 0
max_input_time = -1
EOF

# Use official composer image to create application
docker run --rm -it -v "$CURRENT_DIR":/app -w /app composer sh -c "
  composer global require laravel/installer
  /tmp/vendor/bin/laravel new $LARAVEL_DIR/project --no-interaction
  cd $LARAVEL_DIR/project
  composer require laravel/octane
  php artisan octane:install --server=swoole
"

# Use official node image to install dependencies
docker run --rm -it -v "$CURRENT_DIR/$LARAVEL_DIR/project":/app -w /app node:20 sh -c "
  npm install
  npm install --save-dev chokidar
"
