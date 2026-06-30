---
sidebar_position: 8
title: Akses & Peran (RBAC)
---

# Akses & Peran (RBAC)

Rute `/app/roles` · grup **Kehadiran** · *live* · **privileged**.

Mendefinisikan **peran HR** dan menetapkannya ke karyawan — adaptasi *jibble
People & Groups*. Mengatur siapa yang boleh membuka layar privileged (tinjauan,
kebijakan, laporan, kiosk).

![Akses & Peran (RBAC)](/img/hr/akses-peran.png)

## Bagian layar

### Tabel peran

| Kolom | Isi |
| --- | --- |
| **Kode** | `HR_ADMIN`, `HR_MANAGER`, `HR_EMPLOYEE`. |
| **Nama** | Label peran. |
| **Deskripsi** | Cakupan akses. |
| **Anggota** | Jumlah karyawan yang menyandang peran. |
| **Sifat** | `Sistem` (bawaan) · aktif/nonaktif. |

Tiga **peran sistem** bawaan (seed):

| Peran | Cakupan |
| --- | --- |
| **HR Admin** | Akses penuh modul HR: kelola karyawan, kebijakan, dan tinjauan. |
| **HR Manager** | Menyetujui kehadiran, cuti, dan timesheet tim. |
| **HR Employee** | Karyawan: clock in/out, ajukan cuti, lihat riwayat sendiri. |

Tombol **+ Tambah Peran** membuat peran kustom; ikon **edit**/**hapus** mengubah
peran (peran sistem umumnya tidak dihapus).

### Penugasan Peran Karyawan

Daftar karyawan dengan tombol **Atur Peran** untuk menetapkan/mencabut peran per
individu.

## Alur

1. (Opsional) buat peran kustom lewat **+ Tambah Peran**.
2. Pada **Penugasan Peran Karyawan**, tekan **Atur Peran** untuk karyawan terkait.
3. Pilih peran; akses ke layar privileged langsung mengikuti.

:::info RBAC bersifat *additive*
Seseorang dianggap **privileged** bila peran platformnya `admin`/`manager` **atau**
memiliki peran `HR_ADMIN`/`HR_MANAGER` di sini. RBAC HR hanya **menambah** akses —
tidak pernah mengunci akses yang sudah dimiliki dari platform.
:::
