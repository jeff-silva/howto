#!/bin/bash
# bash -c "$(curl -fsSL https://raw.githubusercontent.com/jeff-silva/howto/refs/heads/main/bin/create.sh)"

CURRENT_DIR=$(pwd)
echo "Current folder: $CURRENT_DIR"

VALUE_DEFAULT="example-app"
echo -e "\nDefine folder (default: \"$VALUE_DEFAULT\")"
echo "Place: $CURRENT_DIR/$VALUE_DEFAULT";
read -p "New value (empty to keep default): " VALUE
APP_DIR=${VALUE:-$VALUE_DEFAULT}

# Criando a estrutura de pastas
mkdir -p "$CURRENT_DIR/$APP_DIR"

# package.json
FILENAME="$CURRENT_DIR/$APP_DIR/package.json"
[ -f $FILENAME ] || cat << EOF > $FILENAME
{
  "name": "$APP_DIR",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "dev": "docker compose stop && docker compose up -d --build --force-recreate --remove-orphans",
    "start": "docker compose stop && docker compose up -d --build --force-recreate --remove-orphans"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}
EOF

# compose.yml
FILENAME="$CURRENT_DIR/$APP_DIR/compose.yml"
[ -f $FILENAME ] || cat << EOF > $FILENAME
networks:
  default:
    name: main_network

include:
  - ./subfolder/compose.yml
EOF
