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

```sh
ssh-keygen -t rsa -b 4096 -f ~/.ssh/mikrotik
```

Copy the *public key* to the router.

```sh
scp ~/.ssh/mikrotik.pub admin@192.168.88.1:/mikrotik.pub
ssh \
  admin@192.168.88.1 \
  '/user ssh-keys import user=admin public-key-file=/mikrotik.pub
```

In `~/.ssh/config` configure the `PubkeyAcceptedAlgorithms` setting to make your client will do RSA.

```ssh_config
Host router.lan
    Hostname 192.168.88.1
    IdentityFile ~/.ssh/mikrotik.pub
    PubkeyAcceptedAlgorithms +ssh-rsa
```

# Firewall

## References
- [Securing your router](https://help.mikrotik.com/docs/spaces/ROS/pages/328353/Securing+your+router)
- [Building an Advanced Firewall](https://help.mikrotik.com/docs/spaces/ROS/pages/328513/Building+Advanced+Firewall)

...

# Scripting

## Idempotent Updates

Update if entry was not found.
```mikrotik
:put [/ip firewall address-list find where list=cloudflare address=131.0.72.0/22]

:if ([:len [/ip firewall address-list find where list=dns address=1.1.1.1]]=0) do={
  /ip firewall address-list add list=dns address=1.1.1.1 comment="Cloudflare dns"
}
```

Check for a single entry.
```mikrotik
:put [/ip firewall address-list get [find where list=cloudflare address=131.0.72.0/22]]

:if ([/ip firewall address-list get [find where list=cloudflare address=131.0.72.0/22]]) do={
  :put "yes i found it"
}
```
