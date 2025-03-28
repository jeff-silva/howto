#!/bin/sh

# [ ! -d "./app" ] && exit 1

PROJECT_PATH=$(dirname "$(readlink -f "$0")")
PROJECT_NAME=$(basename "$PROJECT_PATH")
PROJECT_DIR="app"

cat <<EOF > "$PROJECT_PATH/Dockerfile"
FROM node:22
WORKDIR /app
RUN npm install -g @nestjs/cli
RUN yarn install
CMD ["yarn", "start:dev"]
EOF

cat <<EOF > "$PROJECT_PATH/readme.md"
# NestJS Docker

1 - Create new NestJS application running install.sh in this folder: \`sh install.sh\`.

2 - Insert service above in main compose.yml file:

\`\`\`yaml
services:
  nestjs:
    build: ./$PROJECT_NAME
    volumes:
      - ./$PROJECT_NAME/$PROJECT_DIR:/app
    ports:
      - 3000:3000
\`\`\`

EOF

docker run --rm -it -v $PROJECT_PATH:/app -w /app node:22 sh -c "npm i -g @nestjs/cli && nest new $PROJECT_DIR"
