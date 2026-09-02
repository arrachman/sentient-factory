import { readSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { bacaFilter, whereFilter, type FilterAkademik } from '../filter';

const JENJANG_SEKOLAH = ['SMP', 'MA'] as const;

function baris(nilai: Array<string | number | boolean | null | undefined>): string {
  return nilai
    .map((nilai) => {
      const teks = String(nilai ?? '');
      return /[",\n]/.test(teks) ? `"${teks.replace(/"/g, '""')}"` : teks;
    })
    .join(',');
}

function tanggal(nilai: Date | null): string {
  return nilai ? new Intl.DateTimeFormat('id-ID').format(nilai) : '';
}

function nomorWali(row: { wali: { hp: string | null } }): string {
  return row.wali.hp ?? '';
}

function ambilWali(
  relasi: Array<{
    utama: boolean;
    peran: string | null;
    wali: { nama: string; nik: string | null; hp: string | null; alamat: string | null };
    hubungan: string;
    nik: string | null;
    ttl: string | null;
    pekerjaan: string | null;
    pendidikan: string | null;
    pendapatan: string | null;
  }>,
  peran: string,
) {
  return relasi.find((row) => row.peran === peran) ?? relasi.find((row) => row.utama);
}

function dataWali(
  wali: ReturnType<typeof ambilWali>,
): Array<string | null | undefined> {
  if (!wali) return Array(10).fill('');
  return [
    wali.wali.nama,
    wali.hubungan,
    wali.nik ?? wali.wali.nik,
    wali.ttl,
    wali.pekerjaan,
    wali.pendidikan,
    wali.pendapatan,
    nomorWali(wali),
    wali.wali.alamat,
    wali.peran,
  ];
}

export async function GET(request: Request) {
  const session = await readSession();
  if (!session) return Response.json({ success: false, data: null, error: { code: 'UNAUTHORIZED', message: 'Perlu masuk.' } }, { status: 401 });

  const granted = await prisma.menuPeran.count({ where: { menu: { key: 'akademik' }, peran: { key: { in: session.peran } } } });
  if (!granted) return Response.json({ success: false, data: null, error: { code: 'FORBIDDEN', message: 'Tidak berwenang mengakses akademik.' } }, { status: 403 });

  const searchParams = Object.fromEntries(new URL(request.url).searchParams.entries());
  const filter = bacaFilter(searchParams) as FilterAkademik;
  const where = {
    AND: [
      whereFilter(filter),
      { unit: { jenjang: { in: [...JENJANG_SEKOLAH] } } },
    ],
  };
  const siswa = await prisma.santri.findMany({
    where,
    include: {
      orang: {
        include: {
          sebagaiAnak: {
            include: { wali: true },
            orderBy: [{ utama: 'desc' }, { peran: 'asc' }],
          },
          desa: true,
        },
      },
      unit: true,
      kelas: true,
      kamar: { include: { asrama: true } },
    },
    orderBy: { orang: { nama: 'asc' } },
  });

  const header = [
    'NIS', 'NISN', 'Nama', 'NIK', 'Jenis Kelamin', 'Tempat Lahir', 'Tanggal Lahir',
    'Unit', 'Jenjang', 'Kelas', 'Tingkat', 'Program', 'Tahun Masuk', 'Status', 'Asrama', 'Kamar',
    'Alamat', 'RT', 'RW', 'Kelurahan/Desa', 'Kecamatan', 'Kabupaten/Kota', 'Desa ID', 'Wilayah lengkap', 'Kode pos', 'No. KK',
    'Anak Ke', 'Jumlah Saudara', 'Hobi', 'Cita-cita', 'Asal Sekolah', 'Pendidikan Terakhir', 'No. HP', 'Email',
    'Nama Ayah', 'Hubungan Ayah', 'NIK Ayah', 'TTL Ayah', 'Pekerjaan Ayah', 'Pendidikan Ayah', 'Pendapatan Ayah', 'HP Ayah', 'Alamat Ayah', 'Peran Ayah',
    'Nama Ibu', 'Hubungan Ibu', 'NIK Ibu', 'TTL Ibu', 'Pekerjaan Ibu', 'Pendidikan Ibu', 'Pendapatan Ibu', 'HP Ibu', 'Alamat Ibu', 'Peran Ibu',
    'Nama Wali', 'Hubungan Wali', 'NIK Wali', 'TTL Wali', 'Pekerjaan Wali', 'Pendidikan Wali', 'Pendapatan Wali', 'HP Wali', 'Alamat Wali', 'Peran Wali',
  ];
  const csv = [
    baris(header),
    ...siswa.map((santri) => {
      const { orang } = santri;
      const ayah = ambilWali(orang.sebagaiAnak, 'Ayah');
      const ibu = ambilWali(orang.sebagaiAnak, 'Ibu');
      const wali = ambilWali(orang.sebagaiAnak, 'Wali');
      return baris([
        santri.nis, santri.nisn, orang.nama, orang.nik, orang.jk, orang.tmpLahir, tanggal(orang.tglLahir),
        santri.unit?.nama, santri.unit?.jenjang, santri.kelas?.nama, santri.kelas?.tingkat, santri.program, santri.tahunMasuk, santri.status,
        santri.kamar?.asrama.nama, santri.kamar?.kode,
        orang.alamat, orang.rt, orang.rw, orang.kelurahan, orang.kecamatan, orang.kabupaten,
        orang.desaId ? String(orang.desaId) : null, orang.desa?.namaLengkap, orang.kodePos ?? orang.desa?.kodePos, orang.noKk,
        orang.anakKe, orang.jumlahSaudara, orang.hobi, orang.citaCita, orang.asalSekolah, orang.pendidikanTerakhir, orang.hp, orang.email,
        ...dataWali(ayah), ...dataWali(ibu), ...dataWali(wali),
      ]);
    }),
  ].join('\r\n');

  return new Response(`﻿${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="data-siswa-smp-ma.csv"',
    },
  });
}
