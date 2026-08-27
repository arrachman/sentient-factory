/**
 * Seed minimum untuk deployment nyata: hanya kerangka yang tanpanya aplikasi
 * tidak bisa dipakai — peran, menu + grant menu per peran, unit, tahun ajaran,
 * template WhatsApp, dan akun super admin.
 *
 * Berbeda dengan `prisma/seed.ts` (importir data contoh dari prototype), berkas
 * ini TIDAK memuat santri, pegawai, nilai, presensi, atau tagihan fiktif.
 * Inilah yang dijalankan `nuha-migrate` di docker-compose.
 */
import { PrismaClient, JenisKelamin } from '@prisma/client';
import bcrypt from 'bcryptjs';
import data from './proto-data.json';

const prisma = new PrismaClient();
type PrototypeData = Record<string, Array<Record<string, unknown>>>;
const source = data as PrototypeData;

const UNIT_ROWS = [
  { key: 'SMP', nama: 'SMP', deskripsi: 'Kelas 7–9, Kurikulum Merdeka.' },
  { key: 'MA', nama: 'MA', deskripsi: 'Kelas 10–12, IPA / IPS / Keagamaan.' },
  { key: 'Pondok', nama: 'Madin', deskripsi: 'Program Tahfidz dan Kitab Kuning.' },
  { key: 'Poskestren', nama: 'Poskestren', deskripsi: 'Layanan kesehatan santri.' },
];

const TAHUN_AJARAN_ROWS = [
  { kode: '2025/2026', semester: 'Gasal', aktif: false },
  { kode: '2026/2027', semester: 'Gasal', aktif: true },
];

async function seedPeranDanMenu() {
  const roles = await Promise.all(source.roles.map((row) => prisma.peran.upsert({
    where: { key: String(row.key) },
    create: { key: String(row.key), nama: String(row.nama) },
    update: { nama: String(row.nama) },
  })));
  const roleByKey = new Map(roles.map((role) => [role.key, role]));

  for (const [index, row] of source.menuDefs.entries()) {
    const menu = await prisma.menu.upsert({
      where: { key: String(row.key) },
      create: { key: String(row.key), label: String(row.label), icon: String(row.icon ?? ''), urutan: index },
      update: { label: String(row.label), icon: String(row.icon ?? ''), urutan: index },
    });
    for (const key of (row.roles as string[]) ?? []) {
      const role = roleByKey.get(key);
      if (!role) continue;
      await prisma.menuPeran.upsert({
        where: { menuId_peranId: { menuId: menu.id, peranId: role.id } },
        create: { menuId: menu.id, peranId: role.id },
        update: {},
      });
    }
  }
}

/** Sandi diambil dari SUPERADMIN_PASSWORD agar deployment nyata tak memakai sandi seed bersama. */
async function seedSuperAdmin() {
  const passwordHash = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD ?? 'Nuha2026!', 12);
  const peran = await prisma.peran.upsert({
    where: { key: 'superadmin' },
    create: { key: 'superadmin', nama: 'Super Admin' },
    update: { nama: 'Super Admin' },
  });
  const orang = await prisma.orang.upsert({
    where: { email: 'superadmin@nuha.pesantren.web.id' },
    create: { nama: 'Super Admin', jk: JenisKelamin.L, email: 'superadmin@nuha.pesantren.web.id', aktif: true },
    update: { aktif: true },
  });
  const user = await prisma.user.upsert({
    where: { orangId: orang.id },
    create: { orangId: orang.id, email: orang.email!, username: 'superadmin', passwordHash, unitScope: 'Semua unit', aktif: true },
    update: { username: 'superadmin', passwordHash, aktif: true },
  });
  await prisma.userPeran.upsert({
    where: { userId_peranId: { userId: user.id, peranId: peran.id } },
    create: { userId: user.id, peranId: peran.id },
    update: {},
  });
  for (const menu of await prisma.menu.findMany()) {
    await prisma.menuPeran.upsert({
      where: { menuId_peranId: { menuId: menu.id, peranId: peran.id } },
      create: { menuId: menu.id, peranId: peran.id },
      update: {},
    });
  }
}

async function main() {
  await seedPeranDanMenu();
  await Promise.all(UNIT_ROWS.map((row) => prisma.unit.upsert({ where: { key: row.key }, create: row, update: row })));
  await Promise.all(TAHUN_AJARAN_ROWS.map((row) => prisma.tahunAjaran.upsert({
    where: { kode_semester: { kode: row.kode, semester: row.semester } },
    create: row,
    update: { aktif: row.aktif },
  })));
  for (const row of source.waCases) {
    await prisma.templateWa.upsert({
      where: { kode: String(row.kode) },
      create: { kode: String(row.kode), role: String(row.role), judul: String(row.judul), pemicu: String(row.pemicu), waktu: String(row.waktu), isi: String(row.isi), aktif: Boolean(row.aktif) },
      update: { judul: String(row.judul), isi: String(row.isi) },
    });
  }
  await seedSuperAdmin();
  console.log('Seed dasar selesai: peran, menu, unit, tahun ajaran, template WA, superadmin.');
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma.$disconnect());
