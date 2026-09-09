#!/bin/bash

# Este script usa DOCKER para rodar o Edge-TTS (Vozes Neurais da Microsoft).
# NADA será instalado no seu sistema WSL. Tudo acontece dentro do contêiner!

# 1. Define o texto multilinha
read -r -d '' TEXTO << 'EOF'
O site da sua empresa não deve ser só um cartão de visitas bonitinho. Ele deve trabalhar por você.

Muitas empresas gastam uma fortuna para colocar um site no ar e depois deixam ele lá, parado.
Um site que só tem o seu endereço e o botão do WhatsApp não é uma ferramenta, é só um panfleto digital.
Faça mais com a sua página!

A Labscrípit constrói soluções sob medida que resolvem problemas reais.

Emissão de segunda via ou pagamentos pela web? A Labscrípit faz.
Receber, organizar e filtrar currículos? A Labscrípit faz.
Inserir o cliente no funil de vendas?
Enviar links de download por e-mail?
Gerar arquivos PDF?
Receber arquivos?
Receber pedidos?
Enviar e-mails?
Abrir chamado?

A Labscrípit faz.

Se o seu site não está automatizando o seu trabalho e captando clientes, ele está te dando prejuízo.
Quer transformar o seu site em uma máquina de verdade? Mande um direct.
A Labscrípit pode te ajudar.
EOF

ARQUIVO_SAIDA=$(date +"%y-%m-%d-%H-%M-%S")-edge.mp3

echo "🐳 Subindo um contêiner minúsculo do Python Alpine para o Edge-TTS..."

# 2. Executa TUDO dentro do Docker
docker run --rm \
  -v "$(pwd):/app" \
  -w /app \
  -e TEXTO="$TEXTO" \
  -e ARQUIVO_SAIDA="$ARQUIVO_SAIDA" \
  python:3.11-alpine \
  sh -c '
    echo "⚡ Instalando edge-tts no contêiner..."
    # Instala a biblioteca do edge-tts silenciosamente
    pip install -q edge-tts

    # Salva o texto em um arquivo temporário para garantir que múltiplas linhas não quebrem o comando
    echo "$TEXTO" > /tmp/texto.txt

    echo "🗣️  Gerando áudio com a voz neural do Antônio..."
    # Executa o edge-tts gerando o MP3 final
    # Obs: Se quiser uma voz feminina maravilhosa, troque pt-BR-AntonioNeural por pt-BR-FranciscaNeural
    edge-tts \
      --voice pt-BR-AntonioNeural \
      --rate="+0%" \
      --file /tmp/texto.txt \
      --write-media "/app/$ARQUIVO_SAIDA"
  '

echo "✅ Áudio incrível gerado em segundos! Verifique o arquivo $ARQUIVO_SAIDA"
