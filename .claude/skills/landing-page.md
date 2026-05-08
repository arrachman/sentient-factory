---
name: landing-page
description: Skill untuk bekerja dengan apps/landing-page — Next.js 16 public-facing marketing website dengan animasi Framer Motion, Radix UI, dan form kontak.
---

Kamu sedang bekerja di `apps/landing-page` — website publik Sentient Factory.

## Tech Stack
- **Framework**: Next.js 16.1.1 + React 19.2.1 + TypeScript 5.8.3
- **Styling**: Tailwind CSS v4
- **UI**: Radix UI (component library lengkap)
- **Animasi**: Framer Motion, Motion
- **Form**: React Hook Form + Zod
- **Icons**: Lucide React
- **Toast**: Sonner
- **Efek**: canvas-confetti

## Struktur Folder

```
app/
├── (app)/             # Route group utama
│   └── layout.tsx     # Root layout
└── layout.tsx         # App root layout

components/            # Komponen halaman
config/                # Konfigurasi (site metadata, navigasi, dll)
lib/                   # Utility functions
styles/                # Global CSS styles
public/                # Static assets (logo, gambar, dll)
```

## Perintah Umum

```bash
# Development (dengan Turbopack)
npm run dev

# Build & Production
npm run build
npm run start

# Quality
npm run lint             # ESLint check
```

## Panduan Tugas Umum

### Menambah Halaman Baru
```
app/(app)/<nama-halaman>/page.tsx
```

### Menambah Komponen Section
1. Buat file di `components/<nama-section>.tsx`
2. Import dan gunakan di halaman yang sesuai
3. Gunakan Framer Motion untuk animasi entrance

### Pola Animasi (Framer Motion)
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* content */}
</motion.div>
```

### Form Kontak dengan Zod
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
})
```

### Menggunakan Radix UI
Semua komponen Radix UI tersedia. Gunakan sesuai kebutuhan:
- `@radix-ui/react-dialog` — Modal
- `@radix-ui/react-dropdown-menu` — Dropdown
- `@radix-ui/react-accordion` — Accordion/FAQ
- `@radix-ui/react-tabs` — Tabs
- `@radix-ui/react-tooltip` — Tooltip

## File Penting
- `config/` — Site metadata, navigasi, pricing, testimonials
- `app/layout.tsx` — Meta tags, font, providers
- `public/` — Logo, OG images, favicon
