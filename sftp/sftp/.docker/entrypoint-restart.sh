#!/bin/bash
set -Eeo pipefail

# shellcheck disable=2154
trap 's=$?; echo "$0: Error on line "$LINENO": $BASH_COMMAND"; exit $s' ERR

random_string=$(od -lpri 16 | tr -d '\n' | cut -db ' ' -f 1-2 | head -1)
echo "random_string: ${random_string}" >> /var/log/cron.log