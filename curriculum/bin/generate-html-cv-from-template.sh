#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURRICULUM_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

INPUT_JSON="${1:-output/jeferson-silva.json}"
TEMPLATE_FILE="templates/curriculum.html.tmpl"
OUTPUT_HTML="output/jeferson-silva.html"

if [[ ! -f "${CURRICULUM_DIR}/${INPUT_JSON}" ]]; then
  echo "Erro: arquivo não encontrado: ${CURRICULUM_DIR}/${INPUT_JSON}" >&2
  exit 1
fi

if [[ ! -f "${CURRICULUM_DIR}/${TEMPLATE_FILE}" ]]; then
  echo "Erro: template não encontrado: ${CURRICULUM_DIR}/${TEMPLATE_FILE}" >&2
  exit 1
fi

docker run --rm \
  -v "${CURRICULUM_DIR}:/data" \
  hairyhenderson/gomplate:alpine \
  -d "resume=/data/${INPUT_JSON}" \
  -f "/data/${TEMPLATE_FILE}" \
  -o "/data/${OUTPUT_HTML}"

echo "HTML gerado em: ${CURRICULUM_DIR}/${OUTPUT_HTML}"
