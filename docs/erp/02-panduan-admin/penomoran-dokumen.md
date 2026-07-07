---
sidebar_position: 1
title: Penomoran Dokumen
---

# Penomoran Dokumen

Admin mengatur format dan urutan nomor untuk tiap jenis dokumen (PO, faktur,
jurnal, dll).

## Langkah

1. Buka **Administrator → Initial Setup → Document Numbering**.
2. Pilih jenis dokumen yang ingin dikonfigurasi.
3. Tentukan pola: prefix, tahun/bulan, dan panjang nomor urut.
4. Tetapkan titik reset urutan (harian/bulanan/tahunan).
5. Simpan. Dokumen baru memakai format ini.

![Konfigurasi penomoran dokumen](/img/erp/adm-document-numbering.png)

## Contoh pola

`PO-{YYYY}{MM}-{0000}` → `PO-202606-0001`

:::tip
Nomor dihasilkan otomatis saat dokumen baru dibuat. Mengubah pola hanya
memengaruhi dokumen **berikutnya**, bukan yang sudah terbit. Lihat juga
**[Referensi → Administrator](/referensi/administrator)**.
:::
