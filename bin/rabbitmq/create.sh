#!/bin/bash
# bash -c "$(curl -fsSL https://raw.githubusercontent.com/jeff-silva/howto/refs/heads/main/bin/rabbitmq/create.sh)"

CURRENT_DIR=$(pwd)
echo "Current folder: $CURRENT_DIR"

VALUE_DEFAULT="rabbitmq"
echo -e "\nDefine folder (default: \"$VALUE_DEFAULT\")"
echo "Place: $CURRENT_DIR/$VALUE_DEFAULT";
read -p "New value (empty to keep default): " VALUE
RABBITMQ_DIR=${VALUE:-$VALUE_DEFAULT}

VALUE_DEFAULT="main@grr.la"
echo -e "\nRabbitMQ user (default: \"$VALUE_DEFAULT\")"
read -p "New value (empty to keep default): " VALUE
RABBITMQ_USER=${VALUE:-$VALUE_DEFAULT}

VALUE_DEFAULT="main@grr.la"
echo -e "\nRabbitMQ pass (default: \"$VALUE_DEFAULT\")"
read -p "New value (empty to keep default): " VALUE
RABBITMQ_PASS=${VALUE:-$VALUE_DEFAULT}

# Criando a estrutura de pastas
mkdir -p "$CURRENT_DIR/$RABBITMQ_DIR/project"

# Dockerfile
cat << EOF > "$CURRENT_DIR/$RABBITMQ_DIR/Dockerfile"
FROM rabbitmq:3-management-alpine
EOF

# compose.yml
cat << EOF > "$CURRENT_DIR/$RABBITMQ_DIR/compose.yml"
services:
  $RABBITMQ_DIR:
    build: .
    ports: ["5672:5672", "15672:15672"]
    env_file: [./.env]
    volumes: [./project:/var/lib/rabbitmq]
EOF

# .env
cat << EOF > "$CURRENT_DIR/$RABBITMQ_DIR/.env"
RABBITMQ_DEFAULT_USER=$RABBITMQ_USER
RABBITMQ_DEFAULT_PASS=$RABBITMQ_PASS
EOF

# .gitignore
cat << EOF > "$CURRENT_DIR/$RABBITMQ_DIR/.gitignore"
project
EOF

# README.md
cat << EOF > "$CURRENT_DIR/$RABBITMQ_DIR/README.md"
# RabbitMQ

Executando:

\`\`\`bash
# Modo desenvolvimento
BUN_CMD=dev docker compose up -d --build --remove-orphans

# Modo produção
BUN_CMD=start docker compose up -d --build --remove-orphans
\`\`\`

Executando em modo de produção:

\`\`\`bash
BUN_CMD=start docker compose up -d --build --remove-orphans
\`\`\`

Incluindo no compose.yml global

\`\`\`yml
networks:
  default:
    name: main_network

include:
  - ./$RABBITMQ_DIR/compose.yml
\`\`\`
EOF