FROM node:22-bookworm

# Install Chromium and FFmpeg and dependencies for headless chrome
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

# Point Puppeteer (used by hyperframes) to the system chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Install hyperframes (with retry logic in case of network drops like ECONNRESET)
RUN for i in 1 2 3; do npm install -g hyperframes@latest && break || sleep 5; done

CMD ["hyperframes", "render", ".", "-o", "output.mp4"]
