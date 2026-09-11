#!/bin/sh

# Configurações (podem ser substituídas por variáveis de ambiente via .env)
ARQUIVO_SAIDA=${ARQUIVO_SAIDA:-"output/audio.mp3"}
GERAR_LEGENDA=${GERAR_LEGENDA:-"false"}
VOZ=${VOZ:-"pt-BR-ThalitaMultilingualNeural"}
TEXTO_ARQUIVO="input/audio.txt"

mkdir -p output

echo "⚡ Instalando edge-tts no contêiner..."
pip install -q edge-tts

echo "🗣️  Gerando áudio com a voz neural: $VOZ..."
edge-tts \
  --voice "$VOZ" \
  --rate="+0%" \
  --file "$TEXTO_ARQUIVO" \
  --write-media "/app/$ARQUIVO_SAIDA"

read -p "Deseja gerar a transcrição (audio.json)? (s/n): " resposta_legenda
if [ "$resposta_legenda" = "s" ] || [ "$resposta_legenda" = "S" ]; then
    GERAR_LEGENDA="true"
else
    GERAR_LEGENDA="false"
fi

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
        echo "window.AUDIO_WORDS = $(cat $ARQUIVO_JSON);" > input/audio.js
        echo "✅ Transcrição salva em $ARQUIVO_JSON e exportada para input/audio.js"
    fi
fi

echo "✅ Áudio gerado em $ARQUIVO_SAIDA"
