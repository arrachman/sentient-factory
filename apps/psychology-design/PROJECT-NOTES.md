# Sentient Factory Design System

This design system codifies the visual language used in the **Sentient Factory** internal app, which is built on top of the **Metronic 9** dashboard template — a Tailwind v4 + React 19 + Next.js 15 admin kit by KeenThemes that leverages the [ReUI](https://reui.io) component library.

> **Source of truth:** `arrachman/sentient-factory-app` (private GitHub repo).
> The app currently uses Metronic's **Demo 1 / Layout 1** preset (left sidebar + top header). Layouts 2–39 ship in the repo and can be swapped in via `app/(protected)/layout.tsx`.

---

## Index

| File | What's inside |
| --- | --- |
| `colors_and_type.css` | All design tokens (colors, type, radii, shadow, spacing, layout) as CSS vars |
| `fonts/` | Webfonts (Inter, loaded from Google Fonts) |
| `assets/logos/` | Sentient Factory / Metronic wordmarks + circle marks (SVG, light + dark variants) |
| `assets/decorative/` | Auth backgrounds, hero illustrations, OG image |
| `assets/illustrations/` | Brand illustrations (figures + scenes) for empty states / hero blocks |
| `preview/` | Static HTML cards that populate the **Design System** preview tab |
| `ui_kits/admin/` | UI kit recreating the protected admin app (Demo 1 layout) |
| `SKILL.md` | Agent-Skill manifest so the system is portable to Claude Code |

---

## Brand at a glance

**Sentient Factory** is a multi-tool internal platform — see sibling repos `sentient-factory-be`, `docs-sentient-factory`, `logistic-app`, `wr-app-consumer`. The frontend (`sentient-factory-app`) is a **standard Metronic 9 admin shell** with no custom rebrand applied yet — it ships with KeenThemes' default "Metronic" wordmark and blue-on-zinc palette.

> **Caveat:** because the app has not been re-skinned, this design system documents the *Metronic 9 default*. If/when the team adopts a custom wordmark or palette, those overrides should be merged into `colors_and_type.css` and the logo files in `assets/logos/` should be replaced.

---

## Content fundamentals

The product is an internal back-office app — copy is **functional, terse, sentence-case, and second-person**. No marketing fluff, no emoji.

- **Voice:** direct, neutral, instructional. "Pick a date range." "View Profile." "Get Started."
- **Casing:** Title Case for primary buttons and page titles ("Dashboard", "View Profile", "Apply", "Reset"). Sentence case for descriptions and form helpers.
- **Person:** second person ("your projects"), occasionally first-person plural in onboarding ("we'll set this up for you"). Never use "I".
- **Punctuation:** no trailing periods on button labels, badges, or table cell labels. Periods on full sentences in body copy.
- **Numbers & units:** abbreviated where space-constrained (`9.3k`, `$295.7k`, `$172k`). Currency symbol leads, no spaces. Percent change with arrow glyph: `↑ 3.9%` / `↓ 0.7%`.
- **Date/time:** human-readable in body text — `LLL dd, y` (`Jan 20, 2025`). Range: `Jan 20, 2025 - Feb 09, 2025`.
- **Empty states:** short imperative + illustration. ("No notifications yet.", "No results found.")
- **Tone:** confident, never cute. No exclamation marks. No emoji in product UI; emoji only appear as flag/avatar imagery.
- **Examples from the codebase:**
  - Page title: *"Dashboard"* → subtitle *"Central Hub for Personal Customization"*
  - CTA card: *"Connect Today & Join the KeenThemes Network"* → body *"Enhance your projects with premium themes and templates. Join the KeenThemes community today for top-quality designs and resources."* → CTA *"Get Started"*
  - Sidebar headings: `USER`, `PAGES` (uppercase, tracked, muted).
  - Soon-state badge: simply `Soon`.

---

## Visual foundations

### Colors

A **near-monochrome zinc** scale carries 90% of surfaces. **Blue** is the single chromatic accent (links, focus, charts, primary CTAs in lighter contexts). **Green / yellow / red / violet** appear strictly as semantic states (success / warning / destructive / info) — usually as small badges, never as decoration.

- Background: pure white in light mode (`#ffffff`), `zinc-950` in dark.
- Borders: `oklch(94% 0.004 286.32)` — between `zinc-100` and `zinc-200`. Hairlines are everywhere; they replace shadows in card chrome.
- Primary action button: `bg-zinc-900 text-white` (the `primary` variant binds to zinc, not blue — blue is used as a *link* color and chart accent).
- Hover: `bg-primary/90` (10% darken on dark fills); `hover:bg-accent` (zinc-100) on outline/ghost buttons.
- Press: same as hover, no scale change.
- Disabled: `opacity-60 pointer-events-none`.

### Type

**Inter** at all scales, single family. Weights: 400 (body), 500 (medium / page titles, button labels), 600 (card titles, section heads), 700 (rare, big numbers). The page title (`ToolbarPageTitle`) is `text-xl font-medium leading-none` — note **medium** not bold. Card titles step down to `text-base font-semibold`. Eyebrows / sidebar headings: `text-xs font-medium uppercase tracking-wide muted`.

### Layout

- Sidebar: 280px expanded, 80px collapsed (icon-only on hover). Header: 70px desktop, 60px mobile. Both fixed.
- Container: capped at the `xl` Tailwind breakpoint (1280px), `px-4 lg:px-5`.
- Toolbar pattern at the top of every page: title + subtitle on the left, action buttons on the right, `pb-7.5` (30px) gutter to content.
- Cards: 14px header height (`min-h-14`), `px-5` padding, `rounded-xl` (12px), 1px border, no shadow on flat list cards; `shadow-xs shadow-black/5` on elevated CTAs.
- Backgrounds: solid white. **No gradients** in the product UI. Auth screens use a single full-bleed photographic / abstract SVG background.

### Borders, radii, elevation

- Radii: `0.5rem` (8px) is the canonical `--radius`. Buttons → `rounded-md` (6px). Cards / popovers → `rounded-xl` (12px). Pills / circular avatars → `rounded-full`.
- Borders: 1px hairline using `--border`. `border-input` (zinc-200) for form fields. Dashed border variant available on `dashed` button.
- Shadows: extremely restrained — `shadow-xs shadow-black/5` on buttons + cards. No glow, no colored shadows, no elevation > md.

### Animation, hover, focus

- Transitions: `transition-[color,box-shadow]` on interactive elements (Metronic explicitly avoids transforming geometry). Sidebar collapse: `0.3s ease`.
- Focus ring: 2px `outline` at offset 3, color `var(--ring)` (zinc-400). Critical accessibility hook: `*:focus-visible` is set globally.
- No bounces, no parallax, no entry animations on lists. The motion budget is "calm". The only animated keyframe in `globals.css` is the **marquee** util for brand-strip components.
- Hover states: outline/ghost → `bg-accent` (zinc-100). Filled → `/90` opacity on the same fill. Icon buttons in the header → `hover:bg-primary/10 hover:[&_svg]:text-primary` (subtle blue tint).

### Imagery

Photographic avatars are warm-toned, lightly desaturated. Illustrations use a clean, slightly geometric figure style with flat fills + soft shadows (see `assets/illustrations/` — taken from Metronic's `public/media/illustrations`). Most illustrations have a **light** and **dark** SVG twin (`19.svg`, `19-dark.svg`).

### Density & rhythm

- 8px spacing rhythm for layout, 4px for component innards.
- Tables and lists are dense — `text-2sm` (13px) for cell text, `h-8.5` row height.
- Buttons: `h-8.5` (md, default), `h-7` (sm), `h-10` (lg), `size-8.5` (icon).

---

## Iconography

- **System: `lucide-react`** ([lucide.dev](https://lucide.dev)). Stroke-based, 1.5px weight, 24×24 viewBox; rendered at 16px (`size-4`) inside buttons and 18px (`size-4.5`) in the header. Icon color follows text color via `currentColor`. Icons inside outline/secondary/dashed buttons have automatic `opacity-60` so they sit visually behind the label.
- **Secondary: `@remixicon/react`** for occasional pictograms not in Lucide (per `package.json`).
- The **logo and product brand-marks** live as SVG files in `assets/logos/`. There is no icon font.
- `public/media/brand-logos/*.svg` are third-party brand logos used in marketing/social-proof rails (Airbnb, Amazon, etc.) — *not* part of the Sentient Factory brand expression itself; they're reference imagery only.
- **Emoji is not used** in product UI. Country flags (`public/media/flags/`) appear as PNG sprites in language pickers.
- **Use guidance:** prefer Lucide. Match weight; do not mix outline/filled. When sizing in a button, rely on the `size-N` utility — never set width/height inline.

---

## Caveats / known gaps

1. **No custom branding has been applied.** The "Metronic" wordmark and the default zinc/blue palette ship as-is. If Sentient Factory adopts a brand identity, the logos in `assets/logos/` and the primary palette in `colors_and_type.css` should be overridden.
2. **No real product copy exists yet** beyond the default Metronic dashboard placeholder. The content fundamentals above were inferred from the dashboard demo (`app/(layouts)/layout-1/page.tsx`) and the search dialog. As real Sentient Factory features ship, capture authentic copy here.
3. **Inter is loaded via Google Fonts** rather than self-hosted (Next.js `next/font/google` does the hosting in production). The `colors_and_type.css` here imports the Google Fonts URL for portability.
4. **Charts** (Apex / Recharts) follow the chart palette tokens but are not rendered as live cards in this preview.
