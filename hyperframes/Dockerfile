FROM node:22-bookworm

# Instala todas as dependências gráficas e o Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    ffmpeg \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Configura o Puppeteer para sempre usar o Chromium nativo com --no-sandbox
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/local/bin/chromium-wrapper

# Cria o wrapper definitivo do Chrome para nunca mais termos o bug do "Navigation Timeout"
RUN echo '#!/bin/sh' > /usr/local/bin/chromium-wrapper && \
    echo '/usr/bin/chromium --no-sandbox "$@"' >> /usr/local/bin/chromium-wrapper && \
    chmod +x /usr/local/bin/chromium-wrapper

WORKDIR /workspace

# Mantém a ferramenta do hyperframes pré-instalada globalmente
RUN npm install -g hyperframes@latest

# Script de inicialização: cria /workspace/src caso ainda não exista e levanta o preview na porta 3002
RUN printf '#!/bin/sh\nset -e\nif [ ! -f /workspace/src/index.html ]; then\n  echo "Inicializando projeto HyperFrames em /workspace/src..."\n  npx hyperframes init --non-interactive src\nfi\ncd /workspace/src\nexec npx hyperframes preview --foreground --no-open --port 3002\n' > /usr/local/bin/start-hyperframes && \
    chmod +x /usr/local/bin/start-hyperframes

CMD ["/usr/local/bin/start-hyperframes"]
