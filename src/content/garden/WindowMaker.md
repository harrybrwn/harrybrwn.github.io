---
title: Window Maker
slug: window-maker
description: Notes for installing the Window Maker desktop.
tags:
- linux
- hobbies
draft: false
pubDate: 2025-02-21T19:49:31-08:00
---

Window Maker is a retro window manager for linux.

# Install

I'm assuming this is a **very** minimal fresh linux install (I usually start
with debain on a tty).

```sh
sudo apt install xorg
sudo apt install wmaker
startx
```

## ly login manager (optional)

I like [ly](https://github.com/fairyglade/ly) but you can use gdm, lightdm, sddm or whatever you preference is
(or nothing at all)

```sh
git clone https://github.com/fairyglade/ly
cd ly
zig build
sudo zig build installsystemd
sudo systemctl enable ly.service
sudo systemctl reboot # Or logout but i'm not really sure... I just rebooted
```

# Touch Pad Setup

Make sure the correct driver is installed.
```sh
sudo dpkg -s xserver-xorg-input-libinput
```

Create a file `/etc/X11/xorg.conf.d/40-libinput.conf`

```
Section "InputClass"
        Identifier "libinput touchpad catchall"
        MatchIsTouchpad "on"
        MatchDevicePath "/dev/input/event*"
        Driver "libinput"
        Option "Tapping" "on"
        # https://askubuntu.com/questions/819662
        Option "NaturalScrolling" "true"
EndSection
```

Restart X.
