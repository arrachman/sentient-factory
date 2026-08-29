/**
 * Gabungkan dua baris Pegawai milik Alfan Jamil.
 *
 * "Alfan Jamil, M.Si, Gr" (GTT-MA-005, unit MA — dari DATA GURU.xlsx) dan
 * "Alfan Jamil" (AST-004, unit Madin — dari daftar asatidz) adalah orang yang
 * sama. Sejak migrasi `pegawai_multi_unit`, satu pegawai bisa bertugas di lebih
 * dari satu unit, jadi duplikatnya tidak perlu lagi.
 *
 * Yang dipertahankan: Pegawai GTT-MA-005 (punya tempat/tanggal lahir dan
 * komponen gaji). Baris Madin dilebur jadi penugasan `pegawai_unit` kedua,
 * gelar/panggilan dari baris Madin ("Gus", "Gus Alfan") dipindah ke Orang yang
 * bertahan, lalu Pegawai + Orang duplikat dihapus.
 *
 * Idempoten: aman dijalankan ulang.
 *
 *   npx tsx prisma/import/gabung-alfan-jamil.ts
 */
import { PrismaClient } from '@prisma/client';

const NIP_SIMPAN = 'GTT-MA-005';
const NIP_HAPUS = 'AST-004';

const prisma = new PrismaClient();

async function main() {
  const simpan = await prisma.pegawai.findUnique({
    where: { nip: NIP_SIMPAN },
    include: { orang: true },
  });
  if (!simpan) throw new Error(`pegawai ${NIP_SIMPAN} tidak ditemukan`);

  const hapus = await prisma.pegawai.findUnique({
    where: { nip: NIP_HAPUS },
    include: { orang: true },
  });

  if (!hapus) {
    console.log(`${NIP_HAPUS} sudah tidak ada — penggabungan tampaknya sudah dijalankan.`);
  } else {
    if (hapus.orang.nama.replace(/,.*$/, '').trim() !== 'Alfan Jamil') {
      throw new Error(`${NIP_HAPUS} bukan Alfan Jamil melainkan "${hapus.orang.nama}" — batal`);
    }

    // Penugasan Madin menjadi baris pegawai_unit kedua pada pegawai yang bertahan.
    if (hapus.unitId !== null) {
      await prisma.pegawaiUnit.upsert({
        where: { pegawaiId_unitId: { pegawaiId: simpan.id, unitId: hapus.unitId } },
        create: {
          pegawaiId: simpan.id,
          unitId: hapus.unitId,
          jabatan: hapus.jabatan,
          nip: hapus.nip,
          utama: false,
        },
        update: { jabatan: hapus.jabatan, nip: hapus.nip },
      });
    }

    // Gelar & panggilan hanya ada di baris Madin; nama resmi hanya di baris MA.
    await prisma.orang.update({
      where: { id: simpan.orangId },
      data: {
        nama: 'Alfan Jamil',
        gelar: simpan.orang.gelar ?? hapus.orang.gelar,
        panggilan: simpan.orang.panggilan ?? hapus.orang.panggilan,
        namaLengkap: simpan.orang.namaLengkap ?? hapus.orang.namaLengkap,
        hp: simpan.orang.hp ?? hapus.orang.hp,
        nik: simpan.orang.nik ?? hapus.orang.nik,
      },
    });

    // Pegawai ikut terhapus lewat cascade dari Orang.
    await prisma.orang.delete({ where: { id: hapus.orangId } });
    console.log(`Digabung: ${NIP_HAPUS} (unit ${hapus.unitId}) → ${NIP_SIMPAN}`);
  }

  // Pastikan unit utama juga tercatat di pegawai_unit (untuk baris lama).
  if (simpan.unitId !== null) {
    await prisma.pegawaiUnit.upsert({
      where: { pegawaiId_unitId: { pegawaiId: simpan.id, unitId: simpan.unitId } },
      create: {
        pegawaiId: simpan.id,
        unitId: simpan.unitId,
        jabatan: simpan.jabatan,
        nip: simpan.nip,
        utama: true,
      },
      update: { utama: true },
    });
  }

  const akhir = await prisma.pegawai.findUnique({
    where: { nip: NIP_SIMPAN },
    include: { orang: true, unitLain: { include: { unit: true } } },
  });
  console.log(
    `${akhir?.orang.nama} (${akhir?.orang.gelar ?? '-'}) bertugas di: ` +
      akhir?.unitLain.map((u) => `${u.unit.nama}${u.utama ? '*' : ''}`).join(', '),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
