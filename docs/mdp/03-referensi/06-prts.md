---
slug: /referensi/prts
sidebar_position: 7
title: PRTS — Problem & Tracking
---

# PRTS — Problem & Tracking

**PRTS** (*Problem Reporting & Tracking System*, domain `prt`) adalah sistem
**Andon** lantai pabrik: menangkap masalah/anomali yang muncul saat produksi dan
menelusurinya sampai tuntas, termasuk **eskalasi** bila tak tertangani dalam
batas waktu.

Sub-navigasi PRTS (grup *Problem & Tracking*):

| Sub-halaman | Route | Fungsi |
| --- | --- | --- |
| Issues | `/app/problems` | Masalah/anomali yang dilaporkan |
| Escalations | `/app/problems/escalations` | Eskalasi issue yang tertahan |

## Issues

Daftar **masalah** yang ditangkap operator (mesin macet, material kurang, defect
beruntun, dll) — kategori, prioritas, penanggung jawab, dan status penyelesaian.

![Daftar Issues (Andon)](/img/mdp/problems-issues.png)

## Escalations

**Eskalasi** untuk issue yang melewati batas waktu/SLA — naik ke level
penanggung jawab berikutnya agar masalah kritis tidak terabaikan.

![Daftar Escalations](/img/mdp/problems-escalations.png)

## Flow operasional PRTS

```
Operator menemukan masalah
      ▼
Issue (Andon) ──assign──► penanganan ──resolve──► selesai
      │ lewat SLA / tak tertangani
      ▼
Escalation ──► naik level penanggung jawab
```
