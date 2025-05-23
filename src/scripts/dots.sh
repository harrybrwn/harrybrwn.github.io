#!/bin/sh

set -eu

if ! command -v wget 2>&1 >/dev/null && ! command -v curl 2>&1 >/dev/null; then
	echo 'Error: neither "wget" or "curl" found. Please install one.'
	exit 1
fi
if ! command -v python3 2>&1 >/dev/null; then
	echo 'Error: "python3" not found'
	exit 1
fi

# get [url]
get() {
	command -v wget 2>&1 > /dev/null \
		&& wget -O- "$@" 2>/dev/null \
		|| curl -sSLf "$@"
}

# download [filename] [url]
download() {
	command -v wget 2>&1 > /dev/null \
		&& wget -O "$1" "$2" \
		|| curl -sSLf "$2" -o "$1"
}

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

release_blob="$(get https://api.github.com/repos/harrybrwn/dots/releases/latest)"
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
		download "$TMP/dots.tar.zst" "${dl_url}/dots_${version}_linux_${arch}.pkg.tar.zst"
		pacman -U --noconfirm "$TMP/dots.tar.zst"
		;;
	debian|ubuntu|pop|linuxmint|raspbian)
		download "$TMP/dots.deb" "${dl_url}/dots_${version}_linux_${arch}.deb"
		apt install -f "$TMP/dots.deb"
		;;
	alpine)
		download "$TMP/dots.apk" "${dl_url}/dots_${version}_linux_${arch}.apk"
		apk add --allow-untrusted "$TMP/dots.apk"
		;;
	fedora|rocky)
		download "$TMP/dots.rpm" "${dl_url}/dots_${version}_linux_${arch}.rpm"
		dnf install "$TMP/dots.rpm"
		;;
	rhel|centos)
		download "$TMP/dots.rpm" "${dl_url}/dots_${version}_linux_${arch}.rpm"
		rpm -i "$TMP/dots.rpm"
		;;
	*)
		# TODO check ID_LIKE
		echo 'Error: unknown os-release ID'
		exit 1
		;;
esac
