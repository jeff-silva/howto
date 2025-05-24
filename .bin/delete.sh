#!/bin/sh

echo "Informe o nome do projeto:"
read project_name

if [ -d ./$project_name ]; then
  rm -rf ./$project_name
  echo "Projeto removido"
fi
