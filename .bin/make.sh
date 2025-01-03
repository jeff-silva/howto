#!/bin/sh

echo "Informe o nome do projeto:"
read project_name

if [ -d ./$project_name ]; then
  rm -rf ./$project_name
fi

mkdir ./$project_name
mkdir ./$project_name/$project_name
mkdir ./$project_name/$project_name/.docker

cd ./$project_name

cat << EOF > ./package.json
{
  "name": "$project_name",
  "version": "1.0.0",
  "license": "MIT",
  "scripts": {
    "dev": "docker compose up --build --force-recreate --remove-orphans"
  }
}
EOF

cat << EOF > ./docker-compose.yml
services:
  # Base application
  $project_name:
    build: ./$project_name/.docker

  # Nuxt: to create, run command above.
  # docker run --rm -it -v \$(pwd):/app -w /app node:18 npx nuxi@latest init nuxt3
  nuxt3:
    image: node:22
    working_dir: /app
    command: bash -c "yarn install && yarn dev"
    ports:
      - 3000:3000
    volumes:
      - ./nuxt3:/app
EOF

cat << EOF > ./README.md
# $project_name

How to run:

\`\`\`bash
cd ./$project_name && yarn dev
\`\`\`

EOF

cd ./$project_name

yarn init -y

cat << EOF > ./.docker/Dockerfile
FROM node:22
WORKDIR /app
EXPOSE 3000

COPY . .

CMD ["sh", "-c", "yarn install && yarn start"]
EOF

cd ../..

echo "# HowTo" > ./README.md

# Usando find para listar apenas os diretórios
for dir in $(find . -maxdepth 1 -type d); do
  folder=$(basename "$dir")
  folder_readme="./$folder/README.md"

  if [ $folder != "$(basename "$dir" | sed 's/^[.]//')" ]; then
    continue  # Pula para o próximo diretório
  fi

  echo "\n### [$folder](./$folder)" >> ./README.md
  echo "\`\`\`bash" >> ./README.md
  echo "cd ./$folder && yarn dev" >> ./README.md
  echo "\`\`\`" >> ./README.md
done
