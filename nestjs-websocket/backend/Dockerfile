FROM node:22
WORKDIR /app

RUN apt-get update && apt-get install -y supervisor chromium

RUN npm install -g @nestjs/cli

COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./container-init.sh /usr/local/bin/container-init.sh
RUN chmod +x /usr/local/bin/container-init.sh
CMD ["sh", "-c", "container-init.sh"]