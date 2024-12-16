---
title: GPG Notes
pubDate: 2023-01-12T18:21:03.000Z
tags:
- security
- opsec
---

# The Basics

## View Keys

List all your keys.

```sh
gpg -K
gpg -K --keyid-format=long # Long version shows the key id
gpg -K --list-options show-unusable-subkeys # show expired subkeys
```

View info for key that's not in the current keystore. [source](https://unix.stackexchange.com/questions/391344/gnupg-command-to-show-key-info-from-file)
```sh
cat keyfile.key | gpg --import-options show-only --import
gpg --export-secret-subkeys | gpg --import-options show-only --import
```

Create a new key.

```sh
gpg --full-generate-key
```

## Update Expired Keys

```sh
gpg --edit-key <id/name>
> key <subkey id> # select subkey
> expire          # change expiration
> save
```

# Isolation

Gpg has a global configuration directory where all the keys go by default which can
make it hard to manage subkeys.

```sh
mkdir /tmp/gpg
sudo mount -t ramfs -o size=2M ramfs /tmp/gpg
sudo chown "$USER:$USER" /tmp/gpg
gpg --homedir /tmp/gpg --import /path/to/other/keys
gpg --homedir /tmp/gpg --list-secret-keys
```

## Import from External Keystore

```sh
gpg \
  --homedir /media/me/usbdrive/.gnupg \
  --export-secret-subkeys \
  | gpg --import
```

It is best practice to keep a root signing key in an air-gaped environment and to use it
to sign additional encryption keys called subkeys.

# References

- [Creating the Perfect GPG KeyPair][1]
- [Subkeys - Debian][2]
- [Creating newer ECC keys for GnuPG][3]

[1]: https://alexcabal.com/creating-the-perfect-gpg-keypair "Creating the Perfect GPG KeyPair"
[2]: https://wiki.debian.org/Subkeys "Subkeys - Debian"
[3]: https://www.gniibe.org/memo/software/gpg/keygen-25519.html "Creating newer ECC keys for GnuPG"
