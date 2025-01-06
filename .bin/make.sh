#!/bin/sh

echo "Informe o nome do projeto:"
read project_name

if [ -d ./$project_name ]; then
  rm -rf ./$project_name
fi

mkdir ./$project_name
mkdir ./$project_name/$project_name
mkdir ./$project_name/$project_name/.docker

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

cat << EOF > ./$project_name/docker-compose.yml
services:
  # Base application
  $project_name:
    build: ./$project_name/.docker
EOF

cat << EOF > ./$project_name/README.md
# $project_name

How to run:

\`\`\`bash
cd ./$project_name && yarn dev
\`\`\`
EOF

yarn init -y --cwd ./$project_name/$project_name

cat << EOF > ./$project_name/$project_name/.docker/Dockerfile
FROM node:22
WORKDIR /app
EXPOSE 3000

COPY . .

CMD ["sh", "-c", "yarn install && yarn dev"]
EOF


echo "Criar frontend com Nuxt3? Se sim, qual o nome da pasta?"
read nuxt3_folder

if [ -n $nuxt3_folder ]; then
  docker_eval="docker run --rm -it -v \$(pwd):/app -w /app node:18 npx nuxi@latest init $nuxt3_folder"
  cat << EOF > ./$project_name/docker-compose.yml

  # $docker_eval
  $nuxt3_folder:
    image: node:22
    working_dir: /app
    command: bash -c "yarn install && yarn dev"
    ports:
      - 3000:3000
    volumes:
      - ./{$nuxt3_folder}:/app
EOF

  cd ./$project_name
  eval $docker_eval
  cd ..
fi

echo "# HowTo" > ./$project_name/README.md

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
