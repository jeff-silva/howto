FROM bitnami/laravel:latest
WORKDIR /app

RUN apt-get update && apt-get install -y supervisor

COPY supervisord.conf /etc/supervisord.conf

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
