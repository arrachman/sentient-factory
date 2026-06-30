---
sidebar_position: 2
title: Tampilan (Preferensi UI)
---

# Tampilan

Layar **Tampilan** (menu *Laporan & Lainnya → Tampilan*, rute
`/app/settings/appearance`) mengatur preferensi antarmuka per-pengguna. Preferensi
disimpan di **backend** (SSOT) sehingga ikut berpindah perangkat, dengan cermin
`localStorage` agar tidak berkedip saat halaman dimuat.

![Layar pengaturan Tampilan](/img/hr/tampilan.png)

## Bagian pengaturan

| Bagian | Pilihan | Keterangan |
| --- | --- | --- |
| **Tema** | Terang / Gelap | Mode warna seluruh aplikasi. |
| **Bahasa** | Indonesia / English / Japanese | *Catatan:* saat ini hanya string di layar Tampilan yang ter-terjemah. |
| **Warna Aksen** | Paket warna (Korporat/Klasik/Kreatif/Natural) + swatch spesifik | Warna primer UI; default brand **Teal**. |
| **Ukuran Font** | Kecil / Normal / Besar / Ekstra Besar | Skala teks antarmuka, dengan **Pratinjau** langsung. |
| **Layout** | Compact / Comfortable | Kepadatan baris tabel & list. |
| **Menu Sidebar** | Ikon / Ikon + Label; Flyout / Accordion | Bentuk navigasi samping. *Flyout* memunculkan submenu saat hover; *Accordion* meng-expand di bawah modul. |
| **URL Routing** | Internal / Per-halaman URL | Sinkronisasi URL browser dengan tab aktif (kosmetik). |

Tombol **Reset** mengembalikan seluruh knob ke default. Footer menampilkan
ringkasan setelan aktif (mis. *Tema light · Teal · Ukuran base · Comfortable ·
Menu Sidebar Ikon · Flyout · URL Internal*).

:::tip Berlaku seketika
Mengganti Tema, Sidebar, atau Kepadatan langsung diterapkan ke seluruh aplikasi
tanpa perlu memuat ulang halaman.
:::
