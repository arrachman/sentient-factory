---
name: ide-apps
description: >
  Generator project instructions detail untuk Claude Design (claude.ai/design).
  Output: blok instructions siap-paste ke "New Project" Claude Design — lengkap dengan
  list modul, dummy data spec, dan style guide. Fokus pasar internasional (global SaaS)
  dengan dukungan bahasa output Indonesia atau English.
trigger: >
  Aktif saat user menyebut "ide-apps", "ide saas", "project instructions claude design",
  "prototype saas", atau menyebut salah satu nama SaaS dari katalog di bawah.
---

# Skill: ide-apps

Tujuan: ketika user menyebut **nama SaaS** dari katalog, hasilkan **project instructions
detail** yang siap di-paste ke field "Project instructions" di Claude Design
(claude.ai/design → New Project).

**Fokus market: internasional / global SaaS.** Bahasa output bisa Indonesia atau English
sesuai flag, tapi dummy data, brand, currency, dan terminologi selalu global-first.

## Cara pakai

Sintaks:
- `/ide-apps <name> [--lang] [--device]`
- Flags bahasa: `--id` (default), `--en`
- Flags device: `--desktop` (default), `--tablet`, `--mobile`, `--responsive`
  (responsive = desktop + tablet + mobile sekaligus, layout adaptif)
- `/ide-apps random` → pilih satu acak (flag tetap bisa ditambahkan)
- `/ide-apps all tier-1` → batch semua di tier tertentu

Contoh:
- `/ide-apps medical-clinic --en --desktop`
- `/ide-apps coworking --mobile`
- `/ide-apps restaurant-pos --tablet --en` (POS biasanya tablet)
- `/ide-apps field-sales-crm --mobile --en` (sales lapangan → mobile-first)
- `/ide-apps random --en --responsive`

Kalau device tidak disebut, infer dari domain (contoh: POS → tablet, field-sales → mobile,
BI dashboard → desktop). Konfirmasi inference di paragraf penutup.

Kalau nama ambigu (lebih dari 1 match), tanya ulang dengan 3 kandidat terdekat.
**Jangan pakai sistem nomor** — selalu rujuk SaaS dengan namanya.

## Katalog ide SaaS (global / international)

### Tier 1 — High value, large global market
- **medical-clinic** — patient booking, EMR, e-prescription, billing, SMS/WhatsApp reminder
- **school-lms** — attendance, gradebook, schedule, parent portal, tuition, report card
- **property-management** — tenant, utility invoice, maintenance ticket, occupancy dashboard
- **restaurant-pos** — touch order, KDS, table layout, ingredient stock, daily sales
- **logistics-delivery** — pickup order, route planner, driver app, tracking, COD

### Tier 2 — Niche, easy to sell
- **salon-spa** — slot per stylist, package, commission, customer history
- **gym-studio** — class schedule, QR check-in, membership, trainer dashboard
- **auto-workshop** — work order, parts inventory, mechanic assignment, vehicle history
- **pet-care** — grooming booking, pet medical record, retail, vaccine reminder
- **event-planner** — project per event, vendor list, countdown timeline, RSVP

### Tier 3 — B2B / Internal tools
- **hris-payroll** — payroll, geo-attendance, leave, payslip, tax/benefits
- **field-sales-crm** — pipeline kanban, GPS visit report, target, commission
- **construction-pm** — budget (BOQ), daily progress photo, material request, S-curve
- **aesthetic-clinic** — consultation → treatment plan → before/after → membership
- **coworking-space** — room availability, member access, day pass, invoice

### Tier 4 — Modern / AI-native
- **ai-support-inbox** — unified inbox (email/IG/WA/chat), AI draft, routing, sentiment
- **social-scheduler** — content calendar, AI caption, multi-account, analytics
- **ai-meeting-notes** — transcript, action items, calendar integration, search
- **bi-dashboard** — connect DB, drag-drop chart, share, alerting
- **internal-wiki-ai** — page tree, block editor, permissions, AI Q&A

## Template output (WAJIB dipakai)

Bungkus dalam code block markdown, TANPA preamble (langsung mulai dari `# Project:`).
Gunakan bahasa sesuai flag (`--en` atau `--id`, default `--id`).

