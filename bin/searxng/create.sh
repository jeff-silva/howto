#!/bin/bash
# bash -c "$(curl -fsSL https://raw.githubusercontent.com/jeff-silva/howto/refs/heads/main/bin/searxng/create.sh)"

CURRENT_DIR=$(pwd)
echo "Current folder: $CURRENT_DIR"

VALUE_DEFAULT="searxng"
echo -e "\nDefine folder (default: \"$VALUE_DEFAULT\")"
echo "Place: $CURRENT_DIR/$VALUE_DEFAULT";
read -p "New value (empty to keep default): " VALUE
SEARXNG_DIR=${VALUE:-$VALUE_DEFAULT}

# Folders
mkdir -p "$CURRENT_DIR/$SEARXNG_DIR"

# compose.yml
cat << EOF >| "$CURRENT_DIR/$SEARXNG_DIR/compose.yml"
services:
  $SEARXNG_DIR:
    image: searxng/searxng:latest
    ports: ["8080:8080"]
    volumes:
      - ./settings.yml:/etc/searxng/settings.yml:ro
    environment:
      - SEARXNG_BASE_URL=http://localhost:8080/

EOF

# settings.yml
cat << EOF >| "$CURRENT_DIR/$SEARXNG_DIR/settings.yml"
use_default_settings: true
server:
  secret_key: "your-custom-token"
  limiter: false
  image_proxy: true
search:
  formats:
    - html
    - json
EOF

# package.json
cat << EOF >| "$CURRENT_DIR/$SEARXNG_DIR/package.json"
{
  "name": "$SEARXNG_DIR",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "dev": "docker compose stop && docker compose up -d --build --force-recreate --remove-orphans",
    "stop": "docker compose stop"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}
EOF
