/**
 * Seed Clinic (Althea Psychology) — independent dari prisma/seed.ts (ERP).
 *
 * Run: `npm run db:seed:clinic` di apps/api-gateway/
 *
 * Idempotent: pakai upsert by unique key. Aman di-run berulang.
 *
 * Yang di-seed di Slice 0:
 * - 6 clinic-* roles
 * - 6 clinic-* permissions (basic, granular per slice nanti)
 * - 6 dev users (1 per role) password Test1234!
 * - 7 sample psikolog dengan ClinicPsikologProfile
 * - 1 ClinicSettings row default
 *
 * Yang di-DEFER ke slice tersendiri (table belum ada di Slice 0):
 * - 16 services (Slice 2)
 * - 11 rooms (Slice 3)
 * - 5 sample clients (Slice 5)
 * - 18 WA templates (Slice 8)
 */

import { PrismaClient } from '@prisma/client';
import { pbkdf2Sync, randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const iterations = 210000;
  const digest = 'sha512';
  const derived = pbkdf2Sync(password, salt, iterations, 64, digest);
  return `pbkdf2$v1$${digest}$${iterations}$${salt.toString('base64')}$${derived.toString('base64')}`;
}

const CLINIC_ROLES = [
  {
    name: 'clinic-admin',
    description: 'Clinic admin — full scheduling & operational control',
  },
  {
    name: 'clinic-psikolog',
    description: 'Psychologist — own schedule + clinical notes',
  },
  {
    name: 'clinic-owner',
    description: 'Clinic owner — KPI dashboard & analytics',
  },
  {
    name: 'clinic-resepsionis',
    description: 'Front desk — check-in & walk-in booking',
  },
  {
    name: 'clinic-marketing',
    description: 'Marketing — read-only service catalog & capacity',
  },
  {
    name: 'clinic-intern',
    description: 'Intern — minimal access placeholder',
  },
];

const CLINIC_PERMISSIONS = [
  // Booking
  { name: 'clinic.booking.read', module: 'clinic.booking', action: 'read' },
  { name: 'clinic.booking.write', module: 'clinic.booking', action: 'write' },
  // Psikolog
  { name: 'clinic.psikolog.read', module: 'clinic.psikolog', action: 'read' },
  { name: 'clinic.psikolog.write', module: 'clinic.psikolog', action: 'write' },
  // Service
  { name: 'clinic.service.read', module: 'clinic.service', action: 'read' },
  { name: 'clinic.service.write', module: 'clinic.service', action: 'write' },
  // Settings
  { name: 'clinic.settings.write', module: 'clinic.settings', action: 'write' },
];

// Map role → permission names yang di-grant
const ROLE_PERMISSIONS: Record<string, string[]> = {
  'clinic-admin': CLINIC_PERMISSIONS.map((p) => p.name), // all
  'clinic-psikolog': ['clinic.booking.read', 'clinic.psikolog.read'],
  'clinic-owner': [
    'clinic.booking.read',
    'clinic.psikolog.read',
    'clinic.service.read',
  ],
  'clinic-resepsionis': [
    'clinic.booking.read',
    'clinic.booking.write',
    'clinic.psikolog.read',
  ],
  'clinic-marketing': ['clinic.service.read', 'clinic.psikolog.read'],
  'clinic-intern': [],
};

const DEV_USERS = [
  {
    email: 'admin@althea.local',
    username: 'clinic-admin',
    fullName: 'Clinic Admin',
    role: 'clinic-admin',
  },
  {
    email: 'psikolog@althea.local',
    username: 'clinic-psikolog',
    fullName: 'Dr. Psikolog Demo, M.Psi',
    role: 'clinic-psikolog',
  },
  {
    email: 'owner@althea.local',
    username: 'clinic-owner',
    fullName: 'Clinic Owner',
    role: 'clinic-owner',
  },
  {
    email: 'resepsionis@althea.local',
    username: 'clinic-resepsionis',
    fullName: 'Front Desk',
    role: 'clinic-resepsionis',
  },
  {
    email: 'marketing@althea.local',
    username: 'clinic-marketing',
    fullName: 'Marketing Demo',
    role: 'clinic-marketing',
  },
  {
    email: 'intern@althea.local',
    username: 'clinic-intern',
    fullName: 'Intern Demo',
    role: 'clinic-intern',
  },
];

