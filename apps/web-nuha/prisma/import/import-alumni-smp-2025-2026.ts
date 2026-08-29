/**
 * Catat 24 siswa kelas IX-A SMP Nurul Huda sebagai LULUS tahun ajaran
 * 2025/2026, dari data diri siswa yang diserahkan operator (berkas "DATA
 * DIRI SISWA TAHUN AJARAN 2025/2026 KELAS 9"). Data ditulis literal di
 * berkas ini agar sumbernya satu dan bisa di-review lewat git, mengikuti
 * pola `import-siswa-ma-2025.ts`.
 *
 * SEMUA 24 NIK di sumber ini SUDAH ADA di `Orang` (santri lama). 18 dari
 * 24 sudah aktif sebagai santri `Mukim` di MA Kelas 1 (TA 2026/2027) —
 * mereka TIDAK boleh ditulis ulang jadi `Santri.status = Alumni` karena satu
 * `Orang` cuma boleh punya satu baris `Santri` aktif (akan menghapus status
 * MA aktif mereka). Karena itu kelulusan SMP ini dicatat di
 * `RiwayatPendidikan` (riwayat jenjang, terpisah dari peran aktif), bukan
 * dengan mengubah `Santri` yang ada.
 *
 * Baris "Contoh pengisian" (Puji Utami) di sumber SENGAJA dilewati — itu
 * baris instruksi template, bukan siswa sungguhan.
 *
 * Jalankan: `npm run import:alumni-smp-2025`
 */
import { prisma } from '@/lib/prisma';
import { recordAudit } from '@/lib/audit';
import { JenisKelamin, StatusSantri } from '@prisma/client';

const AKTOR_SKRIP = { nama: 'Importir alumni SMP 2025/2026 (skrip)' };
const KODE_UNIT = 'SMP';
const KODE_TA = '2025/2026';
const SEMESTER_TA = 'Gasal';
const NAMA_KELAS = 'IX-A';
const TINGKAT_KELAS = '9';

type BarisSiswa = {
  no: number;
  nama: string;
  ttl: string;
  jk: JenisKelamin;
  nik: string;
  nisn: string;
  alamat: string;
  rt: string;
  rw: string;
};

