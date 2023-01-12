---
tags:
- security
- opsec
---

# The Basics

List all your keys.

```sh
gpg -K
gpg -K --keyid-format=long # Long version shows the key id
```

Create a new key.

```sh
gpg --full-generate-key
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

It is best practice to keep a root signing key in an air-gaped environment and to use it 
to sign additional encryption keys called subkeys.

# References

- [Creating the Perfect GPG KeyPair][1]
- [Subkeys - Debian][2]
- [Creating newer ECC keys for GnuPG][3]

[1]: https://alexcabal.com/creating-the-perfect-gpg-keypair "Creating the Perfect GPG KeyPair"
[2]: https://wiki.debian.org/Subkeys "Subkeys - Debian"
[3]: https://www.gniibe.org/memo/software/gpg/keygen-25519.html "Creating newer ECC keys for GnuPG"
