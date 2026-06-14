---
name: erp-report
description: >
  Generator template laporan Senti ERP dari prompt natural — ATM (Amati-Tiru-
  Modifikasi) dari skill /carbone (carbone.io). Dari deskripsi laporan ("invoice
  dengan logo + tabel item + total terbilang") hasilkan template JSON valid sesuai
  spec engine di apps/web-erp/report-engine/README.md (band-based, sintaks
  {d.x:formatter} gaya Carbone). Aktifkan saat user minta bikin/ubah template
  laporan, cetak PDF, faktur/PO/kwitansi/buku besar, atau menyebut "report template".
trigger: >
  Aktif saat user menyebut "template laporan", "report template", "/carbone",
  "bikin laporan/cetak/PDF", "invoice/faktur/PO/kwitansi/buku besar template",
  "designer report", atau minta generate template di report-engine.
---

# Senti ERP — Report Template Generator (ATM /carbone)

Skill ini = **tiru `/carbone`**: ubah prompt natural jadi **template laporan
Senti ERP** dalam format JSON. **Bukan** Carbone (3rd-party ditolak — lihat
`report-engine/README.md §1`); kita hanya pinjam sintaks `{d.x:formatter}` & UX
prompt-to-template, lalu **modifikasi** ke engine band-based Senti.

## 0. Otoritas (baca sebelum generate)

`apps/web-erp/report-engine/README.md` = **single source of truth**. WAJIB
patuh:
- **§4** — skema template JSON (root, band, component).
- **§5** — expression engine (namespace `d`/`c`, formatter suffix, aggregate,
  system var, conditions). **Sintaks WAJIB gaya Carbone** — jangan output gaya
  lama `{data.x}`/`{formatNumber(...)}`.
- **§3.3** — kontrak payload API (`company`/`settings`/`params`/`data[]`/`summary`).
- **§2.9** — 3 tipe report (Form dokumen / List / Ledger).

Kalau spec berubah, README menang — sinkronkan skill ini.

## 1. Alur kerja

1. **Pahami prompt** → tentukan: nama laporan, modul (`pur`/`sls`/`fin`/…),
   **tipe report** (lihat §2 di bawah), field yang dibutuhkan.
2. **Cek data contract** — field yang dipakai harus ada di payload (`d.*` dari
   `data[]`, `c.*` dari complement). Bila endpoint/field belum jelas →
   `AskUserQuestion` (jangan karang field). Catat `dataEndpoint` + `params`.
3. **Pilih kerangka band** sesuai tipe (§2).
4. **Generate JSON** valid sesuai §4 + sintaks §5.
5. **Tulis file** ke `apps/api-gateway/src/reports/templates/<id>.json`
   (Q2 README: MVP = file JSON). `id` = kebab, mis. `purchase-order-v1`.
6. **Validasi** (§3): JSON parseable, semua marker pakai namespace `d`/`c`/`$`,
   formatter dikenal, band lengkap, tak ada field tak-terdefinisi.
7. **Lapor** ringkas: tipe, band, daftar field `d.*`/`c.*` yang diasumsikan ada
   di payload (supaya user/endpoint bisa sediakan).

Ambiguitas (modul, field, endpoint, grouping) → **tanya dulu** (skill `erp` §
disiplin). Jangan declare selesai sebelum file ditulis + dokumen sinkron.

## 2. Tipe report → kerangka band (§2.9)

**Tipe 1 — Form Dokumen** (PO, Faktur, GRN, Kwitansi). 1 dok = 1 group.
```
pageHeader → groupHeader(level1, groupBy: noTransaksi) [kartu entitas + header kolom]
  → data(minRows: N) [baris item]  → groupFooter(level1) [total + terbilang + TTD]
  → pageFooter [{$page}/{$pages}]
```

**Tipe 2 — List/Tabulasi** (Daftar PO, Laporan Pembelian). Banyak record, 1–2 group.
```
pageHeader [judul + header kolom] → groupHeader(level2, invisible)?
  → groupHeader(level1, groupBy: kategori) → data → groupFooter(level1) [subtotal]
  → groupFooter(level2) [grand total] → pageFooter
```

**Tipe 3 — Buku Besar/Ledger** (Buku Besar per Kontak). 2-level, running balance.
```
pageHeader → groupHeader(level2, groupBy: kontak, newPageBefore)
  → groupHeader(level1, groupBy: akun, printOnAllPages) → data(canGrow)
  → groupFooter(level1) [sum debit/kredit + {last(d.saldo)}] → groupFooter(level2) → pageFooter
```

## 3. Cheat-sheet sintaks (§5 — gaya Carbone)

| Mau | Tulis |
|---|---|
| Field data baris | `{d.namabarang}` |
| Company/settings/param/summary | `{c.company.name}` `{c.settings.dateFormat}` `{c.params.dateFrom}` `{c.summary.grandTotal}` |
| Angka 2 desimal | `{d.total:formatN(2)}` |
| Mata uang | `{d.total:formatC}` · Kuantitas `{d.jml:formatQ}` |
| Tanggal | `{d.tgl:formatD(DD/MM/YYYY)}` |
| Terbilang | `{c.summary.grandTotal:terbilang}` |
| Rich text / HTML | `{d.notes:html}` |
| Fallback null | `{d.npwp:default(-)}` |
| Subtotal group | `{sum(d.total):formatN(2)}` · jumlah baris `{count()}` |
| Running balance | `{last(d.saldo):formatN(2)}` |
| Halaman | `Hal {$page}/{$pages}` · waktu `{$now:formatD(DD/MM/YYYY HH:mm)}` |
| No baris | `{$line}` |
| Warna kondisional | komponen `conditions[]`: `{ "when": "d.total < 0", "style": { "color": "#FF0000" } }` |

**Loop baris = DataBand** (iterasi `data[]`), **bukan** marker `[i]` inline ala
Carbone. Satu komponen di DataBand = satu kolom; engine ulang per row.

## 4. Skeleton minimum

```jsonc
{
  "id": "<kebab-id>",
  "name": "<Nama Laporan>",
  "module": "<pur|sls|fin|inv|...>",
  "version": 1,
  "pageSize": "A4",
  "orientation": "portrait",
  "margins": { "top": 10, "right": 10, "bottom": 10, "left": 10 },
  "dataEndpoint": "/api/reports/<slug>",
  "params": [ { "name": "id", "type": "string", "label": "Nomor", "required": true } ],
  "fonts": ["Arial"],
  "bands": [
    { "type": "pageHeader", "height": 30, "components": [ /* text/image, marker §3 */ ] },
    { "type": "data", "height": 6, "minRows": 0, "components": [ /* kolom */ ] },
    { "type": "pageFooter", "height": 8, "components": [
      { "type": "text", "x": 150, "y": 0, "width": 30, "height": 6,
        "expression": "Hal {$page}/{$pages}", "style": { "fontSize": 8, "align": "right" } }
    ] }
  ]
}
```

Komponen `text`/`image`/`line` lengkap dengan `style` + `conditions` → §4.3 README.

## 5. Jangan

- Jangan pakai sintaks lama `{data.x}` / `{formatNumber(x)}` — sudah diganti §5.
- Jangan adopsi flat-loop `{d.items[i].x}` Carbone — pakai DataBand.
- Jangan karang field/endpoint yang belum ada di payload — tanya dulu.
- Jangan rekomendasikan/ pasang Carbone, Stimulsoft, pdfme, LibreOffice
  (`report-engine/README.md §1` — semua ditolak).
- Jangan lewati update README bila menambah formatter/aturan baru.
