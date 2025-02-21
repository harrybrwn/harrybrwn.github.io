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
- [Getting Started: MikroTik Firewall](https://www.youtube.com/watch?v=6boYA7xdjZY)

## Filter

The firewall filters are a list of commands executed in order that describe how
to handle packets in the firewall.

Filter Concepts:

1. [Chains](#chains)
2. [Actions](#actions)
3. [Other Filter Options...](#other-filter-options)

### Chains

Chains describe the logical flow that the router uses to handle specific types
of packets.

| chain     | description |
| ---       | --- |
| `input`   | handles packets going **into** the router |
| `output`  | handles packets going **out** of the router (originating from router) |
| `forward` | handles packets going **through** the router |

### Actions

The action tells a filter what do do with a packet at the current filter step.

| action                    | description                           |
| ---                       | ---                                   |
| `reject`                  | Respond with a reject "error message" |
| `drop`                    | Silently drop the packet. Clients will assume router is unreachable. |
| `accept`                  | Accept the packet |
| `fasttrack connection`    | Skip all next firewall rules and push packet out quickely. |
| `passthrough`             | ... |
| `return`                  | ... |
| `tarpit`                  | ... |
| `jump`                    | ... |
| `log`                     | ... |
| `add dst to address list` | ... |
| `add src to address list` | ... |

### Other Filter Options

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
