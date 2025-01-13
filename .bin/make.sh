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


echo "Instalar Nuxt3? Se sim, informar nome da pasta:"
read nuxt3_folder

if [ -n "$nuxt3_folder" ]; then
  cd ./$project_name
  export nuxt3_folder="$nuxt3_folder"
  sh ../.bin/nuxt-install.sh
  cd ..

  cat << EOF >> ./$project_name/docker-compose.yml

  # bash <(curl -s "https://raw.githubusercontent.com/jeff-silva/howto/refs/heads/main/.bin/nuxt-install.sh")
  $nuxt3_folder:
    image: node:22
    working_dir: /app
    command: bash -c "yarn install && yarn dev"
    ports:
      - 3000:3000
    volumes:
      - ./$nuxt3_folder:/app
EOF
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