const DATA: BarisSiswa[] = [
  { no: 1, nama: 'Achmad Tsaaqib As-Syawwali', ttl: 'Malang, 12 September 2010', jk: JenisKelamin.P, nik: '3573031209100001', nisn: '0105377373', alamat: 'Jl. Kol. Sugiono III B/7, Kel. Mergosono, Kec. Kedungkandang, Kota Malang', rt: '4', rw: '5' },
  { no: 2, nama: "Addafi Syar'i Muhammad", ttl: 'Malang, 25 Juli 2011', jk: JenisKelamin.L, nik: '3573032507110005', nisn: '0116651628', alamat: 'Jl. Kol. Sugiono III A/249, Kel. Mergosono, Kec. Kedungkandang, Kota Malang', rt: '5', rw: '4' },
  { no: 3, nama: 'Ade Gita Fadilah', ttl: 'Malang, 25 Januari 2011', jk: JenisKelamin.L, nik: '3573036501110003', nisn: '0116130624', alamat: 'Jl. Kol. Sugiono VA/175, Kel. Mergosono, Kec. Kedungkandang, Kota Malang', rt: '4', rw: '3' },
  { no: 4, nama: 'Aisyah Aulia Mutiara Putri', ttl: 'Malang, 19 November 2010', jk: JenisKelamin.P, nik: '3573025911100005', nisn: '0103605635', alamat: 'Jl. KH. Ahmad Dahan I/465, Kel. Sukoharjo, Kec. Klojen, Kota Malang', rt: '4', rw: '2' },
  { no: 5, nama: 'Alisyah Hikmah Maulana', ttl: 'Malang, 22 Februari 2011', jk: JenisKelamin.P, nik: '3573036202110008', nisn: '0116201580', alamat: 'Jl. Muharto VII/33, Kel. Kota Lama, Kec. Kedungkandang, Kota Malang', rt: '8', rw: '7' },
  { no: 6, nama: 'Dewi Aisar', ttl: 'Malang, 05 November 2010', jk: JenisKelamin.P, nik: '3573034511100006', nisn: '0106738352', alamat: 'Jl. Kol. Sugiono III B/37, Kel. Mergosono, Kec. Kedungkandang, Kota Malang', rt: '7', rw: '5' },
  { no: 7, nama: 'Dzaki Rohmatullah', ttl: 'Malang, 25 September 2010', jk: JenisKelamin.L, nik: '3573032509100003', nisn: '0105685773', alamat: 'Jl. Kol. Sugiono 3B, Kel. Mergosono, Kec. Kedungkandang, Kota Malang', rt: '9', rw: '5' },
  { no: 8, nama: 'Errena Tembang Sosialista Tazheva', ttl: 'Medan, 05 Februari 2011', jk: JenisKelamin.P, nik: '1271184502110001', nisn: '0112234300', alamat: 'Jl. Park Line 20 Blok B5 No. 38, Desa Pasirkembang, Kec. Maja, Kab. Lebak, Banten', rt: '1', rw: '4' },
  { no: 9, nama: 'Gus Ramadhani', ttl: 'Malang, 14 Agustus 2010', jk: JenisKelamin.L, nik: '3573011408100006', nisn: '0102492388', alamat: 'Jl. Jodipan Wetan Gg 1, Kel. Jodipan, Kec. Blimbing, Kota Malang', rt: '14', rw: '7' },
  { no: 10, nama: 'Khairan Muhamad Alghifari', ttl: 'Sukabumi, 05 Februari 2009', jk: JenisKelamin.L, nik: '3202400502090001', nisn: '0096790373', alamat: 'Kp. Babakan, Desa Jambenenggang, Kec. Kebonpedes, Kab. Sukabumi', rt: '1', rw: '4' },
  { no: 11, nama: 'M. Uwais Qorne', ttl: 'Selong, 14 Desember 2010', jk: JenisKelamin.L, nik: '5202121412100002', nisn: '0102393298', alamat: 'Teratak, Desa Teratak, Kec. Batukliang Utara, Kab. Lombok Tengah', rt: '', rw: '' },
  { no: 12, nama: 'Maulana Malik Ibrahim', ttl: 'Malang, 07 Mei 2010', jk: JenisKelamin.L, nik: '3573030705100004', nisn: '0103763965', alamat: 'Jl. Kol. Sugiono IIIB, Kel. Mergosono, Kec. Kedungkandang, Kota Malang', rt: '7', rw: '5' },
  { no: 13, nama: 'Maulana Ridwan Aqilah', ttl: 'Malang, 23 September 2010', jk: JenisKelamin.L, nik: '3573032309100001', nisn: '0103968096', alamat: 'Jl. Kol. Sugiono IIIB/52, Kel. Mergosono, Kec. Kedungkandang, Kota Malang', rt: '4', rw: '5' },
  { no: 14, nama: 'Muchammad Akbar Octavino', ttl: 'Malang, 26 Oktober 2010', jk: JenisKelamin.L, nik: '3573042610100004', nisn: '0103287113', alamat: 'Perum Karang Duren Permai Blok D-20, Kel. Karangduren, Kec. Pakisaji, Kab. Malang', rt: '1', rw: '7' },
  { no: 15, nama: 'Muhammad', ttl: 'Malang, 07 Mei 2010', jk: JenisKelamin.L, nik: '3573030705100006', nisn: '0102454863', alamat: 'Dusun Krajan, Desa Ngroto, Kec. Pujon, Kab. Malang', rt: '14', rw: '7' },
  { no: 16, nama: 'Muhammad Fathian Akbar Al Aqil', ttl: 'Malang, 08 November 2010', jk: JenisKelamin.L, nik: '3507170811100002', nisn: '3109188544', alamat: 'Dusun Bayang, Desa Pandansari Lor, Kec. Jabung, Kab. Malang', rt: '14', rw: '1' },
  { no: 17, nama: 'Muhammad Irvan Azis', ttl: 'Malang, 17 Mei 2009', jk: JenisKelamin.L, nik: '3573031705090003', nisn: '0096834239', alamat: 'Jl. Kol. Sugiono IIIC/42, Kel. Mergosono, Kec. Kedungkandang, Kota Malang', rt: '12', rw: '4' },
  { no: 18, nama: "Mutma'inatus Zahro", ttl: 'Blora, 03 Desember 2009', jk: JenisKelamin.P, nik: '3316054312090002', nisn: '3100628774', alamat: 'Nglanjuk, Desa Nglanjuk, Kec. Cepu, Kab. Blora', rt: '1', rw: '2' },
  { no: 19, nama: 'Nafisa Isna Asyari', ttl: 'Malang, 15 Juni 2010', jk: JenisKelamin.P, nik: '3573035506100001', nisn: '0106484216', alamat: 'Jl. Lembayung, Kel. Bumiayu, Kec. Kedungkandang, Kota Malang', rt: '12', rw: '2' },
  { no: 20, nama: 'Naura Ahlam Mahfuzhah', ttl: 'Malang, 29 April 2011', jk: JenisKelamin.P, nik: '3507216904110001', nisn: '0113953717', alamat: 'Jl. Raya Pandanlandung, Kel. Pandanlandung, Kec. Wagir, Kab. Malang', rt: '5', rw: '1' },
  { no: 21, nama: 'Nia Putri Ramadhani', ttl: 'Malang, 19 Agustus 2010', jk: JenisKelamin.P, nik: '3573035908100007', nisn: '0106480375', alamat: 'Jl. Kol. Sugiono IIIB/25, Kel. Mergosono, Kec. Kedungkandang, Kota Malang', rt: '6', rw: '5' },
  { no: 22, nama: 'Shinta Aulia Anggoro Kasih', ttl: 'Malang, 03 Mei 2010', jk: JenisKelamin.P, nik: '3573014305100004', nisn: '0109197482', alamat: 'Jl. Jodipan Wetan I/19, Kel. Jodipan, Kec. Blimbing, Kota Malang', rt: '16', rw: '6' },
  { no: 23, nama: 'Siti Munawaroh', ttl: 'Malang, 23 Juni 2010', jk: JenisKelamin.P, nik: '3573036306100001', nisn: '0106785796', alamat: 'Jl. Kyai Parseh Jaya, Kel. Bumiayu, Kec. Kedungkandang, Kota Malang', rt: '4', rw: '1' },
  { no: 24, nama: 'Siti Roudloh', ttl: 'Malang, 29 Oktober 2010', jk: JenisKelamin.P, nik: '3507246910100002', nisn: '0105290110', alamat: 'Bunut, Kel. Tunjungtirto, Kec. Singosari, Kota Malang', rt: '6', rw: '5' },
];

