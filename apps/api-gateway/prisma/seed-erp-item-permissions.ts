/**
 * Seed 100 item-permissions: setiap md_item × semua adm_role.
 * Run: npx ts-node --project tsconfig.json prisma/seed-erp-item-permissions.ts
 *
 * Idempotent: upsert via unique key itemId_roleId — aman dijalankan ulang.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const items = await prisma.erpItem.findMany({
    where: { deletedAt: null },
    select: { id: true, code: true },
    orderBy: { id: 'asc' },
    take: 100,
  });

  const roles = await prisma.erpRole.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
  });

  if (items.length === 0) {
    console.log('Tidak ada item — jalankan seed items dulu.');
    return;
  }
  if (roles.length === 0) {
    console.log('Tidak ada role — jalankan seed roles dulu.');
    return;
  }

  console.log(`Seeding ${items.length} item × ${roles.length} role = ${items.length * roles.length} kombinasi...`);

  let upserted = 0;
  for (const item of items) {
    for (const role of roles) {
      await prisma.erpItemPermission.upsert({
        where: { itemId_roleId: { itemId: item.id, roleId: role.id } },
        update: {},
        create: {
          itemId: item.id,
          roleId: role.id,
          canView: true,
          canSell: true,
          canBuy: true,
        },
      });
      upserted++;
    }
  }

  console.log(`✓ ${upserted} izin item di-seed (${items.length} item × ${roles.length} role).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
