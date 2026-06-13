/**
 * One-off importer: client + therapy-package bookings from import-data-client.json.
 *
 * Decisions (confirmed with user 2026-06-12):
 *  - Direct Prisma writes (bypass WA notifications + slot/conflict validation).
 *  - Upsert clients by MRN; dedupe bookings by (clientId, same calendar date).
 *  - One booking per non-null `Terapi N` date, grouped as a package
 *    (sessionN/sessionTotal + packageGroupId). Service = therapy package
 *    (`jenis layanan.1`). The `jenis layanan` (konseling) column is classification only.
 *  - Defaults: room by category (anak->Terapi Anak 1, dewasa->Sage Room) unless the
 *    row names a Ruangan; start 09:00 WIB (or parsed `jam`), duration from service;
 *    status = completed if past / confirmed if future.
 *  - Malformed/ambiguous dates are SKIPPED and listed in the report.
 *
 * Run:  npx ts-node prisma/seed-clinic-import-bookings.ts            (dry-run, default)
 *       npx ts-node prisma/seed-clinic-import-bookings.ts --commit   (write to DB)
 */
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const COMMIT = process.argv.includes('--commit');
const NOW = new Date('2026-06-12T00:00:00+07:00');
const WIB_OFFSET = '+07:00';
const DEFAULT_HOUR = 9; // 09:00 WIB when `jam` is null

const IMPORT_PATH = join(__dirname, '../../../import-data-client.json');

// psikolog name (sheet) -> m0_users.id  (resolved from clinic_psikolog_profile)
const PSIKOLOG: Record<string, number> = {
  fara: 147,
  anin: 148,
  ulfa: 149,
  diba: 151,
  bayu: 152,
  hervina: 153,
  aulia: 156,
};

// therapy package (jenis layanan.1) -> clinic_service.id
function resolveServiceId(jenis: string, sessions: number): number | null {
  const s = jenis.toLowerCase();
  if (s.includes('anak') && s.includes('3 bulan')) return 27; // Paket 3 Bulan (12 sesi)
  if (s.includes('anak') && s.includes('1 bulan')) return 26; // Paket 1 Bulan (4 sesi)
  if (s.includes('dewasa')) return 6; // Terapi Dewasa (4 sesi)
  // fallback by session count
  if (sessions >= 12) return 27;
  if (sessions <= 4) return 6;
  return null;
}

// Ruangan label (sheet) -> clinic_room.id ; else default by category
const ROOM_BY_NAME: Record<string, number> = {
  'terapi anak 1': 6,
  'terapi anak 2': 7,
  'sage room': 2,
  'mint room': 5,
  'sky room': 1,
  'forest room': 3,
  'sunset room': 4,
  playground: 9,
};
function resolveRoomId(ruangan: string | null, isAnak: boolean): number {
  if (ruangan) {
    const key = ruangan.trim().toLowerCase();
    if (ROOM_BY_NAME[key]) return ROOM_BY_NAME[key];
  }
  return isAnak ? 6 : 2; // Terapi Anak 1 : Sage Room
}

function normalizePhone(raw: string): string {
  let d = (raw || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('0')) d = '62' + d.slice(1);
  else if (d.startsWith('62')) d = d;
  else if (d.startsWith('8')) d = '62' + d;
  else d = '62' + d; // last resort
  return '+' + d;
}

