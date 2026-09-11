#!/bin/bash
# bash -c "$(curl -fsSL https://raw.githubusercontent.com/jeff-silva/howto/refs/heads/main/bin/novu/create.sh)"
# curl -fsSL https://raw.githubusercontent.com/novuhq/novu/next/docker/community/setup.sh | NOVU_DIR=~/novu bash

CURRENT_DIR=$(pwd)
echo "Current folder: $CURRENT_DIR"

VALUE_DEFAULT="novu"
echo -e "\nDefine folder (default: \"$VALUE_DEFAULT\")"
echo "Place: $CURRENT_DIR/$VALUE_DEFAULT";
read -p "New value (empty to keep default): " VALUE
NOVU_DIR=${VALUE:-$VALUE_DEFAULT}

if [ ! -f "$CURRENT_DIR/$NOVU_DIR/compose.yml" ]; then
  curl -fsSL https://raw.githubusercontent.com/novuhq/novu/next/docker/community/setup.sh | NOVU_DIR="$CURRENT_DIR/$NOVU_DIR" bash
  mv "$CURRENT_DIR/$NOVU_DIR/docker-compose.yml" "$CURRENT_DIR/$NOVU_DIR/compose.yml"
fi