// 7 sample psikolog mengikuti althea-data.jsx (mockup)
const SAMPLE_PSIKOLOG = [
  {
    email: 'farah@althea.local',
    username: 'farah-rahmadhani',
    fullName: 'Farah Rahmadhani, M.Psi',
    title: 'M.Psi',
    specialty: ['klinis_dewasa', 'pasangan'],
    color: '#5b8a66',
    license: 'SIPP-DEMO-001',
  },
  {
    email: 'budi@althea.local',
    username: 'budi-santoso',
    fullName: 'Budi Santoso, M.Psi',
    title: 'M.Psi',
    specialty: ['anak_remaja'],
    color: '#c97a5d',
    license: 'SIPP-DEMO-002',
  },
  {
    email: 'rina@althea.local',
    username: 'rina-amalia',
    fullName: 'Rina Amalia, M.Psi',
    title: 'M.Psi',
    specialty: ['klinis_dewasa', 'tes_psikologi'],
    color: '#6f8aa3',
    license: 'SIPP-DEMO-003',
  },
  {
    email: 'dimas@althea.local',
    username: 'dimas-pratama',
    fullName: 'Dimas Pratama, M.Psi',
    title: 'M.Psi',
    specialty: ['anak_remaja', 'terapi_anak'],
    color: '#9c7c3c',
    license: 'SIPP-DEMO-004',
  },
  {
    email: 'sari@althea.local',
    username: 'sari-puspita',
    fullName: 'Sari Puspita, M.Psi',
    title: 'M.Psi',
    specialty: ['pasangan', 'keluarga'],
    color: '#7aa382',
    license: 'SIPP-DEMO-005',
  },
  {
    email: 'aditya@althea.local',
    username: 'aditya-nugraha',
    fullName: 'Aditya Nugraha, M.Psi',
    title: 'M.Psi',
    specialty: ['klinis_dewasa'],
    color: '#3a4f4f',
    license: 'SIPP-DEMO-006',
  },
  {
    email: 'mira@althea.local',
    username: 'mira-cahyani',
    fullName: 'Mira Cahyani, M.Psi',
    title: 'M.Psi',
    specialty: ['terapi_anak', 'tumbuh_kembang'],
    color: '#e3a895',
    license: 'SIPP-DEMO-007',
  },
];

const DEFAULT_OPERATING_HOURS = {
  monday: { open: '09:00', close: '18:00', isOpen: true },
  tuesday: { open: '09:00', close: '18:00', isOpen: true },
  wednesday: { open: '09:00', close: '18:00', isOpen: true },
  thursday: { open: '09:00', close: '18:00', isOpen: true },
  friday: { open: '09:00', close: '18:00', isOpen: true },
  saturday: { open: '10:00', close: '16:00', isOpen: true },
  sunday: { open: null, close: null, isOpen: false },
};

async function seedRoles() {
  console.log('  Seeding clinic-* roles...');
  const roleMap = new Map<string, number>();
  for (const r of CLINIC_ROLES) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: {
        description: r.description,
        isSystem: false,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        name: r.name,
        description: r.description,
        isSystem: false,
      },
    });
    roleMap.set(r.name, role.id);
  }
  return roleMap;
}

async function seedPermissions() {
  console.log('  Seeding clinic-* permissions...');
  const permMap = new Map<string, number>();
  for (const p of CLINIC_PERMISSIONS) {
    const perm = await prisma.permission.upsert({
      where: { name: p.name },
      update: {
        module: p.module,
        action: p.action,
        deletedAt: null,
        deletedBy: null,
      },
      create: p,
    });
    permMap.set(p.name, perm.id);
  }
  return permMap;
}

