#!/bin/sh

SERVICE_DIR=$(cd "$(dirname "$0")" && pwd)

read -p "folder name [src]: " NUXT_DIR
NUXT_DIR=${NUXT_DIR:-src}

# # sudo rm -rf "$SERVICE_DIR/$NUXT_DIR"

if [ -d "$SERVICE_DIR/$NUXT_DIR" ]; then
    exit 1
fi

docker run -it --rm -v "$SERVICE_DIR:/app" -w /app node:latest /bin/bash -c "{
    npm create nuxt@latest $NUXT_DIR
    cd ./$NUXT_DIR
}"

sudo chmod 0777 -R "$SERVICE_DIR/$NUXT_DIR"
