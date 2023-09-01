#!/bin/sh

set -eu

for f in .netlify/functions-internal/*; do
  base="$(basename $f)"
  if echo "$base" | grep -qE '^manifest\.'; then
    #new_name="$(echo "$base" | sed -Ee 's/\./_/;')" # replace first match of '.'
    new_name="$(echo "$base" | perl -pe 's/^manifest\./manifest_/')"
    echo "Renaming '$base' to '$new_name'"
    mv ".netlify/functions-internal/$base" ".netlify/functions-internal/${new_name}"
  fi
done
