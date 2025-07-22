FROM node:22

RUN apt-get update && apt-get install \
  git libx11-xcb1 libxcb-dri3-0 libxtst6 libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 libgbm1 \
  -yq --no-install-suggests --no-install-recommends \
  && apt-get clean && rm -rf /var/lib/apt/lists/*
