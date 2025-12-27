#!/bin/sh

echo "Informe o nome do projeto:"
read project_name

mkdir -p ./$project_name/$project_name

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
  $project_name:
    image: node:22
EOF

cat << EOF > ./$project_name/README.md
# $project_name

How to run:

\`\`\`bash
cd ./$project_name && yarn dev
\`\`\`
EOF

cd ./$project_name
