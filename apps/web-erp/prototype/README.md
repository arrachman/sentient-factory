# Sentient ERP — Prototype

Ini adalah **prototype desain** untuk Sentient ERP. Bukan aplikasi produksi, bukan kode runtime — hanya artefak desain (HTML/CSS statis + aset pendukung) yang dipakai untuk:

- Mengeksplorasi arah visual & UX Sentient ERP sebelum implementasi di Next.js.
- Sumber referensi layout, komponen, dan interaksi saat membangun versi produksi di `apps/web-dashboard` / app ERP final.
- Demo internal & review stakeholder.

## Status

- **Tipe**: prototype / design mockup (statis).
- **Tech**: HTML, CSS, sedikit JSX standalone (`tweaks-panel.jsx`) — tidak ter-bundle ke build monorepo.
- **Bukan**: app Next.js, bukan target Turborepo, bukan deploy target.

## Status: SUPERSEDED — referensi saja

> Sejak **2026-05-17** keputusan frontend di-reversal: produk dibangun
> sebagai app **Next.js** di `apps/web-erp/` (lihat `apps/web-erp/README.md`).
> Prototype ini **bukan lagi runtime** — fungsinya sumber port design
> system + shell ke app Next.js. Jangan kembangkan fitur di sini.
>
> Port **3219** di `config/ports.json → apps.web-erp` sekarang milik
> **app Next.js**, bukan prototype.

## Lihat prototype (ad-hoc, opsional)

Hanya untuk meninjau desain lama. Pakai port ad-hoc bebas (BUKAN 3219):

```bash
cd apps/web-erp/prototype
PORT=4319 npm run dev    # live-server, port ad-hoc
# atau static:
npx serve -l 4319 apps/web-erp/prototype
```

> `package.json` di sini hanya untuk runner dev lokal — prototype **tetap bukan**
> anggota workspace npm, bukan target Turborepo, bukan deploy target.

## Struktur

```
prototype/
├── index.html         # Entry mockup
├── styles.css         # Styling prototype
├── tweaks-panel.jsx   # Komponen panel tweak (standalone)
├── src/               # Aset & modul pendukung
└── uploads/           # Gambar / aset upload referensi
```

## Catatan

- Jangan jadikan prototype ini dependency runtime dari app lain di monorepo.
- Saat fitur dari prototype dipromote ke implementasi nyata, kerjakan di app target (mis. `apps/web-dashboard` atau app ERP final) — jangan edit prototype untuk fixing produksi.
- Jika prototype sudah tidak relevan, arsipkan / hapus daripada dibiarkan drift dari desain final.
