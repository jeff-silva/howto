#!/bin/bash

# Validar parâmetros
if [ "$#" -ne 2 ]; then
    echo "Uso: $0 <arquivo_de_entrada.mp3> <arquivo_de_saida.js>"
    exit 1
fi

# Resolver caminhos absolutos para montar corretamente no Docker
INPUT_ABS=$(readlink -f "$1")
OUTPUT_ABS=$(readlink -f "$2")

INPUT_DIR=$(dirname "$INPUT_ABS")
OUTPUT_DIR=$(dirname "$OUTPUT_ABS")
INPUT_BASE=$(basename "$INPUT_ABS")
OUTPUT_BASE=$(basename "$OUTPUT_ABS")

echo "Iniciando ambiente isolado (Docker) para extração de áudio..."

# Roda o container, montando apenas as pastas estritamente necessárias do host
docker run --rm -i \
  -v "$INPUT_DIR:/input_dir" \
  -v "$OUTPUT_DIR:/output_dir" \
  -e INPUT_FILE="/input_dir/$INPUT_BASE" \
  -e OUTPUT_FILE="/output_dir/$OUTPUT_BASE" \
  python:3.10-slim bash << 'EOF'

echo "Baixando processadores de áudio (libsndfile1, ffmpeg)..."
apt-get update -qq && apt-get install -y -qq libsndfile1 ffmpeg > /dev/null

echo "Instalando IA de análise acústica (librosa)..."
pip install -q --default-timeout=1000 librosa

# Script Python encapsulado dentro do próprio bash
python -c '
import librosa
import json
import sys
import os
import re

input_file = os.environ.get("INPUT_FILE")
output_file = os.environ.get("OUTPUT_FILE")

print(f"Analisando frequências: {os.path.basename(input_file)}...")
try:
    y, sr = librosa.load(input_file)
    print("Mapeando batidas (kicks/beats)...")
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)
    
    # Arredondar para 3 casas decimais (milissegundos)
    beats_list = [round(float(t), 3) for t in beat_times]
    
    # Criar nome da variável dinamicamente baseado no arquivo de saída
    # ex: bgm-beats.js -> bgmBeats
    base_name = os.path.basename(output_file).replace(".js", "")
    var_name = re.sub(r"[^a-zA-Z0-9]", " ", base_name).title().replace(" ", "")
    var_name = var_name[0].lower() + var_name[1:] if var_name else "audioBeats"

    js_content = f"const {var_name} = {json.dumps(beats_list)};\n"
    
    with open(output_file, "w") as f:
        f.write(js_content)
        
    print(f"Sucesso! Exportado para {os.path.basename(output_file)} com {len(beats_list)} batidas mapeadas.")
except Exception as e:
    print(f"Erro ao processar o áudio: {e}")
    sys.exit(1)
'
EOF
