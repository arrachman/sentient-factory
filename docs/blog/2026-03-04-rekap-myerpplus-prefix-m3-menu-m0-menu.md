---
slug: rekap-myerpplus-prefix-m3-menu-m0-menu
title: Rekap Prefix m3_ di MyERPPlus Berdasarkan m0_menu
authors: [yangshun]
tags: [myerpplus, database, mapping, warehouse]
---

Dokumen ini merangkum arti prefix `m3_*` di schema `myerpplus` berdasarkan data menu pada tabel `m0_menu`.

## Scope

- Sumber mapping nama modul: tabel `m0_menu` (`mnname`, `mnurl`)
- Sumber daftar tabel teknis: `information_schema.tables` untuk `TABLE_NAME LIKE 'm3_%'`

## Hasil Utama

Prefix `m3_` yang Anda sebutkan memang sesuai menu berikut:

- `m3_ts` = Mutasi Barang (TS)
- `m3_sp` = Stok Opname (SP)
- `m3_sa` = Transaksi Barang (SA)
- `m3_dc` = Time Sheet / Daily Check (DC)
- `m3_ib` = Saldo Awal Barang (IB)

## Bukti dari m0_menu

Contoh pasangan `mnname` dan `mnurl` yang ditemukan:

- `Mutasi Barang (TS)` -> `mod/m3/m3_TransaksiTS.swf`
- `Stok Opname (SP)` -> `mod/m3/m3_TransaksiSP.swf`
- `Transaksi Barang (SA)` -> `mod/m3/m3_TransaksiSA.swf`
- `Time Sheet/Daily Check (DC)` -> `mod/m3/m3_TransaksiDC.swf`
- `Saldo Awal Barang (IB)` -> `mod/m3/m3_TransaksiIB.swf`

Selain itu, ada juga:

- `m3_mr` = Permintaan Barang (MR)
- `m3_rs` = Terima Mutasi (RS)
- `m3_pa` = Set Harga Jual (PA)
- `m3_rf` = Pengisian Bahan Bakar (RF)
- `m3_rw` = Receipt Weigher (RW)

## Daftar Prefix m3_ yang Ada di DB

Daftar prefix yang terdeteksi dari objek `m3_*`:

- `dc`
- `files`
- `ib`
- `mr`
- `notes`
- `pa`
- `rf`
- `rs`
- `rw`
- `sa`
- `sp`
- `ts`

## Ringkasan Objek m3_ di Schema myerpplus

- Total objek `m3_*`: **77**
- `BASE TABLE`: **44**
- `VIEW`: **33**

## Kepastian Lokasi Blog dan Infra

Posting ini ditaruh di:

- `docs/blog/2026-03-04-rekap-myerpplus-prefix-m3-menu-m0-menu.md`

Dan memang ini source yang dipakai website:

- Docusaurus config memakai `baseUrl: /docs/` di `docs/docusaurus.config.ts`
- Service `sentient-infra-docs` me-mount folder `../docs:/app` di `infra/docker-compose.yml`
- URL publik blog: `https://sentient.fr-labs.my.id/docs/blog`
