---
name: docs
description: Skill untuk bekerja dengan docs/ — Docusaurus documentation site dengan konten marketing, tutorial MyERPPlus, OBT architecture, schema SQL, dan contribution guides.
---

Kamu sedang bekerja di `docs/` — dokumentasi Sentient Factory (Docusaurus).

## Tech Stack
- **Framework**: Docusaurus
- **Package name**: `sentient-factory-docs`
- **Port**: 3205 (via Docker)

## Struktur Folder

```
docs/
├── docs/                          # Konten dokumentasi (Markdown)
│   ├── intro.md                   # Halaman intro
│   ├── contributing.md            # Panduan kontribusi
│   ├── 06-marketing/              # Aset & copy marketing
│   │   ├── brand-guidelines.md
│   │   ├── landing-page-copy.md
│   │   ├── messaging-framework.md
│   │   └── tickets/               # Ticket list & backlog
│   ├── 07-tutorial-myerpplus/     # Tutorial per modul MyERPPlus
│   │   ├── getting-started.md
│   │   ├── m0-administrator/
│   │   ├── m1-master-data/
│   │   ├── m2-finance/
│   │   ├── m3-inventory/
│   │   ├── m4-purchase/
│   │   ├── m5-sales/
│   │   ├── m6-manufacturing/
│   │   ├── m7-procurement-advanced/
│   │   ├── m8-analytics-content/
│   │   ├── m11-healthcare/
│   │   └── m12-pos/
│   └── 08-obt/                    # OBT Architecture docs
│       ├── konsep-obt-m0-m12.md
│       ├── semantic-obt-blueprint.md
│       ├── semantic-cross-module-lineage.md
│       ├── semantic-to-physical-obt-mapping.md
│       └── draft-physical-obt-sql-skeletons.md
├── src/
│   ├── components/                # Custom React components
│   ├── css/                       # Custom CSS
│   └── pages/                     # Custom pages (non-doc)
├── static/                        # Static assets (images, dll)
├── sql/                           # SQL reference files
├── plan/                          # Planning documents
├── prompts/                       # AI prompt templates
├── docusaurus.config.ts           # Docusaurus configuration
├── sidebars.ts                    # Sidebar navigation structure
└── ai-chat-history-schema.md      # AI chat history schema docs
```

## Perintah Umum

```bash
# Development server (hot reload)
npm run start

# Build static site
npm run build

# Serve build hasil
npm run serve

# Clear cache
npm run clear

# Deploy (ke GitHub Pages atau konfigurasi lain)
npm run deploy
```

## Panduan Tugas Umum

### Menambah Halaman Dokumentasi Baru
1. Buat file `.md` di folder yang sesuai (misal `docs/07-tutorial-myerpplus/m5-sales/`)
2. Tambah frontmatter:
   ```markdown
   ---
   sidebar_position: 1
   title: Judul Halaman
   ---
   ```
3. Tulis konten dalam Markdown
4. Halaman otomatis muncul di sidebar sesuai struktur folder

### Menambah Section Baru
1. Buat folder baru di `docs/` dengan prefix angka (contoh: `09-api-reference/`)
2. Buat `_category_.json`:
   ```json
   {
     "label": "API Reference",
     "position": 9,
     "collapsed": true
   }
   ```
3. Tambah halaman `.md` di dalam folder

### Update Sidebar Manual
Edit `sidebars.ts` jika perlu urutan kustom atau grouping manual.

### Menambah Custom Component
1. Buat React component di `src/components/`
2. Import di halaman MDX:
   ```mdx
   import MyComponent from '@site/src/components/MyComponent'
   <MyComponent />
   ```

## Seksi Konten

### `06-marketing/`
Aset copywriting dan brand guidelines untuk tim marketing:
- Brand voice & tone
- Messaging framework per produk
- Copy untuk landing page
- Ticket backlog fitur marketing

### `07-tutorial-myerpplus/`
Panduan penggunaan sistem MyERPPlus per modul (m0–m12).
Useful untuk onboarding user baru dan dokumentasi fitur.

### `08-obt/`
Dokumentasi teknis arsitektur OBT (Operational Business Transformation):
- Konsep dan blueprint
- Mapping semantic ke physical tables
- Draft physical OBT SQL skeletons
