---
title: My xfce Setup Guide
description: My notes on setting up xfce4 for a minimal debian 12 install.
tags:
- linux
- hobbies
pubDate: 2025-02-24T18:57:53-08:00
modDate: 2025-02-24T20:39:09-08:00
---

# Packages

- [xfce goodies](https://goodies.xfce.org/)

```
sudo apt update
sudo apt install xorg
sudo apt install --no-install-recommends xfce4
sudo apt install \
    dbus-x11 \
    pulseaudio \
    pavucontrol \
    xfce4-notifyd \
    xfce4-power-manager \
    xfce4-battery-plugin \
    xfce4-whiskermenu-plugin \
    xfce4-panel-profiles \
    xfce4-screensaver \
    xfce4-screenshooter \
    thunar-volman \
    network-manager-gnome \
    lightdm \
    blueman
```

# Chigago95

```sh
git clone https://github.com/grassmunk/Chicago95.git
sudo cp -r Chicago95/Theme/Chicago95 /usr/share/themes/
sudo cp -r Chicago95/Icons/* /usr/share/icons/
sudo cp -r Chicago95/Cursors/* /usr/share/icons/
sudo cp -v Chicago95/Fonts/vga_font/LessPerfectDOSVGA.ttf /usr/share/fonts/
sudo fc-cache -f
sudo cp -r Chicago95/Plymouth/Chicago95 /usr/share/plymouth/themes/
sudo cp -r Chicago95/Plymouth/RetroTux /usr/share/plymouth/themes/
sudo update-alternatives --install /usr/share/plymouth/themes/default.plymouth default.plymouth /usr/share/plymouth/themes/Chicago95/Chicago95.plymouth 100
sudo update-alternatives --config default.plymouth
sudo update-initramfs -u
```

In `/etc/lightdm/lightdm-gtk-greeter.com` go to the `[greeter]` section and add
this.

```
theme-name=Chicago95
theme-icon-name=Chicago95
```

(Optional) Download Fonts: <https://github.com/taveevut/Windows-10-Fonts-Default>

```sh
xfconf-query -c xfwm4 -p '/general/theme' -s 'Chicago95'
xfconf-query -c xfce4-notifyd -p 'theme' -s 'Chicago95'
xfconf-query -c xsettings -p '/Net/IconThemeName' -s 'Chicago95'
xfconf-query -c xsettings -p '/Net/SoundThemeName' -s 'Chicago95'
xfconf-query -c xsettings -p '/Net/ThemeName' -s 'Chicago95'
xfconf-query -c xsettings -p '/Gtk/CursorThemeName' -s 'Chicago95 Standard Cursors'
```

Reboot.

# Network

NetworkManager is my favorite so I'm adding this guide here.

```sh
sudo apt install network-manager
# comment out entry in /etc/network/interfaces
sudo systemctl disable --now networking.service
sudo systemctl enable --now NetworkManager.service
nmcli device wifi connect '<ssid>' password '<password>'
```

# Settings

Keyboard shortcuts:
```sh
xfconf-query -c xfce4-keyboard-shortcuts --create --property '/commands/custom/<Super>a' --type string --set xfce4-popup-whiskermenu
xfconf-query -c xfce4-keyboard-shortcuts --create --property '/xfwm4/custom/<Super>d' --type string --set 'show_desktop_key'
xfconf-query -c xfce4-keyboard-shortcuts --create --property '/commands/custom/<Super>s' --type string --set 'xfce4-settings-manager'
xfconf-query -c xfce4-keyboard-shortcuts --create --property '/xfwm4/custom/<Super>Up' --type string --set 'maximize_window_key'
```

Keyboard delay:
```sh
xfconf-query -c keyboards -p '/Default/KeyRepeat/Delay' --set 300
xfconf-query -c keyboards -p '/Default/KeyRepeat/Rate' --set 80
```
