#!/usr/bin/bash

set -eu

TEST=false
while [ $# -gt 0 ]; do
  case $1 in
    --test)
      TEST=true
      shift
      ;;
    --help)
      echo "generate-screenshots.sh"
      echo
      echo "Flags"
      echo "  --test"
      echo "  --help"
      exit 0
      ;;
  esac
done

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
  if $TEST; then
    echo "site: $file"
    continue
  fi
  if [ ! -f "$filename" ]; then
    echo "capturing '$u'"
    npx capture-website \
      --output="$filename" \
      --delay=$delay \
      --timeout=120  \
      --type=png "$u" || true
  else
    echo "skipping '$u'"
  fi
done
