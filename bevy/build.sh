#!/bin/bash
set -e

echo "🔨 Compilando o Bevy para WebAssembly..."
cargo build --release --target wasm32-unknown-unknown

echo "⚙️  Gerando os bindings JavaScript em ./build/bevy..."
# Gera o arquivo JavaScript e WASM dentro da pasta build/bevy
wasm-bindgen --out-dir ./build/bevy --target web ./target/wasm32-unknown-unknown/release/bevy_app.wasm

echo "🚀 Jogo pronto! Iniciando servidor web..."
echo "👉 Abra no seu navegador: http://localhost:8000"
# Inicia o servidor Python com a pasta 'build' como raiz
python3 -m http.server 8000 -d build
