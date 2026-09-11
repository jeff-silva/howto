#!/bin/bash
# bash -c "$(curl -fsSL https://raw.githubusercontent.com/jeff-silva/howto/refs/heads/main/bin/hyperframes/create.sh)"

CURRENT_DIR=$(pwd)
echo "Current folder: $CURRENT_DIR"

VALUE_DEFAULT="hyperframes"
echo -e "\nDefine folder (default: \"$VALUE_DEFAULT\")"
echo "Place: $CURRENT_DIR/$VALUE_DEFAULT";
read -p "New value (empty to keep default): " VALUE
HYPERFRAMES_DIR=${VALUE:-$VALUE_DEFAULT}

# Folders
mkdir -p "$CURRENT_DIR/$HYPERFRAMES_DIR"

# .gitignore
FILENAME="$CURRENT_DIR/$HYPERFRAMES_DIR/.gitignore"
[ -f $FILENAME ] || cat << EOF > $FILENAME
.cache
EOF

# compose.yml
FILENAME="$CURRENT_DIR/$HYPERFRAMES_DIR/compose.yml"
[ -f $FILENAME ] || cat << EOF > $FILENAME
services:
  cli:
    build: .
    volumes:
      - ./:/workspace
      - ./.cache:/root/.cache
    ports: ["3000:3000"]
    command: sleep infinity

  proxy:
    image: alpine/socat
    network_mode: "service:cli"
    depends_on: [cli]
    command: tcp-listen:3000,fork,reuseaddr tcp-connect:127.0.0.1:3002
EOF

# Dockerfile
FILENAME="$CURRENT_DIR/$HYPERFRAMES_DIR/Dockerfile"
[ -f $FILENAME ] || cat << EOF > $FILENAME
FROM node:22-bookworm

# Instala todas as dependências gráficas e o Chromium
RUN apt-get update && apt-get install -y \\
    chromium \\
    ffmpeg \\
    libnss3 \\
    libatk-bridge2.0-0 \\
    libx11-xcb1 \\
    libxcomposite1 \\
    libxdamage1 \\
    libxrandr2 \\
    libgbm1 \\
    libasound2 \\
    && rm -rf /var/lib/apt/lists/*

# Configura o Puppeteer para sempre usar o Chromium nativo com --no-sandbox
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/local/bin/chromium-wrapper

# Cria o wrapper definitivo do Chrome para nunca mais termos o bug do "Navigation Timeout"
RUN echo '#!/bin/sh' > /usr/local/bin/chromium-wrapper && \\
    echo '/usr/bin/chromium --no-sandbox "\$@"' >> /usr/local/bin/chromium-wrapper && \\
    chmod +x /usr/local/bin/chromium-wrapper

WORKDIR /workspace

# Opcional: já deixa a ferramenta do hyperframes pré-instalada globalmente
RUN npm install -g hyperframes@latest

# Mantém o container vivo para receber comandos
CMD ["sleep", "infinity"]
EOF

# package.json
FILENAME="$CURRENT_DIR/$HYPERFRAMES_DIR/package.json"
[ -f $FILENAME ] || cat << EOF > $FILENAME
{
  "name": "hyperframes",
  "version": "1.0.0",
  "description": "Hyperframes",
  "scripts": {
    "dev": "docker compose up -d --build --force-recreate --remove-orphans"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}
EOF

# README.md
FILENAME="$CURRENT_DIR/$HYPERFRAMES_DIR/README.md"
[ -f $FILENAME ] || cat << EOF > $FILENAME
\`\`\`bash
npx hyperframes init my-video
cd my-video
npx hyperframes preview
npx hyperframes render
\`\`\`
EOF

# # Install Elysia if project folder does not exists
# if [ ! -d "$CURRENT_DIR/$HYPERFRAMES_DIR/project" ]; then
#   docker run --rm -it -v "$CURRENT_DIR":/app -w /app oven/bun bun create elysiajs "$HYPERFRAMES_DIR/project"
# fi
