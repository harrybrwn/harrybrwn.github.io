#!/bin/sh

set -eu

rm "node_modules/@astro.hrry.dev/compress"
rm "node_modules/@astro.hrry.dev/new"
rm "node_modules/@astro.hrry.dev/obsidian"
rm "node_modules/@astro.hrry.dev/robots.txt"
rm "node_modules/@astro.hrry.dev/wikilink"
rm "node_modules/@hrry.me/api"

cp -r "packages/astro/compress" "node_modules/@astro.hrry.dev/compress"
cp -r "packages/astro/new" "node_modules/@astro.hrry.dev/new"
cp -r "packages/astro/obsidian" "node_modules/@astro.hrry.dev/obsidian"
cp -r "packages/astro/robots.txt" "node_modules/@astro.hrry.dev/robots.txt"
cp -r "packages/astro/wikilink" "node_modules/@astro.hrry.dev/wikilink"
cp -r "packages/hrry.me/api" "node_modules/@hrry.me/api"
