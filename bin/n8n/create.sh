#!/bin/bash
# bash -c "$(curl -fsSL https://raw.githubusercontent.com/jeff-silva/snippets/refs/heads/main/n8n/create.sh)"

CURRENT_DIR=$(pwd)
echo "Current folder: $CURRENT_DIR"

N8N_DIR="n8n"

VALUE_DEFAULT=$N8N_DIR
echo -e "\nDefine RabbitMQ folder (default: \"$VALUE_DEFAULT\")"
echo "Place: $CURRENT_DIR/$VALUE_DEFAULT";
read -p "New value (empty to keep default): " VALUE
N8N_DIR=${VALUE:-$VALUE_DEFAULT}

# Folders
mkdir -p "$CURRENT_DIR/$N8N_DIR"

# .env
FILENAME="$CURRENT_DIR/$N8N_DIR/.env"
[ -f $FILENAME ] || cat << EOF > $FILENAME
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
WEBHOOK_URL=http://localhost:5678/
GENERIC_TIMEZONE=America/Sao_Paulo
EOF

# .gitignore
FILENAME="$CURRENT_DIR/$N8N_DIR/.gitignore"
[ -f $FILENAME ] || cat << EOF > $FILENAME
.env
.n8n
EOF

# compose.yml
FILENAME="$CURRENT_DIR/$N8N_DIR/compose.yml"
[ -f $FILENAME ] || cat << EOF > $FILENAME
services:
  $N8N_DIR:
    build: .
    ports: ["5678:5678"]
    env_file: [.env]
    volumes:
      - ./.n8n:/home/node/.n8n
EOF

# Dockerfile
FILENAME="$CURRENT_DIR/$N8N_DIR/Dockerfile"
[ -f $FILENAME ] || cat << EOF > $FILENAME
FROM n8nio/n8n:latest

USER root

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
EOF

# entrypoint.sh
FILENAME="$CURRENT_DIR/$N8N_DIR/entrypoint.sh"
[ -f $FILENAME ] || cat << EOF > $FILENAME
#!/bin/sh
chown -R node:node /home/node/.n8n
if [ $# -eq 0 ]; then
  exec su node -s /bin/sh -c "/docker-entrypoint.sh"
else
  exec su node -s /bin/sh -c "/docker-entrypoint.sh \$*"
fi
EOF