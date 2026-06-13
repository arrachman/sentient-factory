/**
 * One-off: update 7 real psikolog accounts by name (match → user_id).
 *
 * Updates m0_users (full_name, username, email, phone, password_hash) +
 * clinic_psikolog_profile (title, specialty, license, default_slots,
 * weekly_availability, is_active) + clinic_psikolog_service junction.
 *
 * Decisions (confirmed with user 2026-06-12):
 *  - Quota harian encoded as weeklyAvailability slotIndices = earliest N slots [0..N-1].
 *  - Days not listed in quota → closed. Sunday always closed. Clinic has 6 slots.
 *  - Specialty: dewasa→klinis_dewasa, anak/remaja→anak_remaja, pasangan/keluarga as-is.
 *  - Services: explicit junction lists ("semua layanan" = all active services enumerated).
 *
 * Run: docker exec sentient-infra-api-gateway npx ts-node prisma/seed-clinic-update-psikolog.ts
 */
import { PrismaClient } from '@prisma/client';
import { pbkdf2Sync, randomBytes } from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const iterations = 210000;
  const digest = 'sha512';
  const derived = pbkdf2Sync(password, salt, iterations, 64, digest);
  return `pbkdf2$v1$${digest}$${iterations}$${salt.toString('base64')}$${derived.toString('base64')}`;
}

const DAY_KEYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;
type DayKey = (typeof DAY_KEYS)[number];

/** Build weeklyAvailability from a per-day quota map (earliest-N slots). */
function buildAvailability(quota: Partial<Record<DayKey, number>>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const day of DAY_KEYS) {
    const q = quota[day];
    if (day === 'sunday' || !q || q <= 0) {
      out[day] = { isOpen: false, slotIndices: [] };
    } else {
      out[day] = { isOpen: true, slotIndices: Array.from({ length: q }, (_, i) => i) };
    }
  }
  return out;
}

function maxQuota(quota: Partial<Record<DayKey, number>>): number {
  return Math.max(1, ...Object.values(quota).filter((v): v is number => typeof v === 'number'));
}

// Active services (id) — captured 2026-06-12. "Semua layanan" = this full set.
const ALL_ACTIVE = [1, 2, 3, 4, 5, 6, 7, 10, 11, 14, 15, 16, 20, 21, 22, 23, 24, 25, 26, 27, 28];
const except = (...ids: number[]) => ALL_ACTIVE.filter((s) => !ids.includes(s));
// Explicit list: konseling dewasa(1), konseling pasangan(4), tes kesehatan mental(25),
// konseling keluarga(5), terapi dewasa(6), terapi pasangan(7).
const CONS_THERAPY = [1, 4, 25, 5, 6, 7];

interface PsiUpdate {
  userId: number;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  license: string;
  specialty: string[];
  quota: Partial<Record<DayKey, number>>;
  services: number[];
}

