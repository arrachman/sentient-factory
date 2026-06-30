# Web-MDP — Aturan Baku untuk AI Agent (Claude)

Scope: **hanya** `apps/web-mdp/**`. Berlaku di atas root `CLAUDE.md` repo
(tidak menggantikannya). Singkat, deklaratif, non-negosiabel.

Produk: **Senti MDP** — *Manufacturing Digitalization Platform* (ISA-95
**Level 3 / MOM**). Duduk **di antara** Senti ERP (`apps/web-erp`, Level 4 —
bisnis) dan lapangan (Level 2-0 — SCADA/PLC/sensor). MDP **bukan** modul ERP;
ia bounded-context terpisah dengan persona, data, dan UX berbeda.

> 📒 **Desain DB otoritatif** = `apps/web-mdp/db-design/` (`README.md` hub +
> `module-roadmap.md` + katalog field per-modul). File ini = **rulebook**
> (invariant tiap sesi). Status awal: **FASE 0 — design docs**; Prisma & kode
> menyusul setelah approval per-modul.

---

## 0. Konteks ISA-95 (kenapa app terpisah)

```
Level 4  — ERP / Bisnis ............ apps/web-erp  (Senti ERP)
              ▲  ▼   (kontrak integrasi L4↔L3, lihat db-design/README §Integrasi)
Level 3  — MOM / MDP ............... apps/web-mdp  (Senti MDP)  ← KAMU DI SINI
   MES · QMS · CMMS · WMS · PRTS · DMS · IMS(QHSE) · LMS
              ▲  ▼   (fase nanti — bukan sekarang)
Level 2-0 — Kontrol & lapangan .... SCADA/PLC/DCS, sensor, mesin
```

- **Keputusan (2026-06-27, dengan user):** Layer 3 = **app baru `apps/web-mdp`**
  (bukan modul di web-erp, bukan repo terpisah). DB = Postgres bersama via
  Prisma; isolasi lewat **namespace domain** (lihat §1). Reuse infra:
  `packages/shared-types`, design system (port dari web-erp), auth ERP.
- **MES sumber data (2026-06-27):** **manual entry dulu** (operator input via
  UI tablet/kiosk). Integrasi mesin (SCADA/PLC/OPC-UA, time-series ingestion) =
  **fase terpisah di masa depan**, bukan MVP. Desain MES sekarang tidak boleh
  mengasumsikan koneksi mesin — tapi sediakan titik-ekstensi yang bersih.

---

## 1. Penamaan tabel (WAJIB)

Format baku **setiap** tabel fisik: `DOMAIN_NAMA-TABEL` — sama persis aturan
web-erp (`<domain>_<plural-snake>`, lowercase, tanpa prefix produk).

**Isolasi dari ERP & platform:** MDP **dilarang** memakai/menumpang prefix milik
app lain. ERP memiliki `sys_*`/`adm_*`/`md_*`/`fin_*`/`inv_*`/`pur_*`/`sls_*`/
`mfg_*`/`fa_*`/`bi_*`/`pos_*`/`pln_*`; platform/Althea memiliki `m0_*`/`m1_*`/
`clinic_*`. MDP memakai prefix domain **baru** di bawah ini — tidak beririsan.

| Domain | Cakupan | Modul peta | Contoh tabel |
| --- | --- | --- | --- |
| `mdp` | Config & master platform lintas-modul (shift, kalender kerja, katalog reason/downtime code, nav/menu SSOT MDP) | semua | `mdp_shifts`, `mdp_work_calendars`, `mdp_reason_codes`, `mdp_menus` |
| `eam` | Registry aset/equipment (backbone L3–L4; jembatan ke ERP `fa_assets`) | EAM, MES, CMMS, OEE | `eam_assets`, `eam_asset_hierarchies`, `eam_work_centers` |
| `mes` | Eksekusi produksi & data collection | MES | `mes_production_orders`, `mes_operations`, `mes_production_logs` |
| `qms` | Kualitas: inspeksi, NCR, CAPA | QMS | `qms_inspections`, `qms_nonconformances`, `qms_capa_actions` |
| `mnt` | Pemeliharaan (CMMS): work order, jadwal, spare | CMMS | `mnt_work_orders`, `mnt_pm_schedules`, `mnt_spare_parts` |
| `wms` | Eksekusi gudang fisik (putaway, picking, move) | WMS | `wms_tasks`, `wms_picks`, `wms_movements` |
| `prt` | Problem & issue tracking (Andon/eskalasi) | PRTS | `prt_issues`, `prt_escalations` |
| `dms` | Manajemen dokumen terkontrol | DMS | `dms_documents`, `dms_revisions`, `dms_acknowledgements` |
| `ehs` | QHSE terpadu (insiden, audit, izin kerja) | IMS | `ehs_incidents`, `ehs_audits`, `ehs_permits` |
| `lms` | Pelatihan & kompetensi | LMS | `lms_courses`, `lms_enrollments`, `lms_competencies` |

