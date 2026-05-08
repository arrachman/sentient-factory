# Migration Drift Fix Notes

**Status**: 🟡 Partial fix applied; full reconcile butuh TTY shell

## Issue Summary

Pre-existing migration di api-gateway punya bug ordering:
- `20260214193000_add_check_active_user_requires_warehouse` (timestamp 19:30) adds CHECK referencing `warehouse_id`
- `20260214195500_add_warehouse_id_to_users` (timestamp 19:55) adds `warehouse_id` column **25 menit kemudian**

Shadow DB Prisma replay urut timestamp → CHECK fails karena column belum ada.

## Fix Applied (this session)

**File**: `apps/api-gateway/prisma/migrations/20260214193000_add_check_active_user_requires_warehouse/migration.sql`

Migration di-ubah jadi idempotent:
- Cek apakah column `warehouse_id` ada DAN constraint belum ada
- Hanya add constraint kalau dua kondisi terpenuhi
- Aman replay di shadow DB (column gak ada → no-op) dan production (column ada, constraint sudah di-drop manual → no-op)

Plus: removed empty migration folder `20260311224221_add_manager_kpi_sources/` (typo duplicate, sibling `_tables` punya isi).

## Yang Masih Perlu Dibereskan (butuh TTY)

`prisma migrate dev` butuh interactive TTY untuk handle drift detection. Bash tool kita non-TTY → blocked.

User perlu run di terminal interaktif:

```bash
cd apps/api-gateway

# 1. Generate migration baru yang capture state aktual
#    (clinic tables yang kita create manual via SQL belum ter-record di _prisma_migrations)
npx prisma migrate dev --create-only --name slice0_clinic_foundation

# 2. Review migration yang di-generate — pastikan match SQL yang udah jalan manual
#    Edit kalau perlu (mis: drop CREATE statements yang udah ada, gantikan dengan IF NOT EXISTS)

# 3. Mark applied (karena state sudah ada di DB)
npx prisma migrate resolve --applied <migration_name>

# 4. Verify clean
npx prisma migrate status
```

Atau **nuclear option** (kalau dev DB safe di-reset):

```bash
npx prisma migrate reset --force   # ⚠️ DROP semua data
npm run db:seed                    # re-seed ERP
npm run db:seed:clinic              # re-seed clinic
```

## Tables Already Created Manually (Tidak di Migration History)

Di Slice 0 dan 2-5 saya create tabel via raw SQL (`psql -c "CREATE TABLE..."`) karena `prisma migrate` blocked. Tables yang harus reconcile:

```
clinic_settings              (Slice 0)
clinic_psikolog_profile      (Slice 0)
clinic_service               (Slice 2)
clinic_room                  (Slice 3)
clinic_client                (Slice 5)
```

Plus actions di m0_users:
```
DROP CONSTRAINT chk_m0_users_active_requires_warehouse  (intentional drop — see ADR 003)
```

Setelah reconcile, future migrations (Slice 6 ClinicBooking dll) bisa pakai `prisma migrate dev` normally.

## Current Workaround untuk Slice 6+

Sebelum drift di-fix proper, untuk add table baru:

```bash
# 1. Update prisma/schema.prisma dengan model baru
# 2. Run prisma format + generate (regen client)
npx prisma format
npx prisma generate

# 3. Apply via raw SQL (bypass migrate)
PGPASSWORD='PasswordSuperRahasia123!' psql -h localhost -p 3208 -U root -d sentient_factory <<SQL
CREATE TABLE "clinic_..." (...);
CREATE INDEX ...;
SQL

# 4. Test app — Prisma client sudah recognize tabel baru
```

Atau pakai `prisma db push --accept-data-loss` kalau drift nya minor (tapi risk drop column unintended).

## Long-term Fix Recommendation

1. **Reset migrations** di dev DB saat opportunity ada (e.g., before next major branch)
2. Atau **manual reconcile** via `prisma migrate resolve` saat punya TTY
3. **Standardize** workflow: setiap slice generate migration via TTY-equipped session
