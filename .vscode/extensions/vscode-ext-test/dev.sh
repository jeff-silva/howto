#!/bin/bash

CURRENT_DIR=$(basename "$PWD")
EXTENSION_DIR="../.vscode/extensions/$CURRENT_DIR"

if [ -d $EXTENSION_DIR ]; then
  rm -rf $EXTENSION_DIR
fi

mkdir -p $EXTENSION_DIR
cp -r . $EXTENSION_DIR

echo $EXTENSION_DIR