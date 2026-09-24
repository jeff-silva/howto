#!/bin/bash
# bash -c "$(curl -fsSL https://raw.githubusercontent.com/jeff-silva/howto/refs/heads/main/bin/strapi/create.sh)"

CURRENT_DIR=$(pwd)
echo "Current folder: $CURRENT_DIR"

VALUE_DEFAULT="strapi"
echo -e "\nDefine folder (default: \"$VALUE_DEFAULT\")"
echo "Place: $CURRENT_DIR/$VALUE_DEFAULT";
read -p "New value (empty to keep default): " VALUE
STRAPI_DIR=${VALUE:-$VALUE_DEFAULT}

# Folders
mkdir -p "$CURRENT_DIR/$STRAPI_DIR"

# docker run --rm -it -v "$CURRENT_DIR":/app -w /app node:20-alpine npx create-strapi@latest "$STRAPI_DIR/project"

cat << EOF >| "$CURRENT_DIR/$STRAPI_DIR/compose.yml"
services:
  strapi:
    build: .
    image: strapi:latest
    env_file: [./$STRAPI_DIR/.env]
    volumes:
      - ./config:/opt/app/config
      - ./src:/opt/app/src
      - ./package.json:/opt/package.json
      - ./package-lock.json:/opt/package-lock.json
      - ./$STRAPI_DIR/.env:/opt/app/.env
      - ./public/uploads:/opt/app/public/uploads
    ports: ["1337:1337"]
#     depends_on:
#       strapi-db:
#         condition: service_healthy

#   strapi-db:
#     image: postgres:16-alpine
#     environment:
#       POSTGRES_USER: ${DATABASE_USERNAME}
#       POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
#       POSTGRES_DB: ${DATABASE_NAME}
#     volumes:
#       - strapi-data:/var/lib/postgresql/data/
#     ports: ["5432:5432"]
#     healthcheck:
#       test: ["CMD-SHELL", "pg_isready -U ${DATABASE_USERNAME} -d ${DATABASE_NAME}"]
#       interval: 10s
#       timeout: 5s
#       retries: 5

# volumes:
#   strapi-data:
EOF

# cat << EOF >| $FILENAME
# # O sinal "|" avisa o bash para ignorar a proteção e sobrescrever!
# EOF

# # .env
# FILENAME="$CURRENT_DIR/$STRAPI_DIR/.env"
# [ -f $FILENAME ] || cat << EOF > $FILENAME
# NODE_ENV=development
# DATABASE_URL=postgres://user:pass@localhost:5432/db
# JWT_SECRET=supersecret
# EOF

# # compose.yml
# FILENAME="$CURRENT_DIR/$STRAPI_DIR/compose.yml"
# [ -f $FILENAME ] || cat << EOF > $FILENAME
# services:
#   $STRAPI_DIR:
#     build: .
#     ports: ["3000:3000"]
#     volumes: [./project:/app]
#     env_file: [.env]
#     command: sh -c "bun install && bun run \${BUN_CMD:-dev}"
# EOF

# # Dockerfile
# FILENAME="$CURRENT_DIR/$STRAPI_DIR/Dockerfile"
# [ -f $FILENAME ] || cat << EOF > $FILENAME
# FROM oven/bun:latest
# WORKDIR /app
# COPY ./project .
# RUN bun install

# EOF

# # Install Elysia if project folder does not exists
# if [ ! -d "$CURRENT_DIR/$STRAPI_DIR/project" ]; then
#   docker run --rm -it -v "$CURRENT_DIR":/app -w /app oven/bun bun create elysiajs "$STRAPI_DIR/project"
# fi
