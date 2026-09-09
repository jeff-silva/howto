#!/bin/bash

# Este script utiliza a imagem Docker do Coqui TTS para gerar áudio usando o modelo XTTS-v2.
# Certifique-se de ter o Docker instalado e rodando.

# Defina o seu texto multilinha aqui
read -r -d '' TEXTO << 'EOF'
O site da sua empresa não deve ser só um cartão de visitas bonitinho. Ele deve trabalhar por você.

Muitas empresas gastam uma fortuna para colocar um site no ar e depois deixam ele lá, parado.
Um site que só tem o seu endereço e o botão do WhatsApp não é uma ferramenta, é só um panfleto digital. Faça mais com a sua página!

A Labscript constrói soluções sob medida que resolvem problemas reais.

Emissão de segunda via ou pagamentos pela web? A Labscript faz.
Receber, organizar e filtrar currículos? A Labscript faz.
Inserir o cliente no funil de vendas?
Enviar links de download por e-mail?
Gerar arquivos PDF?
Receber arquivos?
Receber pedidos?
Enviar e-mails?
Abrir chamado?

A Labscript faz.

Se o seu site não está automatizando o seu trabalho e captando clientes, ele está te dando prejuízo. Quer transformar o seu site em uma máquina de verdade? Me manda um direct. A Labscript pode te ajudar.
EOF

# Gera o nome do arquivo com a data e hora atual (yy-mm-dd-hh-mm-ss.wav)
ARQUIVO_SAIDA=$(date +"%y-%m-%d-%H-%M-%S").wav

# XTTS-v2 necessita de um áudio de referência para clonar a voz e extrair a entonação.
# Se você tiver um arquivo de voz (ex: voz_referencia.wav), você pode passá-lo.
# Por padrão, vamos usar um arquivo de exemplo se existir, senão o TTS pode falhar se não informarmos.
# Recomendado colocar um arquivo 'voz_referencia.wav' curto (3-5 segundos) na mesma pasta.
VOZ_REF="ref-jeff.wavv"

# Verifica se o arquivo de voz existe. XTTS exige um para gerar.
if [ ! -f "$VOZ_REF" ]; then
    echo "⚠️  AVISO: Arquivo de referência '$VOZ_REF' não encontrado na pasta."
    echo "Como você não tem um arquivo de voz próprio, vou usar a voz padrão 'Ana Florence' (embutida no modelo)."
    SPEAKER_ARG=(--speaker_idx "Ana Florence")
else
    SPEAKER_ARG=(--speaker_wav "/app/$VOZ_REF")
fi

echo "🎵 Gerando áudio para: '$TEXTO'"
echo "💾 O resultado será salvo em: $ARQUIVO_SAIDA"
echo "⏳ A primeira execução vai demorar para baixar a imagem e os modelos (~2GB)..."

# Cria uma pasta para salvar os modelos e não perder o download se a internet cair
mkdir -p "$(pwd)/tts_models"

# Executa o contêiner do Coqui TTS, mapeando a pasta atual para /app
docker run --rm \
    -v "$(pwd):/app" \
    -v "$(pwd)/tts_models:/root/.local/share/tts" \
    -e COQUI_TOS_AGREED=1 \
    ghcr.io/coqui-ai/tts:latest \
    --text "$TEXTO" \
    --model_name "tts_models/multilingual/multi-dataset/xtts_v2" \
    --language_idx "pt" \
    "${SPEAKER_ARG[@]}" \
    --out_path "/app/$ARQUIVO_SAIDA"

echo "✅ Concluído! Verifique o arquivo $ARQUIVO_SAIDA"
