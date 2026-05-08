---
name: apps-mockup
description: Skill untuk bekerja dengan apps/apps-mockup — interactive React/JSX mockup prototype untuk mobile dan web UI, dengan device frame simulation, design tokens, dan live theme customization.
---

Kamu sedang bekerja di `apps/apps-mockup` — interactive UI mockup & prototype Sentient Factory.

## Tech Stack
- **Runtime**: Python server (port 3213)
- **UI**: React/JSX (tanpa bundler, langsung di browser)
- **Styling**: CSS custom properties (design tokens)
- **Charts**: Chart components kustom

## Struktur File

| File | Ukuran | Fungsi |
|------|--------|--------|
| `app.jsx` | — | Main app component |
| `pages.jsx` | 44KB | Definisi semua halaman mockup |
| `components.jsx` | 24KB | UI component library |
| `design-canvas.jsx` | 31KB | Canvas/editor untuk mockup |
| `android-frame.jsx` | — | Android device frame |
| `ios-frame.jsx` | — | iOS device frame |
| `shell.jsx` | — | App shell & navigasi |
| `charts.jsx` | — | Chart mockup components |
| `icons.jsx` | — | Icon library |
| `theme.jsx` | — | Theming system |
| `tokens.css` | — | Design tokens (web) |
| `mobile-tokens.css` | — | Design tokens (mobile) |
| `page-styles.jsx` | — | Per-page style overrides |
| `tweaks-panel.jsx` | — | Live customization panel |
| `index.html` | — | Entry untuk web mockup |
| `index-mobile.html` | — | Entry untuk mobile mockup |

```
screens/      # Screen-specific mockup assets
mobile/       # Mobile-specific assets
uploads/      # User uploaded assets
```

## Fitur Utama

### Device Frame Simulation
- Preview tampilan di frame Android atau iOS
- Ukuran layar realistis
- Status bar & navigation bar

### Live Theme Customization
- `tweaks-panel.jsx` — panel kanan untuk ubah tema real-time
- Semua warna, typography, spacing via design tokens
- Perubahan langsung terlihat di preview

### Design Token System
```css
/* tokens.css */
--color-primary: #0066FF;
--color-surface: #FFFFFF;
--spacing-base: 8px;
--font-size-body: 14px;
/* dst... */
```

### Pages (di pages.jsx)
File 44KB berisi semua halaman mockup:
- Dashboard utama
- List view (data tables)
- Detail view
- Form screens
- Mobile-specific flows

## Perintah Umum

```bash
# Jalankan via Python server
python -m http.server 3213

# Atau via npm script dari root
npm run dev --filter=apps-mockup
```

## Panduan Tugas Umum

### Menambah Halaman Baru
1. Buka `pages.jsx`
2. Tambah komponen halaman baru (ikuti pola yang ada)
3. Register di routing/navigation di `shell.jsx`

### Menambah Komponen UI
1. Buka `components.jsx`
2. Tambah komponen baru mengikuti pola existing
3. Export dan gunakan di `pages.jsx`

### Ubah Design Token
1. Edit `tokens.css` untuk web atau `mobile-tokens.css` untuk mobile
2. Semua komponen yang menggunakan CSS variables otomatis update

### Tambah Screen Baru
1. Buat file di `screens/`
2. Import di `pages.jsx`
3. Tambah ke navigation

## Catatan
- Ini adalah **mockup/prototype** — bukan production code
- Gunakan sebagai referensi desain untuk implementasi di `web-dashboard`
- Design tokens harus sinkron dengan `packages/ui-kit`
