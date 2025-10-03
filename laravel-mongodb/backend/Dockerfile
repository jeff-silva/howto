# Etapa base: PHP + extensões necessárias
FROM php:8.4-fpm
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
  git unzip libpq-dev libzip-dev libpng-dev \
  supervisor libssl-dev pkg-config nginx \
  && pecl install mongodb \
  && docker-php-ext-enable mongodb \
  && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip exif bcmath \
  && rm -rf /var/lib/apt/lists/*

COPY ./zz-custom.ini /usr/local/etc/php/conf.d/zz-custom.ini

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

COPY ./supervisord.conf /etc/supervisord.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./site.conf /etc/nginx/conf.d/default.conf

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN chown -R www-data:www-data /var/www/html
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]