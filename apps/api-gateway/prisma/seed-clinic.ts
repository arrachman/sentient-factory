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
import { CLINIC_ROLES, CLINIC_PERMISSIONS, ROLE_PERMISSIONS, DEV_USERS, SAMPLE_PSIKOLOG, DEFAULT_OPERATING_HOURS } from './seed-clinic-data';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const iterations = 210000;
  const digest = 'sha512';
  const derived = pbkdf2Sync(password, salt, iterations, 64, digest);
  return `pbkdf2$v1$${digest}$${iterations}$${salt.toString('base64')}$${derived.toString('base64')}`;
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
