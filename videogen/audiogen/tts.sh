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

# Arquivo temporário para salvar as respostas coletadas pelo container Python
CONFIG_TMP="$PWD/.tts_config_tmp.json"
rm -f "$CONFIG_TMP"

# Cria script python temporário para coleta de dados
PY_PROMPT_SCRIPT=$(mktemp)
cat << 'PYEOF' > "$PY_PROMPT_SCRIPT"
import questionary
import json
import sys

voz = questionary.select(
    'Selecione a voz desejada:',
    choices=[
        'pt-BR-FranciscaNeural',
        'pt-BR-AntonioNeural',
        'pt-BR-ThalitaMultilingualNeural'
    ]
).ask()

if not voz:
    sys.exit(1)

tom = questionary.select(
    'Selecione o tom/estilo da narração:',
    choices=[
        questionary.Choice('😊 Normal / Padrão (natural e pra cima)', value='normal'),
        questionary.Choice('😔 Triste / Melancólico (mais lento e grave)', value='triste')
    ]
).ask()

if not tom:
    sys.exit(1)

presets = {
    'normal': {'rate': '+0%', 'pitch': '+0Hz'},
    'triste': {'rate': '-15%', 'pitch': '-12Hz'}
}

rate = presets[tom]['rate']
pitch = presets[tom]['pitch']

nome_arquivo = questionary.text(
    'Digite o nome do arquivo (sem extensão, ex: audio):',
    default='audio'
).ask()

if not nome_arquivo:
    sys.exit(1)

transcrever = questionary.confirm(
    'Deseja gerar transcrição/legenda do áudio com IA (Groq Whisper)?',
    default=True
).ask()

data = {
    'voz': voz,
    'tom': tom,
    'rate': rate,
    'pitch': pitch,
    'nome_arquivo': nome_arquivo.strip(),
    'transcrever': transcrever
}

