#!/bin/bash

# Pega o caminho absoluto de onde ESTE script está instalado (ex: /home/jeff/howto/videogen/bin)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)"

# Carrega o arquivo .env que estiver NA MESMA PASTA do script (assim funciona de qualquer lugar)
if [ -f "$SCRIPT_DIR/.env" ]; then
    export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)
fi

echo "🎙️  Gerador de Áudio e Legenda (TTS)"
echo "-------------------------------------"

NOME_PASTA="."

read -p "📄 Digite o nome do arquivo (sem extensão, ex: audio): " NOME_ARQUIVO
if [ -z "$NOME_ARQUIVO" ]; then
    echo "❌ Nome de arquivo não pode ser vazio. Saindo..."
    exit 1
fi

read -p "📝 Deseja gerar arquivo de legenda (.json e .js) palavra por palavra via Groq API? (s/n): " RESPOSTA_LEGENDA
if [[ "$RESPOSTA_LEGENDA" =~ ^[Ss]$ ]]; then
    GERAR_LEGENDA=1
else
    GERAR_LEGENDA=0
fi

ARQUIVO_SAIDA="${NOME_PASTA}/${NOME_ARQUIVO}.mp3"
TEXTO_ARQUIVO="${NOME_PASTA}/${NOME_ARQUIVO}.txt"

# Cria a pasta recursivamente
mkdir -p "$NOME_PASTA"

# Cria o arquivo de texto vazio caso não exista
touch "$TEXTO_ARQUIVO"

echo "-------------------------------------"
echo "✍️  O arquivo de texto foi criado:"
echo "👉  $TEXTO_ARQUIVO"
echo ""
echo "Abra este arquivo no seu editor (VS Code, Bloco de Notas, etc.), cole e edite o seu roteiro."
echo "Salve o arquivo quando terminar."
echo "-------------------------------------"
read -p "Pressione ENTER aqui quando estiver pronto para gerar o áudio..."

# Verifica se o arquivo tem conteúdo (-s)
if [ ! -s "$TEXTO_ARQUIVO" ]; then
    echo "❌ O arquivo $TEXTO_ARQUIVO está vazio. Saindo..."
    exit 1
fi

VOZ=${VOZ:-"pt-BR-ThalitaMultilingualNeural"}

echo "-------------------------------------"
echo "⚡ Gerando áudio com a voz neural: $VOZ (via Docker)..."
docker run --rm -v "$(pwd):/app" -w /app python:3.10-alpine sh -c "
  pip install -q edge-tts &&
  edge-tts --voice \"$VOZ\" --rate=\"+0%\" --file \"$TEXTO_ARQUIVO\" --write-media \"$ARQUIVO_SAIDA\"
"
echo "✅ Áudio salvo em $ARQUIVO_SAIDA"

echo "-------------------------------------"
if [ "$GERAR_LEGENDA" -eq 1 ]; then
    if [ -z "$GROQ_API_KEY" ]; then
        echo "⚠️  A variável GROQ_API_KEY não foi encontrada em $SCRIPT_DIR/.env"
        echo "Pulando geração de legenda..."
    else
        echo "📝 Transcrevendo áudio com a API da Groq (via Docker)..."
        ARQUIVO_JSON="${NOME_PASTA}/${NOME_ARQUIVO}.json"
        ARQUIVO_JS="${NOME_PASTA}/${NOME_ARQUIVO}.js"
        RAW_JSON="${NOME_PASTA}/${NOME_ARQUIVO}_raw.json"
        
        # Roda o curl e o jq num container alpine descartável
        docker run --rm -e GROQ_API_KEY="${GROQ_API_KEY}" -v "$(pwd):/app" -w /app alpine sh -c "
          apk add -q curl jq &&
          curl -s -X POST https://api.groq.com/openai/v1/audio/transcriptions \
            -H \"Authorization: Bearer \$GROQ_API_KEY\" \
            -F \"file=@$ARQUIVO_SAIDA\" \
            -F \"model=whisper-large-v3\" \
            -F \"response_format=verbose_json\" \
            -F \"timestamp_granularities[]=word\" \
            -F \"language=pt\" > \"$RAW_JSON\" &&
          if grep -q \"error\" \"$RAW_JSON\"; then
              echo \"❌ Erro na API da Groq:\"
              cat \"$RAW_JSON\"
          else
              cat \"$RAW_JSON\" | jq '[.words[]? | {word: (.word | ltrimstr(\" \") | rtrimstr(\" \")), start: (.start*1000|round)/1000, end: (.end*1000|round)/1000}]' > \"$ARQUIVO_JSON\"
              echo \"window.AUDIO_WORDS = \$(cat \"$ARQUIVO_JSON\");\" > \"$ARQUIVO_JS\"
              echo \"✅ Legenda JSON salva em $ARQUIVO_JSON\"
              echo \"✅ Legenda JS salva em $ARQUIVO_JS\"
          fi
          rm -f \"$RAW_JSON\"
        "
    fi
fi

# O arquivo de texto principal ($TEXTO_ARQUIVO) será mantido na pasta.
