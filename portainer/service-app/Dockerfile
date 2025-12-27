FROM dunglas/frankenphp
WORKDIR /app

RUN apt-get update && apt-get install -y \
  git unzip libpq-dev libzip-dev libpng-dev \
  supervisor \
  && pecl install mongodb \
  && docker-php-ext-enable mongodb \
  && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip exif bcmath \
  && rm -rf /var/lib/apt/lists/*

RUN install-php-extensions \
  mongodb pdo_mysql pdo_pgsql zip exif bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

RUN chown -R www-data:www-data /app

COPY ./supervisord.conf /etc/supervisord.conf

COPY ./zz-custom.ini /usr/local/etc/php/conf.d/zz-custom.ini

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
