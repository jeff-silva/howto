#!/bin/sh

echo "Informe o nome do projeto:"
read project_name

mkdir -p ./$project_name/$project_name/app

cat << EOF > ./$project_name/package.json
{
  "name": "$project_name",
  "version": "1.0.0",
  "license": "MIT",
  "scripts": {
    "dev": "docker compose up --build --force-recreate --remove-orphans"
  }
}
EOF

cat << EOF > ./$project_name/compose.yml
services:
  # Base application
  $project_name:
    build: ./$project_name/
EOF

cat << EOF > ./$project_name/README.md
# $project_name

How to run:

\`\`\`bash
cd ./$project_name && yarn dev
\`\`\`
EOF

yarn init -y --cwd ./$project_name/$project_name

cat << EOF > ./$project_name/$project_name/Dockerfile
FROM node:22
WORKDIR /app
EXPOSE 3000

COPY . .

CMD ["sh", "-c", "yarn install && yarn dev"]
EOF

# echo "# HowTo" > ./$project_name/README.md

# # Usando find para listar apenas os diretórios
# for dir in $(find . -maxdepth 1 -type d); do
#   folder=$(basename "$dir")
#   folder_readme="./$folder/README.md"

#   if [ $folder != "$(basename "$dir" | sed 's/^[.]//')" ]; then
#     continue  # Pula para o próximo diretório
#   fi

#   echo "\n### [$folder](./$folder)" >> ./README.md
#   echo "\`\`\`bash" >> ./README.md
#   echo "cd ./$folder && yarn dev" >> ./README.md
#   echo "\`\`\`" >> ./README.md
# done
