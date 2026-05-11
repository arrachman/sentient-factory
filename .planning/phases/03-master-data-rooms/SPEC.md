# Slice 03: master-data-rooms — SPEC

**Status**: 🟢 Done (extended 2026-05-11)

CRUD ruangan klinik + **fasilitas terstruktur** + grid pemakaian harian.

## Scope

### Data model (`clinic_room`)
- `id`, `name` (unique), `type` (`konseling` | `anak` | `tes` | `seminar`)
- `capacity` (int, default 1)
- **`facilities` `text[]`** — array fasilitas terstruktur (`{Sofa, Meja, AC, ...}`), default `{}`
- `description` (nullable text) — **catatan internal admin** (bukan source fasilitas lagi)
- `is_active` (bool)
- Audit fields standar (`created_*`, `updated_*`, `deleted_*`)

### Endpoints
- `GET /api/clinic/rooms?limit&isActive&type` — paginated list
- `POST /api/clinic/rooms` — create (admin only)
- `PATCH /api/clinic/rooms/:id` — update (admin only)
- `DELETE /api/clinic/rooms/:id` — soft delete

DTO `CreateRoomDto.facilities`:
```
@IsOptional() @IsArray() @ArrayMaxSize(30)
@IsString({ each: true }) @MaxLength(60, { each: true })
facilities?: string[];
```

### UI (`/admin/rooms`)
- Stat tile row (total ruangan, terisi, kosong, utilisasi)
- Date strip + Room × 6-slot usage grid (warna service type)
- **FacilitiesEditor di CRUD drawer** (chip selector):
  - Chip terpilih dengan tombol X hapus
  - Input custom + Enter (atau tombol Tambah)
  - Suggestions per type dari `DEFAULT_FACILITIES` (dashed-border, klik tambah)
  - Tombol "Pakai semua" untuk bulk-add suggestions
  - Validasi: max 30 item, max 60 char/item, dedupe case-insensitive
- Description field jadi "**Catatan internal**" terpisah (notes only)
- **RoomDetailPanel** (klik cell):
  - Source fasilitas berurutan: `room.facilities` array → legacy CSV `description` → `DEFAULT_FACILITIES[room.type]`
  - UI tidak pernah kosong — selalu render badges

### Seed
11 rooms: Sky/Sage/Forest/Sunset/Mint Room (konseling), Terapi 1-3 + Playground (anak), Tes, Seminar.

## Migration history

| Migration | Purpose |
|---|---|
| `*_clinic_room_init` | Initial table + 11 seed rows |
| `20260511_002_clinic_room_facilities` | `ADD COLUMN facilities text[] DEFAULT '{}'` + SQL backfill (parse comma-separated `description` lama → array) |

## Files

- Backend
  - `apps/api-gateway/src/clinic-room/clinic-room.{controller,service,module}.ts`
  - `apps/api-gateway/src/clinic-room/dto/clinic-room.dto.ts`
  - `apps/api-gateway/prisma/migrations/20260511_002_clinic_room_facilities/migration.sql`
- Frontend (`apps/web-althea/features/admin-rooms/`)
  - `model/{types,constants,utils}.ts` — `Room.facilities`, `DEFAULT_FACILITIES`, `ROOM_TYPE_STYLE`
  - `api/room.api.ts`
  - `hooks/{use-room,use-rooms-page}.ts`
  - `ui/rooms-page.tsx` + `room-{crud-drawer,detail-panel,usage-grid,usage-legend,stat-tile,stat-tiles-row,toolbar}.tsx`

## Acceptance criteria

- [x] CRUD ruangan jalan (admin only)
- [x] Fasilitas tersimpan sebagai array di DB
- [x] Edit existing room: kalau facilities kosong + description CSV → auto-parse ke chips (legacy migration UX)
- [x] Detail panel tampilkan badges dengan fallback chain (array → CSV → defaults)
- [x] Soft delete + isActive toggle
- [x] Backfill migration tidak hilangkan data lama

## Reference templates
- API: `apps/api-gateway/src/master-data-items/`
- UI: `apps/web-dashboard/features/master-item/`
- Mockup: `apps/psychology-design/AdminRooms.jsx`
