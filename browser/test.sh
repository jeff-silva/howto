#!/bin/bash

# Usamos a imagem node:20-alpine por ser extremamente leve (~50MB).
# A flag --rm apaga o container assim que ele terminar, não deixando lixo.
# A flag --network host é vital aqui para que o script dentro do container
# consiga enxergar o "localhost:9222" onde o Chromium está rodando.

docker run --rm \
  --network host \
  -v "$(pwd)/src/test.js:/app/test.js" \
  -w /app \
  node:20-alpine \
  sh -c "npm install puppeteer-core --no-fund --no-audit && node test.js"
