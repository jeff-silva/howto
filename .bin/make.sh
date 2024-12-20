#!/bin/sh

# echo "Informe o nome do projeto:"
# read project_name

# mkdir ./$project_name

# cat << EOF > ./$project_name/package.json
# {
#   "name": "$project_name",
#   "version": "1.0.0",
#   "license": "MIT",
#   "scripts": {
#     "dev": "docker compose up --build --force-recreate --remove-orphans"
#   }
# }
# EOF

# cat << EOF > ./$project_name/docker-compose.yml
# services:
#   # docker run --rm -it -v \$(pwd):/app -w /app node:18 npx nuxi@latest init nuxt3
#   nuxt3:
#     image: node:22
#     working_dir: /app
#     command: bash -c "yarn install && yarn dev"
#     ports:
#       - 3000:3000
#     volumes:
#       - ./nuxt3:/app
# EOF

# cat << EOF > ./$project_name/README.md
# # $project_name

# How to run:

# \`\`\`bash
# cd ./$project_name && yarn dev
# \`\`\`

# EOF

echo "# HowTo" > ./README.md

# Usando find para listar apenas os diretórios
for dir in $(find . -maxdepth 1 -type d); do
  folder=$(basename "$dir")
  folder_readme="./$folder/README.md"

  if [ $folder != "$(basename "$dir" | sed 's/^[.]//')" ]; then
    continue  # Pula para o próximo diretório
  fi

  # if [ -f "$folder_readme" ]; then
  #   readme_content=$(cat "$folder_readme")
  #   printf "%s\n" "$readme_content" >> ./README.md
  # else
  #   echo "\n## $folder" >> ./README.md
  #   echo "\`\`\`bash" >> ./README.md
  #   echo "cd ./$folder && yarn dev" >> ./README.md
  #   echo "\`\`\`" >> ./README.md
  # fi

  echo "\n### [$folder](./$folder)" >> ./README.md
  echo "\`\`\`bash" >> ./README.md
  echo "cd ./$folder && yarn dev" >> ./README.md
  echo "\`\`\`" >> ./README.md

done
