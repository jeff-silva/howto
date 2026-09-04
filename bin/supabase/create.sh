#!/bin/bash
# bash -c "$(curl -fsSL https://raw.githubusercontent.com/jeff-silva/howto/refs/heads/main/bin/supabase/create.sh)"

CURRENT_DIR=$(pwd)
echo "Current folder: $CURRENT_DIR"

VALUE_DEFAULT="supabase"
echo -e "\nDefine folder (default: \"$VALUE_DEFAULT\")"
echo "Place: $CURRENT_DIR/$VALUE_DEFAULT";
read -p "New value (empty to keep default): " VALUE
SUPABASE_DIR=${VALUE:-$VALUE_DEFAULT}

# Folders
mkdir -p "$CURRENT_DIR/$SUPABASE_DIR"

# compose.yml
FILENAME="$CURRENT_DIR/$SUPABASE_DIR/compose.yml"
[ -f $FILENAME ] || cat << EOF > $FILENAME
include:
  - path: ./project/docker-compose.yml
    env_file: ./project/.env
EOF

if [ ! -d "$CURRENT_DIR/$SUPABASE_DIR/supabase" ]; then
  echo ""
  docker run --rm -it -v "$CURRENT_DIR/$SUPABASE_DIR":/app -w /app node:20 sh -c "
    npx -y supabase@latest init --yes
    npx -y supabase@latest telemetry disable
  "
fi

if [ ! -d "$CURRENT_DIR/$SUPABASE_DIR/project" ]; then
  echo ""
  mkdir -p "$CURRENT_DIR/$SUPABASE_DIR/project"
  SUPABASE_TMP_DIR="$CURRENT_DIR/$SUPABASE_DIR/supabase-tmp"
  git clone --depth 1 https://github.com/supabase/supabase "$SUPABASE_TMP_DIR"
  cp -rf "$SUPABASE_TMP_DIR/docker/"* "$CURRENT_DIR/$SUPABASE_DIR/project"
  cp "$SUPABASE_TMP_DIR/docker/.env.example" "$CURRENT_DIR/$SUPABASE_DIR/project/.env"
  rm -rf "$SUPABASE_TMP_DIR"

  cd "$CURRENT_DIR/$SUPABASE_DIR/project"
  sh utils/generate-keys.sh
  sh utils/add-new-auth-keys.sh
  rm ./.env.old ./docker-compose.yml.old
fi
