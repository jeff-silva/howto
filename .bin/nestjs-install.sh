#!/bin/bash
# curl -sL https://raw.githubusercontent.com/jeff-silva/howto/refs/heads/main/.bin/nestjs-install.sh | bash

echo "Folder name"
read folder
docker run --rm -it -v $(pwd):/app -w /app node:18 npm i -g @nestjs/cli && nest new $folder