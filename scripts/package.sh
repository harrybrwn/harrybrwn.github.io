#!/bin/sh

set -eu

zip=dist.zip
tarball=harrybrwn.github.io.tar.gz

rm -f "$tarball" "$zip"
pnpm build

tar \
	-czf "$tarball" \
	--transform 's/dist/hrry.me/' \
	./dist/
(cd dist && zip -r "../$zip" .)