````markdown
# Project: [SAAS NAME] — SaaS Prototype

## Context
[2-3 sentences: who it's for, what problem it solves, value proposition]

## Target user (primary persona)
- **Primary:** [role + business size + tech savviness]
- **Secondary:** [other users with access, e.g. staff/customer]
- **Usage context:** [desktop/tablet/mobile, duration, frequency]

## Core modules (request order for variants)
1. **[Module 1]** — [1-sentence function]
2. **[Module 2]** — ...
[7-10 modules, ordered from most visual-defining to most form-heavy]

## Design system

**Style:** clean modern, Linear/Notion/Vercel vibe — not flat enterprise SAP-style.

**Tokens:**
- Primary color: [hex + reasoning]
- Font: [choice + reasoning — e.g. Geist, Inter, IBM Plex]
- Density: [compact/comfortable + row height]
- Radius: [px + style]
- Theme: dark mode toggle required, default follows OS

**Components required on every screen:**
- Sidebar [style]
- Topbar with global search ⌘K + user menu + theme toggle
- Breadcrumb
- Friendly empty state (minimal illustration + CTA)
- Skeleton loading
- Toast notification

## Dummy data spec

**Business context:** [dummy company name + industry + scale + HQ location]

**Internationalization (global-first):**
- Currency: USD primary (e.g. $1,250.00), with locale formatting (1,250.00 / 1.250,00)
- Date format: ISO-style display (May 15, 2026 or 2026-05-15) — never DD/MM/YYYY ambiguous
- Time: 12h with AM/PM AND 24h variant tokens
- Names: international mix (English, Spanish, Asian, Arabic, etc. — diverse)
- Cities: global mix (New York, London, Singapore, Berlin, Dubai, São Paulo, Tokyo)
- Phone: E.164 format (+1 555-0142, +44 20 7946 0958, +65 6123 4567)
- Language: UI copy in English by default, mention i18n-ready (LTR + RTL support)
- Timezone: show TZ-aware timestamps (e.g. "2:30 PM UTC+7")

**Main entities (for dummy data):**
- **[Entity 1]:** [field list + example values]
- **[Entity 2]:** ...

**Status enum:**
- [list all possible status + consistent badge colors]

## Constraints (per screen)
- **Output mode: Full interactive prototype** (NOT static artboard / hi-fi mockup)
  - All buttons, links, tabs, filters, modals, drawers, dropdowns must actually work
  - Form inputs accept typing, validation triggers on blur/submit
  - Tables: sort, filter, paginate, row-select must function
  - Navigation: sidebar items route between screens; breadcrumb clickable
  - State changes: optimistic UI on action (toggle, approve, delete with undo toast)
  - Use vanilla JS or Alpine.js (CDN) for interactivity — keep it self-contained
  - Persist UI state in `localStorage` (theme, sidebar collapsed, filters) so reload preserves it
  - Include realistic micro-interactions: hover, focus ring, loading skeleton on action,
    empty-state CTA that actually creates a dummy row
- Single-file HTML + Tailwind CDN + Lucide icons (CDN) + Alpine.js or vanilla JS
- No external images (use placeholder div bg-gradient or icon)
- **Target device: [DEVICE]** — design optimized for this form factor:
  - `desktop`: 1440px canvas, mouse + keyboard primary, dense layouts OK,
    sidebar always visible, hover states matter
  - `tablet`: 1024×768 landscape primary, touch primary, larger tap targets (min 44px),
    collapsible sidebar, simplified hover (use tap-to-reveal instead)
  - `mobile`: 390×844 (iPhone), touch only, bottom-nav tab bar instead of sidebar,
    single column, swipe gestures, tap targets min 48px, sticky CTA bottom
  - `responsive`: layout adapts — desktop sidebar collapses to bottom-nav on mobile;
    tables become card-list on narrow viewport; show ALL breakpoints in one prototype
- Each request I'll ask for **2-3 variants** differing in:
  - Layout / information architecture
  - Data visualization (chart vs table vs card)
  - Density & hierarchy
- Accessibility: status must never be color-only (always pair with icon/text)
- **Keyboard navigation: desktop only** (Tab focus ring, Esc closes modal, ⌘K opens search,
  arrow keys in tables). For tablet/mobile, skip keyboard shortcuts and prioritize
  touch gestures (swipe-to-delete, pull-to-refresh, long-press menu)
- i18n-ready: avoid hardcoded English strings in critical positions — use placeholder
  tokens like `{t('orders.title')}` in commented form to signal translation points

## Domain-specific notes for [DOMAIN]

**Must include:**
- [3-6 features specific to this domain often forgotten]

**Avoid:**
- [3-5 anti-patterns specific to this domain]

## Workflow per chat
1. I ask for 1 module → you provide 2-3 **fully interactive** variants (not static mockups)
2. I pick + ask for refine (color, layout, specific component, interaction polish)
3. I copy final HTML → start new chat for next module
4. Design system tokens AND shared interaction patterns (modal behavior, toast,
   keyboard shortcuts) must stay consistent across chats — I'll re-paste tokens +
   interaction spec each new chat

## Interactivity checklist (every prototype must pass)

**All devices:**
- [ ] Click/tap any button → visible state change OR toast feedback
- [ ] Open modal/drawer → backdrop tap/click closes
- [ ] Toggle theme → persists to localStorage, applies on reload
- [ ] Sort/filter list → actually reorders/filters items
- [ ] Form submit → validates, shows loading, then success/error toast
- [ ] Empty state CTA → creates a dummy entry inline

**Desktop only (skip for tablet/mobile prototypes):**
- [ ] Esc closes modal/drawer
- [ ] ⌘K (or Ctrl+K) opens command palette / global search
- [ ] Tab key cycles through focusable elements with visible focus ring
- [ ] Arrow keys navigate table rows; Enter opens detail

**Tablet/mobile specific (skip for desktop prototypes):**
- [ ] Tap targets ≥ 44px (tablet) / 48px (mobile)
- [ ] Swipe gestures on list items (swipe-left → action menu)
- [ ] Bottom-nav tab bar persistent (mobile)
- [ ] Pull-to-refresh on list views (mobile)
- [ ] Sticky bottom CTA on form screens (mobile)
````

## Aturan content

1. **Jangan generic** — tiap section harus khas domain. "medical-clinic" beda dari "auto-workshop": entity, status, warna, terminologi harus reflektif.
2. **Dummy data global-first** — nama internasional (campur English/Spanish/Asian/Arabic), kota dunia, currency USD, format tanggal `May 15, 2026` atau ISO. **Hindari konteks Indonesia-only** (Rp, BPJS, NPWP, Jakarta-only) kecuali user eksplisit minta `--id-locale`.
3. **Status enum exhaustif** — list semua state (Draft, Pending, Approved, Cancelled, etc.) + badge color.
4. **7-10 modul**, urut dari paling visual-defining (Dashboard/Calendar) ke paling form-heavy (Settings).
5. **Domain notes actionable** — bukan "user-friendly" tapi "quick filter chips 'Today / This Week / Pending Approval' above the table".
6. **Default currency: USD** dengan format `$1,250.00`. Mention multi-currency support sebagai requirement.
7. **Default date format:** `May 15, 2026` (long form) atau ISO `2026-05-15` — JANGAN `15/05/2026` (ambiguous US vs EU).
8. **i18n-ready:** semua copy di template English; mention LTR + RTL support; flag tempat-tempat yang butuh translation token.

## Bahasa output

- `--id` (default): isi template (heading, deskripsi, konteks, notes) dalam Bahasa Indonesia, **tapi dummy data tetap global** (USD, English city names, international names). Module names bilingual: tulis English diikuti gloss Indonesia dalam kurung kalau perlu.
- `--en`: seluruh output English murni.

## Setelah generate

Tutup output dengan **1 paragraf singkat** (di luar code block) berisi:
- Saran modul mana yang dipilih pertama (alasan: paling visual-defining)
- Primary color recommendation + alasan untuk domain ini
- 1 warning khas domain (mis. untuk medical: jangan pakai merah untuk status normal)
- 1 i18n consideration spesifik (mis. RTL untuk Arabic market, currency switcher untuk fintech)

Jangan tawarkan generate ide lain kecuali user minta.
