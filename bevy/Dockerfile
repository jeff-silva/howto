FROM rust:latest

ENV DEBIAN_FRONTEND=noninteractive

# Instala o Python3 para podermos subir um servidor HTTP simples no final
RUN apt-get update && apt-get install -y python3 && rm -rf /var/lib/apt/lists/*

# Adiciona o suporte para compilar para WebAssembly
RUN rustup target add wasm32-unknown-unknown

# Instala a ferramenta que gera o código JavaScript que conecta com o WebAssembly
# (Usando a versão 0.2.126 que é a compatível com o Bevy 0.14)
RUN cargo install wasm-bindgen-cli --version 0.2.126

WORKDIR /usr/src/app

CMD ["sh", "build.sh"]
