---
slug: /referensi/ims
sidebar_position: 9
title: IMS — QHSE Terpadu
---

# IMS — QHSE Terpadu

**IMS** (*Integrated Management System* / QHSE, domain `ehs`) menangani
**Quality–Health–Safety–Environment** terpadu di lantai pabrik: pelaporan
**insiden**, pelaksanaan **audit**, dan penerbitan **izin kerja**
(*permit-to-work*).

Sub-navigasi IMS (grup *QHSE Terpadu*):

| Sub-halaman | Route | Fungsi |
| --- | --- | --- |
| Incidents | `/app/qhse` | Insiden K3/lingkungan |
| Audits | `/app/qhse/audits` | Audit QHSE |
| Permits | `/app/qhse/permits` | Izin kerja (permit-to-work) |

## Incidents

Pelaporan **insiden** K3/lingkungan — kecelakaan, nyaris celaka (*near-miss*),
tumpahan, dll — beserta tingkat keparahan dan tindak lanjut.

![Daftar Incidents](/img/mdp/qhse-incidents.png)

## Audits

Pelaksanaan **audit QHSE** — kapan, ruang lingkup, temuan, dan status.

![Daftar Audits](/img/mdp/qhse-audits.png)

## Permits

**Izin kerja** (*permit-to-work*) untuk pekerjaan berisiko (panas, ruang
terbatas, ketinggian) — masa berlaku, persyaratan, dan persetujuan.

![Daftar Permits](/img/mdp/qhse-permits.png)

## Flow operasional IMS

```
Insiden dilaporkan ──► investigasi ──► tindak lanjut
Audit dijadwalkan  ──► temuan ──► perbaikan
Permit diajukan    ──► disetujui ──► pekerjaan berisiko boleh dimulai
```
