---
title: Mikrotik
description: Collection of notes for running a Mikrotik Router
pubDate: 2025-02-19T21:22:49-08:00
tags:
- security
- homelab
---

# SSH

Generate a key, which must be RSA (I prefer `ed25519` but it's not supported so
make the key size large)

```
ssh-keygen -t rsa -b 4096 -f ~/.ssh/mikrotik
```

Copy the *public key* to the router.

```
scp ~/.ssh/mikrotik.pub admin@192.168.88.1:/mikrotik.pub
ssh \
  admin@192.168.88.1 \
  '/user ssh-keys import user=admin public-key-file=/mikrotik.pub
```

In `~/.ssh/config` configure the `PubkeyAcceptedAlgorithms` setting to make your client will do RSA.

```
Host router.lan
    Hostname 192.168.88.1
    IdentityFile ~/.ssh/mikrotik.pub
    PubkeyAcceptedAlgorithms +ssh-rsa
```

# Firewall

...
