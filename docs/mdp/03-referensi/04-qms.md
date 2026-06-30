---
slug: /referensi/qms
sidebar_position: 5
title: QMS — Kualitas
---

# QMS — Kualitas

**QMS** (*Quality Management System*, domain `qms`) menangani **kontrol
kualitas**: rencana & karakteristik inspeksi, pelaksanaan inspeksi beserta hasil
ukurnya, pencatatan **nonconformance (NCR)**, dan tindakan **CAPA** (*Corrective
and Preventive Action*).

:::note Lingkup
QMS hanya **menandai** kualitas. Disposisi NCR **tidak** otomatis memposting ke
stok atau MES — keputusan disposisi dieksekusi di tempat lain.
:::

Sub-navigasi QMS (grup *Kualitas*):

| Sub-halaman | Route | Fungsi |
| --- | --- | --- |
| Inspection Plans | `/app/quality` | Rencana inspeksi (induk) |
| Characteristics | `/app/quality/characteristics` | Karakteristik yang diukur |
| Inspections | `/app/quality/inspections` | Pelaksanaan inspeksi |
| Results | `/app/quality/results` | Hasil ukur per karakteristik |
| Nonconformances | `/app/quality/nonconformances` | Catatan ketidaksesuaian (NCR) |
| CAPA Actions | `/app/quality/capa-actions` | Tindakan korektif & preventif |

## Inspection Plans

**Rencana inspeksi** — mendefinisikan apa yang harus diperiksa untuk suatu
item/proses. Menjadi induk dari karakteristik.

![Daftar Inspection Plans](/img/mdp/quality.png)

## Characteristics

**Karakteristik** yang diukur dalam sebuah rencana (mis. diameter, berat,
kekerasan) — lengkap dengan batas spesifikasi. Model 6-tabel (plan →
characteristic → inspection → result) dipilih agar **hasil ukur per
karakteristik dapat di-query**.

![Daftar Characteristics](/img/mdp/quality-characteristics.png)

## Inspections

**Pelaksanaan inspeksi** terhadap sebuah lot/order — kapan, oleh siapa, dan
**verdict** akhirnya (lulus/tolak).

![Daftar Inspections](/img/mdp/quality-inspections.png)

## Results

**Hasil ukur** tiap karakteristik untuk sebuah inspeksi. Inilah data granular
yang bisa dianalisis (mis. SPC, capability) di kemudian hari.

![Daftar Results](/img/mdp/quality-results.png)

## Nonconformances (NCR)

Catatan **ketidaksesuaian** yang ditemukan — sumber, deskripsi, dan disposisi.
NCR adalah pemicu CAPA.

![Daftar Nonconformances](/img/mdp/quality-nonconformances.png)

## CAPA Actions

**Tindakan korektif & preventif** yang lahir dari NCR — penanggung jawab,
tenggat, dan status penyelesaian.

![Daftar CAPA Actions](/img/mdp/quality-capa-actions.png)

## Flow operasional QMS

```
Inspection Plan ──► Characteristics (spesifikasi)
      ▼
Inspection (eksekusi) ──► Results (hasil ukur per karakteristik)
      │ verdict tolak
      ▼
Nonconformance (NCR) ──► CAPA Action (korektif & preventif)
```
