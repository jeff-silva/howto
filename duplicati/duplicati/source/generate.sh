#!/bin/bash

rm -rf ./files
mkdir -p ./files

for i in $(seq 1 10); do
  NOME_ARQUIVO=$(printf "%03d.txt" "$i")
  CAMINHO_ARQUIVO="./files/$NOME_ARQUIVO"
  echo "Arquivo $NOME_ARQUIVO" > "$CAMINHO_ARQUIVO"
done
