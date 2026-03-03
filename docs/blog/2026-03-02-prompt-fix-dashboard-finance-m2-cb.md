---
slug: prompt-fix-dashboard-finance-m2-cb
title: Prompt Fix Dashboard Finance m2_cb (Saldo Awal COA)
description: Prompt siap pakai untuk memperbaiki dashboard /app/dashboard/finance/m2_cb agar menampilkan widget, chart, dan AI insight sesuai konteks Saldo Awal COA.
authors: [slorber]
tags: [prompt, ai, engineering]
---

Jika halaman `/app/dashboard/finance/m2_cb` masih menampilkan konten generik, pakai prompt ini agar implementasi langsung terarah ke konteks Saldo Awal COA.

<!-- truncate -->

## Prompt Utama (Dengan Mapping Wajib)

```txt
Kamu adalah senior full-stack engineer di project ini. Tolong FIX halaman dashboard finance untuk route:

- URL: /app/dashboard/finance/m2_cb
- Sumber menu: m0_menu
- Menu code: m2_cb
- Konteks bisnis: Saldo Awal COA (Chart of Accounts Opening Balance)

========================================
TARGET
========================================
Halaman /finance/m2_cb wajib menampilkan konten khusus Saldo Awal COA:
1) Widget KPI
2) Chart
3) AI Insight

Konten generik/non-kontekstual harus diganti.

========================================
MAPPING WAJIB (HARUS ADA)
========================================

A. Menu -> Route -> Page Component
Pastikan mapping berikut ada dan aktif:

- m0_menu.code: "m2_cb"
- route.path: "/app/dashboard/finance/m2_cb"
- route.name/key: "finance.m2_cb" (atau mengikuti naming convention existing)
- component: "FinanceOpeningBalanceDashboardPage" (buat jika belum ada)

Jika project pakai registry map:
- dashboardPageMap["m2_cb"] = FinanceOpeningBalanceDashboardPage
- aiInsightContextMap["m2_cb"] = "opening_balance_coa"
- chartPresetMap["m2_cb"] = "opening_balance_coa"

B. Data Source Mapping (domain Saldo Awal COA)
Gunakan source data existing (API/store/service) dan map ke model ini:

OpeningBalanceCOARow:
- coa_id
- coa_code
- coa_name
- category / group
- normal_balance (debit|credit)
- opening_debit
- opening_credit
- opening_balance_signed (opsional, hasil normalisasi)
- is_filled (boolean; true jika ada nilai saldo awal)

Derived aggregates:
- total_accounts
- total_opening_debit
- total_opening_credit
- total_opening_net (sesuai aturan akuntansi existing)
- filled_accounts
- unfilled_accounts
- completion_rate
- debit_credit_gap

C. KPI Widget Mapping
Render minimal 4 widget ini (wajib):
1. Total Akun COA                -> total_accounts
2. Total Saldo Awal              -> total_opening_net (atau debit-credit sesuai rule existing)
3. Akun Sudah Isi Saldo Awal     -> filled_accounts
4. Akun Belum Isi Saldo Awal     -> unfilled_accounts

Tambahan (jika tersedia):
5. Selisih Debit vs Kredit       -> debit_credit_gap
6. Persentase Kelengkapan        -> completion_rate

D. Chart Mapping
Minimal 2 chart wajib:

1) Distribusi Saldo per Kategori Akun
- type: bar/pie
- x/label: category
- y/value: sum(opening_balance_signed) atau debit/credit split

2) Top N Akun dengan Saldo Awal Terbesar
- type: horizontal bar
- label: coa_code + coa_name
- value: abs(opening_balance_signed) atau nilai saldo awal sesuai rule

Opsional:
3) Komposisi Debit vs Kredit
- type: donut
- values: total_opening_debit vs total_opening_credit

E. AI Insight Mapping (context-specific)
Context key:
- "opening_balance_coa"

Input ke generator insight:
- total_accounts
- filled_accounts
- unfilled_accounts
- completion_rate
- debit_credit_gap
- top_accounts_by_balance
- missing_critical_accounts (jika ada rule akun wajib)
- category_distribution

Output insight (minimal):
- summary (1 paragraf)
- key_findings (3-5 poin)
- anomalies (outlier, akun penting kosong, imbalance)
- recommendations (aksi yang bisa dilakukan user)

Jika data kosong:
- tampilkan empty-state insight yang jelas + CTA (contoh: “Lengkapi saldo awal COA terlebih dahulu”).

========================================
IMPLEMENTATION TASK
========================================

1) Analisis existing
- Telusuri m0_menu -> m2_cb -> router -> page renderer -> data service.
- Identifikasi kenapa sekarang masih render konten generik.

2) Implement route-level specialization
- Pastikan m2_cb mengarah ke page/component khusus Saldo Awal COA.
- Jangan ubah behavior menu code lain.

3) Implement data adapter
- Buat adapter/selector untuk mapping raw data ke OpeningBalanceCOARow + aggregates.
- Hindari hardcode angka final.

4) Implement UI section
- KPI widget section
- Chart section
- AI insight section
- Lengkapi loading/error/empty state.

5) Verification
- Lint/test/build harus lolos.
- Manual check URL /app/dashboard/finance/m2_cb:
  - tampil widget sesuai data
  - chart relevan
  - ai insight relevan konteks

========================================
ACCEPTANCE CRITERIA
========================================
- m2_cb tampil sebagai dashboard “Saldo Awal COA”, bukan konten generik.
- Semua mapping wajib aktif:
  menu->route->component, data->widget, data->chart, data->insight.
- Tidak ada regression di menu finance lain.
- Sertakan daftar file yang diubah + alasan.

========================================
FORMAT OUTPUT YANG SAYA MAU
========================================
1. Root cause (kenapa sebelumnya mismatch)
2. Mapping table final (yang dipakai di kode)
3. Patch file-by-file
4. Hasil verifikasi (lint/test/build/manual)
5. Risiko & follow-up (jika ada endpoint belum ideal)
```