async function seedRolePermissions(
  roleMap: Map<string, number>,
  permMap: Map<string, number>,
) {
  console.log('  Linking roles → permissions...');
  for (const [roleName, permNames] of Object.entries(ROLE_PERMISSIONS)) {
    const roleId = roleMap.get(roleName);
    if (!roleId) continue;
    for (const permName of permNames) {
      const permissionId = permMap.get(permName);
      if (!permissionId) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId } },
        update: { deletedAt: null, deletedBy: null },
        create: { roleId, permissionId },
      });
    }
  }
}

async function seedDevUsers(roleMap: Map<string, number>) {
  console.log('  Seeding 6 dev users (Test1234!)...');
  const passwordHash = await hashPassword('Test1234!');
  for (const u of DEV_USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        username: u.username,
        fullName: u.fullName,
        passwordHash,
        isActive: true,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        email: u.email,
        username: u.username,
        fullName: u.fullName,
        passwordHash,
        isActive: true,
      },
    });
    const roleId = roleMap.get(u.role);
    if (roleId) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId } },
        update: { deletedAt: null, deletedBy: null },
        create: { userId: user.id, roleId },
      });
    }
  }
}

async function seedSamplePsikolog(roleMap: Map<string, number>) {
  console.log('  Seeding 7 sample psikolog + profiles...');
  const passwordHash = await hashPassword('Test1234!');
  const psikologRoleId = roleMap.get('clinic-psikolog');
  if (!psikologRoleId) {
    console.warn('  ⚠️  clinic-psikolog role not found, skip sample psikolog');
    return;
  }
  for (const p of SAMPLE_PSIKOLOG) {
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {
        username: p.username,
        fullName: p.fullName,
        passwordHash,
        isActive: true,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        email: p.email,
        username: p.username,
        fullName: p.fullName,
        passwordHash,
        isActive: true,
      },
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: psikologRoleId } },
      update: { deletedAt: null, deletedBy: null },
      create: { userId: user.id, roleId: psikologRoleId },
    });
    await prisma.clinicPsikologProfile.upsert({
      where: { userId: user.id },
      update: {
        title: p.title,
        specialty: p.specialty,
        color: p.color,
        license: p.license,
        defaultSlots: 4,
        isActive: true,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        userId: user.id,
        title: p.title,
        specialty: p.specialty,
        color: p.color,
        license: p.license,
        defaultSlots: 4,
      },
    });
  }
}

async function seedClinicSettings() {
  console.log('  Seeding clinic_settings (single row)...');
  await prisma.clinicSettings.upsert({
    where: { id: 1 },
    update: {
      operatingHours: DEFAULT_OPERATING_HOURS,
      holidays: [],
    },
    create: {
      id: 1,
      clinicName: 'Althea Psychology',
      timezone: 'Asia/Jakarta',
      currency: 'IDR',
      operatingHours: DEFAULT_OPERATING_HOURS,
      holidays: [],
      bufferMinutes: 15,
      taxEnabled: true,
      taxPercentage: 11.0,
      dpPercentage: 50.0,
      waSendEnabled: false,
      waCountryCode: '+62',
    },
  });
}

async function main() {
  console.log('🌱 Seeding Clinic (Althea Psychology) data...');

  const roleMap = await seedRoles();
  const permMap = await seedPermissions();
  await seedRolePermissions(roleMap, permMap);
  await seedDevUsers(roleMap);
  await seedSamplePsikolog(roleMap);
  await seedClinicSettings();

  console.log('✅ Clinic seed complete.');
  console.log('   Dev login: admin@althea.local / Test1234!');
  console.log('   (also psikolog@, owner@, resepsionis@, marketing@, intern@)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