function parseAge(raw: string | null): number | null {
  if (!raw) return null;
  const m = String(raw).match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

function categoryForAge(age: number | null): string {
  if (age == null) return 'dewasa';
  if (age < 12) return 'anak';
  if (age < 18) return 'remaja';
  return 'dewasa';
}

// `jam` decimal (e.g. 13.0, 8.3, 13.3) -> {h, m}. .3 => :30, .0 => :00 (single-digit tenths*10).
function parseJam(raw: unknown): { h: number; m: number } | null {
  if (raw == null || raw === '') return null;
  const v = typeof raw === 'number' ? raw : parseFloat(String(raw));
  if (!isFinite(v)) return null;
  const h = Math.floor(v);
  if (h < 0 || h > 23) return null;
  const tenths = Math.round((v - h) * 10); // 0.3 -> 3
  const m = tenths === 0 ? 0 : tenths * 10; // 3 -> 30
  return { h, m: m > 59 ? 0 : m };
}

interface ParsedDate {
  ymd: string | null; // 'yyyy-mm-dd' calendar day (WIB), or null if unparseable
  raw: string;
  reason?: string;
}
function parseDate(raw: string | null): ParsedDate {
  if (!raw) return { ymd: null, raw: '' };
  const s = String(raw).trim();
  if (!s) return { ymd: null, raw: s };
  if (s.includes('//')) return { ymd: null, raw: s, reason: 'malformed (double slash)' };

  // d/m/yyyy or d/m/yy
  const dmy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (dmy) {
    const [, dd, mm, yy] = dmy;
    let y = parseInt(yy, 10);
    if (y < 100) y += 2000;
    const d = parseInt(dd, 10);
    const mo = parseInt(mm, 10);
    if (mo < 1 || mo > 12 || d < 1 || d > 31)
      return { ymd: null, raw: s, reason: 'out-of-range d/m/y' };
    return { ymd: `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`, raw: s };
  }

  // ISO yyyy-mm-dd (parsed literally per user decision)
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const [, y, mo, d] = iso;
    const moN = parseInt(mo, 10);
    const dN = parseInt(d, 10);
    if (moN < 1 || moN > 12 || dN < 1 || dN > 31)
      return { ymd: null, raw: s, reason: 'out-of-range iso' };
    return { ymd: `${y}-${mo}-${d}`, raw: s };
  }

  return { ymd: null, raw: s, reason: 'unrecognized format' };
}

const TERAPI_KEYS = [
  'Terapi 1',
  'Terapi 2',
  'Terapi 3',
  'Terapi 4',
  'Terapi 5',
  'Terapi 6',
  'Terapi 7',
  'Terapi 8',
  'Terapi 9',
  'Terapi 10',
];
const JAM_KEYS = [
  'jam',
  'jam 2',
  'jam 3',
  'jam 4',
  'jam 5',
  'jam.1',
  'jam.2',
  'jam.3',
  'Unnamed: 27',
  'jam.4',
];

