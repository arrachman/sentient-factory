---
slug: /referensi/dms
sidebar_position: 8
title: DMS — Dokumen
---

# DMS — Dokumen

**DMS** (*Document Management System*, domain `dms`) mengelola **dokumen
terkontrol** lantai produksi — SOP, instruksi kerja, gambar teknik — beserta
**revisi** dan **acknowledgement** (bukti bahwa operator telah membaca versi
terbaru).

Sub-navigasi DMS (grup *Dokumen*):

| Sub-halaman | Route | Fungsi |
| --- | --- | --- |
| Documents | `/app/documents` | Dokumen terkontrol (induk) |
| Revisions | `/app/documents/revisions` | Riwayat revisi per dokumen |
| Acknowledgements | `/app/documents/acknowledgements` | Bukti baca per pengguna |

## Documents

Daftar **dokumen terkontrol** — kode, judul, kategori, dan revisi aktif.

![Daftar Documents](/img/mdp/documents.png)

## Revisions

**Riwayat revisi** sebuah dokumen. Tiap perubahan menghasilkan revisi baru
sehingga versi lama tetap terlacak (audit trail).

![Daftar Revisions](/img/mdp/documents-revisions.png)

## Acknowledgements

**Bukti acknowledgement** — catatan bahwa seorang pengguna telah membaca dan
memahami revisi dokumen tertentu. Penting untuk kepatuhan (compliance).

![Daftar Acknowledgements](/img/mdp/documents-acknowledgements.png)

## Flow operasional DMS

```
Document ──► Revision (versi baru) ──► distribusi
                                          ▼
                       Acknowledgement (operator membaca & paham)
```
