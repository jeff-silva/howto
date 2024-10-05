#!/bin/bash
reset

echo "Informe o nome do projeto:"
read project_name

mkdir $project_name
cd $project_name

cat << EOF > package.json
{
  "name": "$project_name",
  "version": "1.0.0",
  "license": "MIT",
  "scripts": {
    "dev": "docker compose up --build --force-recreate --remove-orphans"
  }
}
EOF

cat << EOF > docker-compose.yml
services:
  # docker run --rm -it -v $(pwd):/app -w /app node:18 npx nuxi@latest init nuxt3
  nuxt3:
    image: node:22
    working_dir: /app
    command: bash -c "yarn install && yarn dev"
    ports:
      - 3000:3000
    volumes:
      - ./nuxt3:/app
EOF
