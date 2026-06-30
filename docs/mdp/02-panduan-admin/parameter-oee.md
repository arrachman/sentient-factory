---
sidebar_position: 1
title: Menyiapkan Parameter OEE
---

# Menyiapkan Parameter OEE

OEE (*Overall Equipment Effectiveness*) adalah **overlay turunan** — tidak punya
tabel sendiri, dihitung dari data MES, kalender kerja, dan QMS. Agar angka OEE
muncul (bukan `—`), admin harus menyiapkan parameter dasarnya. Lihat juga
[Referensi OEE](/mdp/referensi/oee).

## Komponen OEE

```
OEE = Availability × Performance × Quality
```

| Komponen | Sumber data | Yang harus disiapkan admin |
| --- | --- | --- |
| Availability | Waktu rencana vs downtime | **[Work Calendar](/mdp/referensi/master-data#5-work-calendar)** terisi |
| Performance | Output aktual vs kecepatan ideal | **Ideal cycle time** di **[Work Center](/mdp/referensi/master-data#1-work-center)** |
| Quality | Qty baik vs total produksi | Operator mengisi **Production Logs** + NCR di QMS |

## Checklist setup

1. Isi **Work Calendar** (planned operating time) → tanpa ini, Availability `—`.
2. Isi **ideal cycle time** tiap Work Center → tanpa ini, Performance `—`.
3. Definisikan **Shift** dan **Reason Code** (untuk klasifikasi downtime).
4. Pastikan operator rutin mengisi **Production Logs** & **Downtime Events**.

:::tip
Bila kolom OEE menampilkan `—`, footer dashboard OEE menyebutkan penyebabnya:
biasanya kalender kerja atau ideal cycle time work center belum diisi.
:::
