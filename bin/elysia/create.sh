#!/bin/bash
# bash -c "$(curl -fsSL https://raw.githubusercontent.com/jeff-silva/howto/refs/heads/main/bin/elysia/create.sh)"

CURRENT_DIR=$(pwd)
echo "Current folder: $CURRENT_DIR"

VALUE_DEFAULT="elysia"
echo -e "\nDefine folder (default: \"$VALUE_DEFAULT\")"
echo "Place: $CURRENT_DIR/$VALUE_DEFAULT";
read -p "New value (empty to keep default): " VALUE
ELYSIA_DIR=${VALUE:-$VALUE_DEFAULT}

# Folders
mkdir -p "$CURRENT_DIR/$ELYSIA_DIR"

# .env
FILENAME="$CURRENT_DIR/$ELYSIA_DIR/.env"
[ -f $FILENAME ] || cat << EOF > $FILENAME
NODE_ENV=development
DATABASE_URL=postgres://user:pass@localhost:5432/db
JWT_SECRET=supersecret
EOF

# compose.yml
FILENAME="$CURRENT_DIR/$ELYSIA_DIR/compose.yml"
[ -f $FILENAME ] || cat << EOF > $FILENAME
services:
  $ELYSIA_DIR:
    build: .
    ports: ["3000:3000"]
    volumes: [./project:/app]
    env_file: [.env]
    command: sh -c "bun install && bun run \${BUN_CMD:-dev}"
EOF

# Dockerfile
FILENAME="$CURRENT_DIR/$ELYSIA_DIR/Dockerfile"
[ -f $FILENAME ] || cat << EOF > $FILENAME
FROM oven/bun:latest
WORKDIR /app
COPY ./project .
RUN bun install

EOF

# Install Elysia if project folder does not exists
if [ ! -d "$CURRENT_DIR/$ELYSIA_DIR/project" ]; then
  docker run --rm -it -v "$CURRENT_DIR":/app -w /app oven/bun bun create elysiajs "$ELYSIA_DIR/project"
fi
