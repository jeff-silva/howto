#!/bin/bash

# Este script usa DOCKER para rodar o Edge-TTS (Vozes Neurais da Microsoft).
# NADA será instalado no seu sistema WSL. Tudo acontece dentro do contêiner!

# Carrega as variáveis do arquivo .env, se ele existir
if [ -f ".env" ]; then
  export $(grep -v '^#' .env | xargs)
fi

# 1. Define o texto multilinha
read -r -d '' TEXTO << 'EOF'
O site da sua empresa não deve ser só um cartão de visitas bonitinho. Ele deve trabalhar por você.

Muitas empresas gastam uma fortuna para colocar um site no ar e depois deixam ele lá, parado.
Um site que só tem o seu endereço e o botão do WhatsApp não é uma ferramenta, é só um panfleto digital.
Faça mais com a sua página!

A Labscrípit constrói soluções sob medida que resolvem problemas reais.

Emissão de segunda via ou pagamentos pela web? A Labscrípit faz.
Receber, organizar e filtrar currículos? A Labscrípit faz.
Enviar links de download por e-mail? A Labscrípit faz.

Se o seu site não está automatizando o seu trabalho e captando clientes, ele está te dando prejuízo.
Quer transformar o seu site em uma máquina de verdade? Envie uma mensagem.
A Labscrípit pode te ajudar.
EOF

ARQUIVO_SAIDA="audio.mp3"

# Define se deseja gerar arquivo de legenda (.json) palavra por palavra (true ou false)
GERAR_LEGENDA="false"

# Opções de vozes em pt-BR disponíveis no Edge-TTS:
# VOZ="pt-BR-AntonioNeural"
# VOZ="pt-BR-FranciscaNeural"
VOZ="pt-BR-ThalitaMultilingualNeural"

echo "🐳 Subindo um contêiner minúsculo do Python Alpine para o Edge-TTS..."

# 2. Executa TUDO dentro do Docker
docker run --rm \
  -v "$(pwd):/app" \
  -w /app \
  -e TEXTO="$TEXTO" \
  -e ARQUIVO_SAIDA="$ARQUIVO_SAIDA" \
  -e VOZ="$VOZ" \
  -e GERAR_LEGENDA="$GERAR_LEGENDA" \
  -e GROQ_API_KEY="$GROQ_API_KEY" \
  python:3.11-alpine \
  sh -c '
    echo "⚡ Instalando edge-tts no contêiner..."
    # Instala a biblioteca do edge-tts silenciosamente
    pip install -q edge-tts

    # Salva o texto em um arquivo temporário para garantir que múltiplas linhas não quebrem o comando
    echo "$TEXTO" > /tmp/texto.txt

    echo "🗣️  Gerando áudio com a voz neural: $VOZ..."
    # Executa o edge-tts gerando o MP3 final
    edge-tts \
      --voice "$VOZ" \
      --rate="+0%" \
      --file /tmp/texto.txt \
      --write-media "/app/$ARQUIVO_SAIDA"

    if [ -n "$GROQ_API_KEY" ] && [ "$GERAR_LEGENDA" = "true" ]; then
        echo "📝 Transcrevendo áudio com a API da Groq..."
        apk add -q curl jq
        
        # Envia para a API da Groq
        curl -s -X POST https://api.groq.com/openai/v1/audio/transcriptions \
          -H "Authorization: Bearer $GROQ_API_KEY" \
          -F "file=@/app/$ARQUIVO_SAIDA" \
          -F "model=whisper-large-v3" \
          -F "response_format=verbose_json" \
          -F "timestamp_granularities[]=word" \
          -F "language=pt" > /tmp/raw_transcript.json
          
        if grep -q "error" /tmp/raw_transcript.json; then
            echo "❌ Erro na API da Groq:"
            cat /tmp/raw_transcript.json
        else
            ARQUIVO_JSON="${ARQUIVO_SAIDA%.*}.json"
            cat /tmp/raw_transcript.json | jq "[.words[]? | {word: (.word | ltrimstr(\" \") | rtrimstr(\" \")), start: (.start*1000|round)/1000, end: (.end*1000|round)/1000}]" > "$ARQUIVO_JSON"
            echo "window.AUDIO_WORDS = $(cat $ARQUIVO_JSON);" > hyperframes/words.js
            echo "✅ Transcrição salva em $ARQUIVO_JSON e exportada para hyperframes/words.js"
        fi
    fi
  '

echo "✅ Áudio incrível gerado em segundos! Verifique o arquivo $ARQUIVO_SAIDA"


