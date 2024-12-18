FROM dunglas/frankenphp:builder AS builder

# Copy xcaddy in the builder image
COPY --from=caddy:builder /usr/bin/xcaddy /usr/bin/xcaddy

# CGO must be enabled to build FrankenPHP
RUN CGO_ENABLED=1 \
  XCADDY_SETCAP=1 \
  XCADDY_GO_BUILD_FLAGS="-ldflags='-w -s' -tags=nobadger,nomysql,nopgx" \
  CGO_CFLAGS=$(php-config --includes) \
  CGO_LDFLAGS="$(php-config --ldflags) $(php-config --libs)" \
  xcaddy build \
  --output /usr/local/bin/frankenphp \
  --with github.com/dunglas/frankenphp=./ \
  --with github.com/dunglas/frankenphp/caddy=./caddy/ \
  --with github.com/dunglas/caddy-cbrotli \
  --with github.com/dunglas/mercure/caddy \
  --with github.com/dunglas/vulcain/caddy

FROM dunglas/frankenphp AS runner

# Replace the official binary by the one contained your custom modules
COPY --from=builder /usr/local/bin/frankenphp /usr/local/bin/frankenphp

COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN chmod +x /etc/supervisor/conf.d/supervisord.conf

RUN apt-get update && apt-get install -y libzip-dev zip supervisor
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer && chmod +x /usr/bin/composer

COPY ./container-init.sh /usr/local/bin/container-init.sh
RUN chmod +x /usr/local/bin/container-init.sh
ENTRYPOINT ["container-init.sh"]

CMD [ "frankenphp", "run", "--config", "/etc/caddy/Caddyfile", "--watch" ]