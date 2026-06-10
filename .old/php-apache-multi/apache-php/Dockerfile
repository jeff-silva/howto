FROM php:8.3-apache

ENV ACCEPT_EULA=Y
LABEL maintainer="jeferson.i.silva@gmail.com"

COPY ./start-container.sh /usr/local/bin/start-container.sh
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

RUN apt-get update && apt-get install -y libzip-dev zip \
    supervisor certbot python3-certbot-apache nano

RUN apt-get install -y libfreetype6-dev libjpeg62-turbo-dev libpng-dev && \
    docker-php-ext-configure gd --with-freetype=/usr/include/ --with-jpeg=/usr/include/ && \
    docker-php-ext-install gd pdo_mysql zip

RUN apt-get clean && rm -rf /var/lib/apt/lists/*
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer && chmod +x /usr/bin/composer

RUN chmod +x /usr/local/bin/start-container.sh

RUN chown -R www-data:www-data /etc/apache2
RUN chmod -R 755 /etc/apache2

ENTRYPOINT ["start-container.sh"]
