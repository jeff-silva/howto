#!/bin/bash

# Este script baixa e usa o Piper TTS (super leve e muito rápido).
# Este script usa DOCKER para rodar o Piper TTS.
# NADA será instalado ou executado no seu sistema WSL. Tudo acontece dentro do contêiner!

# 1. Define o texto multilinha
read -r -d '' TEXTO << 'EOF'
O site da sua empresa não deve ser só um cartão de visitas bonitinho. Ele deve trabalhar por você.
Muitas empresas gastam uma fortuna para colocar um site no ar e depois deixam ele lá, parado. 
Um site que só tem o seu endereço e o botão do WhatsApp não é uma ferramenta, é só um panfleto digital. Faça mais com a sua página!

A Labscript constrói soluções sob medida que resolvem problemas reais.

Emissão de segunda via ou pagamentos pela web? A Labscript faz.
Receber, organizar e filtrar currículos? A Labscript faz.
Inserir o cliente no funil de vendas? A Labscript faz.
Enviar links de download por e-mail? A Labscript faz.

Se o seu site não está automatizando o seu trabalho e captando clientes, ele está te dando prejuízo. Quer transformar o seu site em uma máquina de verdade? Me manda um direct. A Labscript pode te ajudar.
EOF

ARQUIVO_SAIDA=$(date +"%y-%m-%d-%H-%M-%S")-piper.wav

echo "🐳 Subindo um contêiner limpo do Ubuntu para gerar o áudio isolado do seu sistema..."

# 2. Executa TUDO dentro do Docker
docker run --rm \
  -v "$(pwd):/app" \
  -w /app \
  -e TEXTO="$TEXTO" \
  -e ARQUIVO_SAIDA="$ARQUIVO_SAIDA" \
  ubuntu:22.04 \
  bash -c '
    # Cria uma pasta isolada para os arquivos do piper não ficarem soltos
    mkdir -p piper_models
    cd piper_models

    # Instala wget apenas DENTRO do contêiner para poder baixar os modelos
    if ! command -v wget &> /dev/null; then
        echo "⚡ Instalando dependências no contêiner..."
        apt-get update -qq && apt-get install -y -qq wget tar >/dev/null
    fi

    # Baixa o Piper no contêiner (se já não estiver baixado na pasta mapeada)
    if [ ! -f piper/piper ]; then
        echo "⚡ Baixando o motor do Piper (15 MB)..."
        wget -qO piper.tar.gz https://github.com/rhasspy/piper/releases/download/v1.2.0/piper_amd64.tar.gz
        tar -xzf piper.tar.gz
        rm piper.tar.gz
    fi

    # Baixa a voz PT-BR (se não existir)
    if [ ! -f pt_BR-faber-medium.onnx ]; then
        echo "🗣️  Baixando a voz (apenas ~30 MB!)..."
        wget -qO pt_BR-faber-medium.onnx "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx"
        wget -qO pt_BR-faber-medium.onnx.json "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/pt/pt_BR/faber/medium/pt_BR-faber-medium.onnx.json"
    fi

    echo "🎵 Gerando áudio super rápido..."
    # Gera o áudio jogando para a raiz da pasta compartilhada
    echo "$TEXTO" | ./piper/piper --model pt_BR-faber-medium.onnx --output_file "/app/$ARQUIVO_SAIDA" 2>/dev/null
  '

echo "✅ Concluído em um piscar de olhos! Verifique o arquivo $ARQUIVO_SAIDA"
