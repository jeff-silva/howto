FROM bitnami/laravel:latest
WORKDIR /app

RUN apt-get update && apt-get install -y supervisor
RUN echo "opcache.enable=0" >> /opt/bitnami/php/etc/conf.d/opcache-disable.ini

COPY supervisord.conf /etc/supervisord.conf

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