async function jalankan(): Promise<void> {
  const unit = await prisma.unit.findUniqueOrThrow({ where: { key: KODE_UNIT } });
  const tahunAjaran = await prisma.tahunAjaran.upsert({
    where: { kode_semester: { kode: KODE_TA, semester: SEMESTER_TA } },
    create: { kode: KODE_TA, semester: SEMESTER_TA },
    update: {},
  });
  console.log(`Menulis ${DATA.length} riwayat kelulusan SMP kelas ${NAMA_KELAS} (TA ${KODE_TA} ${SEMESTER_TA})...`);

  for (const s of DATA) {
    const orang = await prisma.orang.findUniqueOrThrow({ where: { nik: s.nik }, select: { id: true } });
    await prisma.riwayatPendidikan.upsert({
      where: { orangId_unitId_tahunAjaranId: { orangId: orang.id, unitId: unit.id, tahunAjaranId: tahunAjaran.id } },
      create: {
        orangId: orang.id, unitId: unit.id, kelasNama: NAMA_KELAS, tingkat: TINGKAT_KELAS,
        tahunAjaranId: tahunAjaran.id, status: StatusSantri.Alumni,
      },
      update: { kelasNama: NAMA_KELAS, tingkat: TINGKAT_KELAS, status: StatusSantri.Alumni },
    });
  }

  await recordAudit({
    aksi: 'import',
    entitas: 'Santri',
    entitasId: 'batch',
    ringkasan: `Impor alumni SMP kelas ${NAMA_KELAS} TA ${KODE_TA} ${SEMESTER_TA}: ${DATA.length} siswa.`,
    aktor: AKTOR_SKRIP,
  });

  console.log(`Selesai. ${DATA.length} Santri alumni SMP di-upsert.`);
}

jalankan()
  .catch((error) => {
    console.error('Galat tak terduga saat impor alumni SMP:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
