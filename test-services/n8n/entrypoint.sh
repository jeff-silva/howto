#!/bin/sh
chown -R node:node /home/node/.n8n
if [ 0 -eq 0 ]; then
  exec su node -s /bin/sh -c "/docker-entrypoint.sh"
else
  exec su node -s /bin/sh -c "/docker-entrypoint.sh $*"
fi
