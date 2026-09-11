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

# Opcional: já deixa a ferramenta do hyperframes pré-instalada globalmente
RUN npm install -g hyperframes@latest

# Mantém o container vivo para receber comandos
CMD ["sleep", "infinity"]
