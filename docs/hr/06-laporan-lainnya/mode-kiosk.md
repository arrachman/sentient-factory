---
sidebar_position: 2
title: Mode Kiosk
---

# Mode Kiosk

Rute `/app/kiosk` · grup **Laporan & Lainnya** · *live* · **privileged**.

Mode **perangkat bersama** on-site: satu tablet/PC di lokasi dibuka oleh admin,
lalu karyawan clock-in/out bergantian memakai **PIN** (adaptasi *jibble Kiosk +
PIN*).

![Mode Kiosk](/img/hr/mode-kiosk.png)

## Bagian layar

Dua tab:

### Tab **Kiosk**

- Dropdown **Lokasi Kiosk** — pilih worksite tempat perangkat ditempatkan.
- Area utama menampilkan karyawan yang ber-PIN untuk lokasi tersebut, siap
  clock-in/out via PIN. Bila kosong: *“Belum ada karyawan dengan PIN. Atur di tab
  Kelola PIN.”*

### Tab **Kelola PIN**

Menetapkan **PIN per-karyawan** (disimpan ter-hash). PIN inilah kredensial yang
diketik karyawan di kiosk.

## Alur

1. Buka tab **Kelola PIN**, tetapkan PIN untuk karyawan yang akan memakai kiosk.
2. Kembali ke tab **Kiosk**, pilih **Lokasi Kiosk**.
3. Tinggalkan perangkat di lokasi; karyawan clock-in/out dengan mengetik PIN.

:::info Privileged-only untuk membuka
Hanya admin/manager yang dapat **membuka** mode kiosk; clock via PIN sendiri
dilakukan karyawan biasa pada perangkat tersebut.
:::
