FROM dunglas/frankenphp

COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN chmod +x /etc/supervisor/conf.d/supervisord.conf

RUN apt-get update && apt-get install -y libzip-dev zip supervisor

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer && chmod +x /usr/bin/composer


# CMD [ "frankenphp", "run", "--config", "/etc/caddy/Caddyfile" ]

# COPY ./container-init.sh /usr/local/bin/container-init.sh
# RUN chmod +x /usr/local/bin/container-init.sh
# ENTRYPOINT ["container-init.sh"]