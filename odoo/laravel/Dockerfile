FROM php:8.4-cli
WORKDIR /app

RUN apt-get update && apt-get install -y   git unzip supervisor inotify-tools   && rm -rf /var/lib/apt/lists/*

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions &&     install-php-extensions pdo_mysql pdo_pgsql zip exif bcmath sockets gd pcntl

RUN mkdir -p /usr/src/php/ext/swoole     && curl -L https://github.com/swoole/swoole-src/archive/refs/tags/v6.0.0.tar.gz | tar xz -C /usr/src/php/ext/swoole --strip-components=1     && docker-php-ext-install swoole

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
COPY --from=node:20 /usr/local/bin /usr/local/bin
COPY --from=node:20 /usr/local/lib /usr/local/lib

RUN chown -R www-data:www-data /app

COPY ./zz-custom.ini /usr/local/etc/php/conf.d/zz-custom.ini

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
