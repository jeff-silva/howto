FROM dunglas/frankenphp:1-php8.4.15
WORKDIR /app

RUN apt-get update && apt-get install -y \
  git unzip libpq-dev libzip-dev libpng-dev libjpeg-dev libwebp-dev \
  supervisor libssl-dev libaio-dev libcurl4-openssl-dev inotify-tools \
  && rm -rf /var/lib/apt/lists/*

RUN pecl install swoole \
  && docker-php-ext-enable swoole

RUN docker-php-ext-configure gd --with-jpeg --with-webp \
  && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip exif bcmath sockets gd pcntl

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
COPY --from=node:20 /usr/local/bin /usr/local/bin
COPY --from=node:20 /usr/local/lib /usr/local/lib

RUN chown -R www-data:www-data /app

COPY ./zz-custom.ini /usr/local/etc/php/conf.d/zz-custom.ini

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["sh", "-c", "$SERVICE_APP_INIT"]