function titleCase(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function main() {
  const rows: any[] = JSON.parse(readFileSync(IMPORT_PATH, 'utf8'));
  const report: string[] = [];
  let clientsCreated = 0;
  let clientsUpdated = 0;
  let bookingsCreated = 0;
  let bookingsSkippedDup = 0;
  let datesSkipped = 0;

  for (const [i, row] of rows.entries()) {
    const rowNo = i + 1;
    const name = titleCase(String(row['nama'] || '').trim());
    const mrn = String(row['MRN'] || '').trim() || null;
    const gender =
      String(row['jenis kelamin'] || '')
        .trim()
        .toUpperCase() === 'L'
        ? 'L'
        : 'P';
    const age = parseAge(row['usia']);
    const phone = normalizePhone(row['Nomor Whatsapp']);
    const therapy = String(row['jenis layanan.1'] || '').trim();
    const sessionTotal = Number(row['jumlah pertemuan']) || 4;
    // Booking psikolog is sourced from the `terapis` column (the person who runs
    // the session), not `psikolog` (the assessing/consulting psychologist).
    const psikologName = String(row['terapis'] || '')
      .trim()
      .toLowerCase();
    const psikologUserId = PSIKOLOG[psikologName];
    const ruangan = row['Ruangan'] ? String(row['Ruangan']) : null;

    if (!name) {
      report.push(`Row ${rowNo}: SKIP — empty name`);
      continue;
    }
    if (!psikologUserId) {
      report.push(`Row ${rowNo} (${name}): SKIP — unknown psikolog "${row['psikolog']}"`);
      continue;
    }
    const serviceId = resolveServiceId(therapy, sessionTotal);
    if (!serviceId) {
      report.push(`Row ${rowNo} (${name}): SKIP — cannot map service "${therapy}"`);
      continue;
    }
    const isAnak = serviceId === 26 || serviceId === 27;
    const category = categoryForAge(age);

    // ---- upsert client by MRN (fallback: phone+name) ----
    let client = mrn
      ? await prisma.clinicClient.findUnique({ where: { medicalRecordNumber: mrn } })
      : await prisma.clinicClient.findFirst({ where: { phoneWa: phone, name } });

    const clientData = {
      name,
      gender,
      age: age ?? undefined,
      category,
      phoneWa: phone,
      preferredServiceType: therapy,
    };

    if (client) {
      if (COMMIT) {
        await prisma.clinicClient.update({ where: { id: client.id }, data: clientData });
      }
      clientsUpdated++;
    } else {
      if (COMMIT) {
        client = await prisma.clinicClient.create({
          data: { ...clientData, medicalRecordNumber: mrn },
        });
      } else {
        client = { id: -rowNo } as any; // placeholder for dry-run
      }
      clientsCreated++;
    }

    // ---- existing bookings for this client (dedupe by date) ----
    const existing =
      COMMIT && client!.id > 0
        ? await prisma.clinicBooking.findMany({
            where: { clientId: client!.id },
            select: { scheduledStart: true },
          })
        : [];
    const existingDays = new Set(
      existing.map((b) =>
        new Date(b.scheduledStart.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10),
      ),
    );

    // ---- collect parsed session dates ----
    const packageGroupId = randomUUID();
    let sessionN = 0;
    for (let k = 0; k < TERAPI_KEYS.length; k++) {
      const pd = parseDate(row[TERAPI_KEYS[k]]);
      if (!pd.raw) continue; // genuinely empty cell
      if (!pd.ymd) {
        datesSkipped++;
        report.push(
          `Row ${rowNo} (${name}) ${TERAPI_KEYS[k]}: SKIP date "${pd.raw}" — ${pd.reason}`,
        );
        continue;
      }
      sessionN++;
      const jam = parseJam(row[JAM_KEYS[k]]);
      const hh = String(jam ? jam.h : DEFAULT_HOUR).padStart(2, '0');
      const mm = String(jam ? jam.m : 0).padStart(2, '0');
      // Build the timestamp directly in WIB so it is not shifted by the server TZ.
      const start = new Date(`${pd.ymd}T${hh}:${mm}:00${WIB_OFFSET}`);
      const end = new Date(start.getTime() + 90 * 60 * 1000);
      const dayKey = pd.ymd; // dedupe on the WIB calendar day

      if (existingDays.has(dayKey)) {
        bookingsSkippedDup++;
        continue;
      }
      const status = start < NOW ? 'completed' : 'confirmed';
      const roomId = resolveRoomId(ruangan, isAnak);

      if (COMMIT) {
        await prisma.clinicBooking.create({
          data: {
            clientId: client!.id,
            serviceId,
            psikologUserId,
            roomId,
            scheduledStart: start,
            scheduledEnd: end,
            sessionN,
            sessionTotal,
            packageGroupId,
            status,
            confirmedAt: NOW,
            completedAt: status === 'completed' ? end : null,
            notes: 'Imported dari import-data-client.json',
          },
        });
      }
      existingDays.add(dayKey);
      bookingsCreated++;
    }
  }

  console.log('\n================ IMPORT REPORT ================');
  console.log(`Mode               : ${COMMIT ? 'COMMIT (writing to DB)' : 'DRY-RUN (no writes)'}`);
  console.log(`Rows processed     : ${rows.length}`);
  console.log(`Clients created    : ${clientsCreated}`);
  console.log(`Clients updated    : ${clientsUpdated}`);
  console.log(`Bookings created   : ${bookingsCreated}`);
  console.log(`Bookings deduped   : ${bookingsSkippedDup}`);
  console.log(`Dates skipped      : ${datesSkipped}`);
  console.log('----------------------------------------------');
  if (report.length) {
    console.log('SKIPS / WARNINGS:');
    for (const line of report) console.log('  • ' + line);
  } else {
    console.log('No skips.');
  }
  console.log('==============================================\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
