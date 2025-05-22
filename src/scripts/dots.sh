#!/bin/sh

set -eu

if ! command -v wget 2>&1 >/dev/null; then
	echo 'Error: "wget" not found'
	exit 1
fi
if ! command -v python3 2>&1 >/dev/null; then
	echo 'Error: "python3" not found'
	exit 1
fi

machine="$(uname -m)"
case "$machine" in
	x86_64)
		arch="amd64"
		;;
	aarch64)
		arch="arm64"
		;;
	armv7*)
		arch="armv7"
		;;
	armv6*)
		arch="armv6"
		;;
	*)
		echo "Error: Unknown cpu architecture"
		exit 1
		;;
esac

release_blob="$(wget -O- https://api.github.com/repos/harrybrwn/dots/releases/latest 2>/dev/null)"
tag="$(
	printf "%s" "$release_blob" \
	| python3 -c 'import sys,json; print(json.loads(sys.stdin.read())["tag_name"],end="")'
)"
version="$(echo "$tag" | tr -d '^v')"
dl_url="https://github.com/harrybrwn/dots/releases/download/${tag}"
TMP="$(mktemp -d)"

. /etc/os-release

case "$ID" in
	arch|manjaro)
		wget -O "$TMP/dots.tar.zst" "${dl_url}/dots_${version}_linux_${arch}.pkg.tar.zst"
		pacman -U --noconfirm "$TMP/dots.tar.zst"
		;;
	debian|ubuntu|pop|linuxmint|raspbian)
		wget -O "$TMP/dots.deb" "${dl_url}/dots_${version}_linux_${arch}.deb"
		dpkg --install "$TMP/dots.deb"
		;;
	alpine)
		wget -O "$TMP/dots.apk" "${dl_url}/dots_${version}_linux_${arch}.apk"
		apk add --allow-untrusted "$TMP/dots.apk"
		;;
	rhel|fedora|rocky|centos)
		wget -O "$TMP/dots.rpm" "${dl_url}/dots_${version}_linux_${arch}.rpm"
		rpm -i "$TMP/dots.rpm"
		;;
	*)
		# TODO check ID_LIKE
		echo 'Error: unknown os-release ID'
		exit 1
		;;
esac
