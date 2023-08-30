#!/usr/bin/bash

set -eu

mkdir -p ./public/static/img/bookmarks

for u in $(yq -r -o json '.links[] | .url' src/bookmarks.yml); do
  file="$(
    printf '%s' "$u" \
    | sed -E \
      -e 's/^https?\:\/\///g;' \
      -e 's/\/$//g;' \
      -e 's/\//-/g;'
  )"
  delay=2
  if [ "$file" = "www.my70stv.com" ]; then
    delay=4
  fi
  filename="public/static/img/bookmarks/$file.png"
  if [ ! -f "$filename" ]; then
    echo "capturing '$u'"
    capture-website \
      --output="$filename" \
      --delay=$delay \
      --timeout=120  \
      --type=png "$u" || true
  else
    echo "skipping '$u'"
  fi
done