with open('/work/.tts_config_tmp.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False)
PYEOF

chmod 644 "$PY_PROMPT_SCRIPT"

# Executa container com Python + questionary para coletar as opções interativamente
docker run -it --rm \
  -u "$(id -u):$(id -g)" \
  -e HOME=/tmp \
  -v "$PWD:/work" \
  -v "$PY_PROMPT_SCRIPT:/prompt.py:ro" \
  -w /work \
  python:3.10-alpine sh -c "pip install -q questionary >/dev/null 2>&1 && python /prompt.py"

rm -f "$PY_PROMPT_SCRIPT"

CONFIG_TMP="$PWD/.tts_config_tmp.json"

if [ ! -s "$CONFIG_TMP" ]; then
    echo "❌ Operação cancelada ou falha na coleta de dados."
    rm -f "$CONFIG_TMP"
    exit 1
fi

# Extrai os dados coletados com python do host ou leitura simples
VOZ=$(python3 -c "import json; d=json.load(open('$CONFIG_TMP')); print(d['voz'])" 2>/dev/null || grep -o '"voz": *"[^"]*"' "$CONFIG_TMP" | cut -d'"' -f4)
TOM=$(python3 -c "import json; d=json.load(open('$CONFIG_TMP')); print(d['tom'])" 2>/dev/null || grep -o '"tom": *"[^"]*"' "$CONFIG_TMP" | cut -d'"' -f4)
RATE=$(python3 -c "import json; d=json.load(open('$CONFIG_TMP')); print(d['rate'])" 2>/dev/null || grep -o '"rate": *"[^"]*"' "$CONFIG_TMP" | cut -d'"' -f4)
PITCH=$(python3 -c "import json; d=json.load(open('$CONFIG_TMP')); print(d['pitch'])" 2>/dev/null || grep -o '"pitch": *"[^"]*"' "$CONFIG_TMP" | cut -d'"' -f4)
NOME_ARQUIVO=$(python3 -c "import json; d=json.load(open('$CONFIG_TMP')); print(d['nome_arquivo'])" 2>/dev/null || grep -o '"nome_arquivo": *"[^"]*"' "$CONFIG_TMP" | cut -d'"' -f4)
TRANSCREVER_BOOL=$(python3 -c "import json; d=json.load(open('$CONFIG_TMP')); print(d['transcrever'])" 2>/dev/null || grep -o '"transcrever": *[a-z]*' "$CONFIG_TMP" | cut -d':' -f2 | tr -d ' ')

rm -f "$CONFIG_TMP"

if [ "$TRANSCREVER_BOOL" = "True" ] || [ "$TRANSCREVER_BOOL" = "true" ]; then
    GERAR_LEGENDA=1
else
    GERAR_LEGENDA=0
fi

ARQUIVO_SAIDA="${NOME_PASTA}/${NOME_ARQUIVO}.mp3"
TEXTO_ARQUIVO="${NOME_PASTA}/${NOME_ARQUIVO}.txt"

# Cria a pasta recursivamente
mkdir -p "$NOME_PASTA"

# Cria o arquivo de texto caso ainda não exista
touch "$TEXTO_ARQUIVO"

echo "-------------------------------------"
echo "✍️  Arquivo de texto pronto para edição:"
echo "👉  $TEXTO_ARQUIVO"
echo ""
echo "Abra o arquivo no seu editor, edite/cole o seu roteiro e salve o arquivo."
echo "-------------------------------------"
read -p "Pressione ENTER aqui assim que tiver salvo o arquivo para gerar o áudio..."

if [ ! -s "$TEXTO_ARQUIVO" ]; then
    echo "❌ O arquivo $TEXTO_ARQUIVO está vazio. Saindo..."
    exit 1
fi

echo "-------------------------------------"
echo "⚡ Gerando áudio com a voz neural: $VOZ (Tom: $TOM | Vel: $RATE | Pitch: $PITCH)..."
# Constrói a imagem Docker localmente se ela ainda não existir
if ! docker image inspect edge-tts-local >/dev/null 2>&1; then
    echo "⚙️  Construindo imagem Docker com edge-tts (isso só ocorre na primeira vez e pode demorar alguns minutos)..."
    docker build -t edge-tts-local - >/dev/null <<EOF
FROM python:3.10-alpine
RUN pip install --no-cache-dir edge-tts
EOF
fi

# Roda o edge-tts
echo -n "⏳ Gerando áudio..."
if docker run --rm -v "$(pwd):/app" -w /app edge-tts-local edge-tts \
  --voice "$VOZ" --rate="$RATE" --pitch="$PITCH" --file "$TEXTO_ARQUIVO" --write-media "$ARQUIVO_SAIDA"; then
    echo -e "\r⏳ Gerando áudio... Concluído!     "
else
    echo -e "\r❌ Falha ao gerar áudio com edge-tts."
    exit 1
fi

echo "✅ Áudio salvo em $ARQUIVO_SAIDA"

echo "-------------------------------------"
if [ "$GERAR_LEGENDA" -eq 1 ]; then
    API_KEY="${OPENAI_KEY:-$GROQ_API_KEY}"
    API_URL="${OPENAI_URL:-https://api.groq.com/openai/v1}"
    # Remove barra final da URL se houver
    API_URL="${API_URL%/}"

    if [ -z "$API_KEY" ]; then
        echo "⚠️  Nenhuma chave encontrada (OPENAI_KEY ou GROQ_API_KEY) em $SCRIPT_DIR/.env"
        echo "Pulando geração de legenda..."
    else
        echo "📝 Transcrevendo áudio via API ($API_URL)..."
        ARQUIVO_JSON="${NOME_PASTA}/${NOME_ARQUIVO}.json"
        RAW_JSON="${NOME_PASTA}/${NOME_ARQUIVO}_raw.json"
        
        # Roda o curl e o jq num container alpine descartável
        docker run --rm -e API_KEY="${API_KEY}" -e API_URL="${API_URL}" -v "$(pwd):/app" -w /app alpine sh -c "
          apk add -q curl jq &&
          curl -# -X POST \"\$API_URL/audio/transcriptions\" \
            -H \"Authorization: Bearer \$API_KEY\" \
            -F \"file=@$ARQUIVO_SAIDA\" \
            -F \"model=whisper-large-v3\" \
            -F \"response_format=verbose_json\" \
            -F \"timestamp_granularities[]=word\" \
            -F \"language=pt\" > \"$RAW_JSON\" &&
          if grep -q \"error\" \"$RAW_JSON\"; then
              echo \"❌ Erro na API de transcrição:\"
              cat \"$RAW_JSON\"
          else
              cat \"$RAW_JSON\" | jq '[.words[]? | {word: (.word | ltrimstr(\" \") | rtrimstr(\" \")), start: (.start*1000|round)/1000, end: (.end*1000|round)/1000}]' > \"$ARQUIVO_JSON\"
              echo \"✅ Legenda JSON salva em $ARQUIVO_JSON\"
          fi
          rm -f \"$RAW_JSON\"
        "
    fi
fi

# O arquivo de texto principal ($TEXTO_ARQUIVO) será mantido na pasta.
