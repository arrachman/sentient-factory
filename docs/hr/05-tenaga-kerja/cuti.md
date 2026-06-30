---
sidebar_position: 3
title: Cuti
---

# Cuti

Rute `/app/leave` · grup **Manajemen Tenaga Kerja** · *live* · kode layar `LVE`.

Pengajuan dan persetujuan **cuti/izin** — adaptasi *jibble Time Off*. Karyawan
mengajukan; supervisor menyetujui.

![Cuti](/img/hr/cuti.png)

## Bagian layar

- **Filter status** — *Menunggu* / disetujui / ditolak.
- **Refresh** dan tombol **+ Ajukan Cuti**.
- **Penghitung** *Pengajuan · N baris*.

### Daftar pengajuan

Setiap baris menampilkan karyawan, jenis & rentang cuti, dan status. Supervisor
dapat menyetujui/menolak pengajuan berstatus *Menunggu*.

## Alur pengajuan (karyawan)

1. Tekan **+ Ajukan Cuti**.
2. Isi **jenis cuti**, **tanggal mulai–selesai**, dan **alasan**.
3. Kirim — pengajuan masuk antrian dengan status **Menunggu**.

## Alur persetujuan (supervisor)

1. Filter status **Menunggu**.
2. Tinjau pengajuan, lalu **setujui** atau **tolak**.
3. Cuti yang disetujui ikut dalam rekap di
   [Laporan → Rekap Cuti](/hr/laporan-lainnya/laporan).

:::note Kosong itu normal
*“Tidak ada pengajuan untuk status ini.”* berarti belum ada pengajuan pada filter
status terpilih.
:::