> **OEE = metrik, bukan modul.** Tidak punya tabel domain sendiri; dihitung
> sebagai overlay analitik di atas `mes_*` + `mnt_*` + `qms_*` (view / rollup).
> **Kaizen = metode**, bukan sistem; difasilitasi via `prt_*` + `dms_*` + `lms_*`.

- **Identity:** MDP **reuse** auth ERP (`adm_users`, `ErpJwtAuthGuard`) — tidak
  bikin tabel user baru. Pemetaan akses/role khusus MDP = **thin mapping**
  (decision #1 **resolved 2026-06-28**): `mdp_menus` (nav SSOT, self-tree) +
  `mdp_role_menus` (scalar `roleId` → ERP `adm_roles` tanpa DB-FK, `menuId` →
  `mdp_menus`, `canView`/`canEdit`). Identity tetap `adm_users`. **Nav
  role-filtered live:** `GET /api/mdp/menus/nav` (user→`adm_user_roles`→
  `mdp_role_menus`→menu tree + ancestor; fallback full tree bila belum ada
  mapping) dikonsumsi `DynamicSidebar` di `app-shell`.
- **Referensi lintas-domain & lintas-app** (mis. `mes` → ERP `mfg_work_orders`,
  `eam` → ERP `fa_assets`) = **scalar `BigInt` FK + `@@index`, TANPA**
  `@relation`/FK DB — domain tetap decoupled (pola sama web-erp). FK
  **intra-domain** ditegakkan.
- Prisma: model `PascalCase` ber-prefix `Mdp` (hindari bentrok `Erp*`/platform)
  + `@@map("<domain>_...")`. Contoh: `model MdpProductionOrder { ... @@map("mes_production_orders") }`.

---

## 2. Konvensi global (warisi dari web-erp/db-design §3)

Semua entitas MDP **wajib** memakai konvensi yang sama dengan ERP:

- PK `id BigInt @id @default(autoincrement())`.
- Business key `code String` unik; `name String` display.
- Soft delete `deletedAt DateTime?` (NULL = live); `isActive` hanya bila
  "disabled tapi tak terhapus" bermakna.
- Audit `createdAt`/`updatedAt`/`createdById`/`updatedById`.
- Money `Decimal(19,4)`, Qty `Decimal(19,4)`, Rate `Decimal(9,4)`.
- Semua timestamp **UTC** (`timestamptz`); TZ bisnis Asia/Jakarta di app layer.
- Enum Postgres untuk type/status; tanpa magic int.
- `metadata Json?` untuk atribut langka/opsional.

Detail lengkap = `web-erp/db-design/README §3` — jangan duplikasi nilai, rujuk.

---

## 3. Design system dulu, baru slicing frontend (WAJIB)

Sama aturan `web-erp/CLAUDE.md §2`. **Port** design system dari web-erp (tokens
→ atom → molecule → organism → template → page); **jangan tulis ulang** elemen
UI ad-hoc. Tambahan konteks MDP:

- UX shop-floor: target tablet/kiosk, area sentuh besar, scan-friendly,
  state online/offline jelas. Tetap pakai token & komponen reusable.
- Semua standar list page (§2.7 web-erp), kebab actions, status badge, format
  angka, density token, keyboard-first → **berlaku sama** untuk MDP.
- **UI/UX parity (2026-06-30):** MDP memakai token + CSS komponen ERP
  (`erp-components.css` dan sub-file) serta `MasterCrudPage` mengikuti chrome
  ERP: topbar/sidebar `.app`, dense grid, action/filter bar, drawer form,
  checkbox selection, bulk bar, sortable header, dan keyboard-first shortcuts.
- **Auth gate (2026-06-30):** `/app/**` wajib melalui `proxy.ts`; tanpa cookie
  `erp_token` redirect ke `/login?returnTo=<path>`. Halaman `/login` memakai
  `/api/erp/auth/login` agar cookie HttpOnly `erp_token` diset oleh api-gateway.
  Response API MDP 401 juga wajib mengarahkan ulang ke login.
- **Login demo + kontrak body (2026-06-30):** demo cred MDP = `rania / sentient`
  (dari `prisma/seed-erp.ts`, terverifikasi 200 di `/api/erp/auth/login`). **BUKAN**
  `admin@example.com / Password123!` — seed itu (`prisma/seed.ts`) tidak di-apply ke
  DB live, jadi 401. Banner "Mode demo" (`.login-demo` di `erp-login.css`) menampilkan
  akun+sandi + link "isi otomatis" (`fillDemo`). **Body login WAJIB `{ login, password }`
  saja** — DTO `ErpLoginDto` hanya whitelist dua field itu; `remember` ditolak
  (`forbidNonWhitelisted` → 400). Checkbox "Ingat saya" = client-side cosmetic (UI
  parity web-erp/web-hr), jangan dikirim ke backend.
- **Sidebar submenu (2026-06-30):** submenu modul dirender di **sidebar** dari
  pohon `mdp_menus` (`children` dari `/api/mdp/menus/nav`), **bukan** tab bar
  in-page. `DynamicSidebar` menghormati `data-sidebar-menu`: `accordion`
  (expand inline di bawah modul, modul aktif auto-expand — **default MDP**) atau
  `flyout` (panel hover). Tab molecule lama `*-nav.tsx` (Wms/Mes/Qms/Mnt/Prt/
  Dms/Ehs/Lms) **dihapus**; halaman tidak lagi merender `<XxxNav/>`. Default
  appearance: `sidebar='label'` + `sidebarMenu='accordion'` (anti-FOUC script
  `app/layout.tsx` ikut set `data-sidebar-menu`).
- Batas **400 baris/file** (§3 web-erp) berlaku tanpa pengecualian.

---

## 4. Disiplin dokumen & integrasi

1. Ambiguitas / dampak skema / batas L4↔L3 → `AskUserQuestion` dulu.
2. Katalog field per-modul ditulis **satu per satu setelah review** — bukan
   8 modul sekaligus tanpa approval (pola web-erp).
3. Setiap keputusan/flow/konvensi baru → **update `.md`** di `apps/web-mdp/`
   (default file ini; `db-design/` bila menyangkut skema). Catat sebagai fakta
   ringkas (keputusan + alasan), bukan log percakapan.
4. **Kontrak integrasi L4↔L3** (entitas apa yang menyeberang, arah datanya) =
   `db-design/README §Integrasi` — itu otoritatif. Jangan tambah dependency
   lintas-app diam-diam.
5. Commit conventional + merge ke `dev` (sama `web-erp/CLAUDE.md §4`).

---

## 5. Workflow vibe coding — commit ke `dev` + build production

**WAJIB tiap sesi vibe coding selesai** (satuan kerja yang bisa diserahkan):
commit ke branch `dev` lalu build & deploy ke production. Production web-mdp =
proses `npm run start` (`next start`) detached di **port 3220** (bukan PM2).

Urutan baku (jalankan dari `apps/web-mdp/`):

```bash
npm run check                       # lint+typecheck+size+test WAJIB hijau dulu
git add -A
git commit -m "feat(mdp): <ringkas>" # branch dev; conventional, JANGAN --no-verify
git push origin dev                  # hanya bila user mengizinkan push

# build production
npm run build

# restart serve di port 3220 (detached) → production ter-update
fuser -k 3220/tcp 2>/dev/null || true
nohup npm run start > /tmp/web-mdp.out 2>&1 &
curl -sf --max-time 5 http://localhost:3220 >/dev/null && echo "MDP up :3220"
```

Aturan: (1) `npm run check` gagal → STOP, jangan commit/build. (2) Build gagal →
jangan restart serve (production lama tetap hidup); perbaiki dulu. (3) Commit ke
branch lain selain `dev` atau `git push --force` = tanya user dulu.

## 6. Saat ragu

Tanya user. Tidak ada pengecualian diam-diam. `apps/web-mdp/CLAUDE.md` +
`db-design/` adalah otoritas untuk MDP; kalau bertentangan dengan asumsi, file
ini yang menang.
