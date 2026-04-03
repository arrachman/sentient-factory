---
title: Artefak Query Administrator
sidebar_position: 2
description: Ringkasan artefak query dan JSON index untuk modul administrator MyERPPlus.
---

# Artefak Query Administrator

Halaman ini merangkum artefak teknis untuk `m0-administrator` dari source:

- `apps/myerpplus-db-mapping/db/m0 - administrator`

## Artefak Utama

- `m0-queries.md`
  Fungsi AI Agent: sumber SQL mentah administrator yang paling lengkap, dipakai saat agent perlu melihat pola query, nama tabel, dan placeholder legacy.
- `m0-queries.json`
  Fungsi AI Agent: manifest JSON ringan untuk indexing cepat, validasi coverage, dan pengenalan bahwa domain ini punya `832` query aktif yang sudah dikumpulkan.
- `m0-queries-by-type.md`
  Fungsi AI Agent: pemisahan query per tipe statement agar lebih mudah membedakan query readonly dan write-path.
- `m0-queries-by-type.json`
  Fungsi AI Agent: versi machine-readable dari pembagian tipe query, cocok untuk guardrail agent dan pipeline evaluasi.

## POV AI Agent

Jika dilihat dari sudut pandang agent:

- `m0-queries.md` adalah raw evidence.
- `m0-queries.json` adalah quick index.
- `m0-queries-by-type.md` adalah audit view.
- `m0-queries-by-type.json` adalah guardrail view.

## Ringkasan Cepat

- total query: `832`
- `SELECT`: `626`
- `INSERT`: `79`
- `UPDATE`: `52`
- `DELETE`: `75`

## Kapan Dipakai

- Saat agent perlu memahami area administrator seperti user, role, menu, setting, report, approval, dan logging.
- Saat agent perlu membedakan apakah sebuah pertanyaan user aman dijawab dengan SQL readonly.
- Saat tim ingin membangun semantic schema `m0` di tahap berikutnya.