const UPDATES: PsiUpdate[] = [
  {
    userId: 157,
    fullName: 'Laras Carissa Devinta',
    username: 'psi.laras',
    email: 'larascarissa8@gmail.com',
    phone: '+6281232422808',
    password: 'laras1234',
    license: '20221406-2023-01-0637',
    specialty: ['klinis_dewasa', 'pasangan', 'keluarga'],
    quota: { monday: 2, thursday: 2, friday: 2 },
    services: CONS_THERAPY,
  },
  {
    userId: 148,
    fullName: 'Aninditya Danaparamitha',
    username: 'psi.anin',
    email: 'anindityaparamitha@gmail.com',
    phone: '+6287815727380',
    password: 'anin1234',
    license: '20221399-2025-02-0798',
    specialty: ['klinis_dewasa', 'pasangan', 'anak_remaja'],
    quota: { monday: 4, tuesday: 4, thursday: 4, friday: 4, wednesday: 2, saturday: 3 },
    services: ALL_ACTIVE,
  },
  {
    userId: 153,
    fullName: 'Hervina Venera Affandi',
    username: 'psi.hervina',
    email: 'venerahervina@gmail.com',
    phone: '+6281216774336',
    password: 'hervina1234',
    license: '20240559-2024-2267',
    specialty: ['klinis_dewasa', 'pasangan', 'anak_remaja'],
    quota: { monday: 4, tuesday: 4, thursday: 4, friday: 4, wednesday: 2, saturday: 2 },
    services: ALL_ACTIVE,
  },
  {
    userId: 150,
    fullName: 'Ardhiafara Sidikka Utama',
    username: 'psi.fara',
    email: 'farasidikka@gmail.com',
    phone: '+6281351366611',
    password: 'fara1234',
    license: '20250406-2025-01-0573',
    specialty: ['klinis_dewasa', 'pasangan', 'anak_remaja'],
    quota: { monday: 4, tuesday: 4, wednesday: 4, friday: 4, saturday: 3 },
    services: ALL_ACTIVE,
  },
  {
    userId: 152,
    fullName: 'Bayu Aji Saputra',
    username: 'psi.bayu',
    email: 'bayu21311997@gmail.com',
    phone: '+6281326215016',
    password: 'bayu1234',
    license: '20241781-2025-01-1195',
    specialty: ['klinis_dewasa', 'pasangan', 'keluarga'],
    quota: { monday: 4, tuesday: 4, wednesday: 4, thursday: 4, friday: 4, saturday: 3 },
    services: CONS_THERAPY,
  },
  {
    userId: 156,
    fullName: 'Aulia Rachma',
    username: 'psi.aulia',
    email: 'auliarachma63@gmail.com',
    phone: '+6285257619372',
    password: 'aulia1234',
    license: '20241755-2025-01-1368',
    specialty: ['klinis_dewasa', 'anak_remaja', 'keluarga'],
    quota: { monday: 4, tuesday: 4, wednesday: 4, thursday: 4, friday: 4, saturday: 3 },
    services: except(4, 7, 25), // semua kecuali konseling pasangan, terapi pasangan, tes kesehatan mental
  },
  {
    userId: 151,
    fullName: 'Faradiba Permatahati',
    username: 'psi.diba',
    email: 'faradibapermatahati@gmail.com',
    phone: '+6282132979296',
    password: 'diba1234',
    license: '20220977-2025-01-0067',
    specialty: ['klinis_dewasa', 'anak_remaja', 'keluarga'],
    quota: { monday: 4, wednesday: 4, thursday: 4, tuesday: 3, saturday: 3 },
    services: except(4, 7), // semua kecuali konseling pasangan, terapi pasangan
  },
];

const TITLE = 'M.Psi., Psikolog';

async function main() {
  for (const u of UPDATES) {
    await prisma.$transaction(async (tx) => {
      // 1. Verify the record exists.
      const existing = await tx.user.findUnique({ where: { id: u.userId } });
      if (!existing) throw new Error(`user_id ${u.userId} not found (${u.fullName})`);

      // 2. Update auth/user fields.
      await tx.user.update({
        where: { id: u.userId },
        data: {
          fullName: u.fullName,
          username: u.username,
          email: u.email,
          phone: u.phone,
          passwordHash: hashPassword(u.password),
        },
      });

      // 3. Update psikolog profile.
      await tx.clinicPsikologProfile.update({
        where: { userId: u.userId },
        data: {
          title: TITLE,
          specialty: u.specialty,
          license: u.license,
          defaultSlots: maxQuota(u.quota),
          weeklyAvailability: buildAvailability(u.quota) as object,
          isActive: true,
        },
      });

      // 4. Replace service junction.
      await tx.clinicPsikologService.deleteMany({ where: { psikologUserId: u.userId } });
      if (u.services.length > 0) {
        await tx.clinicPsikologService.createMany({
          data: u.services.map((serviceId) => ({ psikologUserId: u.userId, serviceId })),
          skipDuplicates: true,
        });
      }
    });
    console.log(`✓ ${u.fullName} (id ${u.userId}) → ${u.username}, ${u.services.length} layanan`);
  }
  console.log(`\nDone: ${UPDATES.length} psikolog updated.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
