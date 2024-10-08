#!/bin/sh

set -eu

export ASTRO_OUTPUT=server
astro build

dest=dist/server/index.d.ts
cp ./src/@types/server-middleware.d.ts "$dest"
sed -ri 's/(\.\.\/){2}dist/\./g' "$dest"

pnpm run -C packages/hrry.me/server build
