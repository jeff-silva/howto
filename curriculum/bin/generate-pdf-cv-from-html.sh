#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURRICULUM_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

INPUT_HTML="output/jeferson-silva.html"
OUTPUT_PDF="output/jeferson-silva.pdf"

if [[ ! -f "${CURRICULUM_DIR}/${INPUT_HTML}" ]]; then
  echo "Erro: arquivo não encontrado: ${CURRICULUM_DIR}/${INPUT_HTML}" >&2
  exit 1
fi

docker run --rm \
  -v "${CURRICULUM_DIR}:/data" \
  zenika/alpine-chrome \
  --no-sandbox \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --virtual-time-budget=3000 \
  --print-to-pdf="/data/${OUTPUT_PDF}" \
  "/data/${INPUT_HTML}"

echo "PDF gerado em: ${CURRICULUM_DIR}/${OUTPUT_PDF}"
