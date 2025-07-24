FROM mysql:latest

ENV MYSQL_ROOT_PASSWORD=app
ENV MYSQL_DATABASE=app
ENV MYSQL_USER=app
ENV MYSQL_PASSWORD=app

COPY ./entrypoint.sql /docker-entrypoint-initdb.d/entrypoint.sql

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]