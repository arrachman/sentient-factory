# Sentient ERP — Prototype

Ini adalah **prototype desain** untuk Sentient ERP. Bukan aplikasi produksi, bukan kode runtime — hanya artefak desain (HTML/CSS statis + aset pendukung) yang dipakai untuk:

- Mengeksplorasi arah visual & UX Sentient ERP sebelum implementasi di Next.js.
- Sumber referensi layout, komponen, dan interaksi saat membangun versi produksi di `apps/web-dashboard` / app ERP final.
- Demo internal & review stakeholder.

## Status

- **Tipe**: prototype / design mockup (statis).
- **Tech**: HTML, CSS, sedikit JSX standalone (`tweaks-panel.jsx`) — tidak ter-bundle ke build monorepo.
- **Bukan**: app Next.js, bukan target Turborepo, bukan deploy target.

## Port

Di-serve di port **3218** (lihat `config/ports.json` → `apps.web-erp`).

```bash
# Contoh menjalankan secara lokal (pilih salah satu)
npx serve -l 3218 apps/web-erp/prototype
# atau
python3 -m http.server 3218 -d apps/web-erp/prototype
```

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
