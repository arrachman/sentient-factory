import { PrismaClient, JenisKelamin, StatusPendaftar, StatusSantri } from '@prisma/client';
import bcrypt from 'bcryptjs';
import data from './proto-data.json';

const prisma = new PrismaClient();
type PrototypeData = Record<string, Array<Record<string, unknown>>>;
const source = data as PrototypeData;

const parseDate = (value: unknown): Date => {
  const text = String(value ?? '22 Agu 2026').replace(/–/g, '-');
  const match = text.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)\s+(\d{4})/);
  if (!match) return new Date('2026-08-22T00:00:00Z');
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11 };
  return new Date(Date.UTC(Number(match[3]), months[match[2]], Number(match[1])));
};

const gender = (value: unknown): JenisKelamin => String(value) === 'P' ? JenisKelamin.P : JenisKelamin.L;
const pendaftarStatus = (value: unknown): StatusPendaftar => {
  const statuses: Record<string, StatusPendaftar> = { Baru: 'Baru', Verifikasi: 'Verifikasi', Seleksi: 'Seleksi', Lulus: 'Lulus', 'Tidak Lulus': 'TidakLulus', 'Daftar Ulang': 'DaftarUlang' };
  return statuses[String(value)] ?? 'Baru';
};

async function main() {
  // This is an initial demo-data importer, not a synchronization process. Once
  // users exist, preserve operational data entered through the application.
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('Seed skipped: database already contains users.');
    return;
  }

  const passwordHash = await bcrypt.hash('Nuha2026!', 12);

  const roles = await Promise.all(source.roles.map((row) => prisma.peran.upsert({
    where: { key: String(row.key) },
    create: { key: String(row.key), nama: String(row.nama) },
    update: { nama: String(row.nama) },
  })));
  const roleByKey = new Map(roles.map((role) => [role.key, role]));

  const unitRows = [
    { key: 'SMP', nama: 'SMP Nurul Huda Mergosono', deskripsi: 'Kelas 7–9, Kurikulum Merdeka, 12 rombel.' },
    { key: 'MA', nama: 'MA Nurul Huda Mergosono', deskripsi: 'Kelas 10–12, IPA / IPS / Keagamaan.' },
    { key: 'Pondok', nama: 'Pondok Pesantren', deskripsi: 'Program Tahfidz dan Kitab Kuning.' },
    { key: 'Poskestren', nama: 'Poskestren', deskripsi: 'Layanan kesehatan santri.' },
  ];
  const units = await Promise.all(unitRows.map((row) => prisma.unit.upsert({ where: { key: row.key }, create: row, update: row })));
  const unitByKey = new Map(units.map((unit) => [unit.key, unit]));

  const asramaByName = new Map<string, { id: number }>();
  for (const row of source.asrama) {
    const asrama = await prisma.asrama.upsert({
      where: { nama: String(row.nama) },
      create: { nama: String(row.nama), jk: gender(row.jk), kapasitas: Number(row.kapasitas), musyrif: String(row.musyrif) },
      update: { kapasitas: Number(row.kapasitas), musyrif: String(row.musyrif) },
    });
    asramaByName.set(asrama.nama, asrama);
    for (const kamar of (row.kamarList as unknown[][]) ?? []) {
      await prisma.kamar.upsert({
        where: { asramaId_kode: { asramaId: asrama.id, kode: String(kamar[0]) } },
        create: { asramaId: asrama.id, kode: String(kamar[0]), kapasitas: Number(kamar[1]) },
        update: { kapasitas: Number(kamar[1]) },
      });
    }
  }

  const santriByName = new Map<string, { id: bigint }>();
  for (const row of source.santri) {
    const unit = unitByKey.get(String(row.unit));
    const kelas = unit ? await prisma.kelas.upsert({
      where: { unitId_nama: { unitId: unit.id, nama: String(row.kelas) } },
      create: { unitId: unit.id, nama: String(row.kelas), tingkat: String(row.kelas).replace(/[^0-9X]/g, '') || '-' },
      update: {},
    }) : null;
    const asrama = asramaByName.get(String(row.asrama));
    const kamar = asrama ? await prisma.kamar.findUnique({ where: { asramaId_kode: { asramaId: asrama.id, kode: String(row.kamar) } } }) : null;
    const orang = await prisma.orang.upsert({
      where: { email: `santri.${String(row.nis)}@nuha.local` },
      create: { nama: String(row.nama), jk: gender(row.jk), email: `santri.${String(row.nis)}@nuha.local`, alamat: String(row.alamat), hp: String(row.hpWali) },
      update: { nama: String(row.nama), alamat: String(row.alamat), hp: String(row.hpWali) },
    });
    const santri = await prisma.santri.upsert({
      where: { orangId: orang.id },
      create: { orangId: orang.id, nis: String(row.nis), nisn: String(row.nisn), unitId: unit?.id, kelasId: kelas?.id, kamarId: kamar?.id, status: String(row.status) === 'Mukim' ? StatusSantri.Mukim : StatusSantri.Kalong, program: String(row.program), tahunMasuk: String(row.masuk) },
      update: { unitId: unit?.id, kelasId: kelas?.id, kamarId: kamar?.id, program: String(row.program) },
    });
    santriByName.set(String(row.nama), santri);
    const wali = await prisma.orang.upsert({
      where: { email: `wali.${String(row.nis)}@nuha.local` },
      create: { nama: String(row.wali), jk: JenisKelamin.L, hp: String(row.hpWali), email: `wali.${String(row.nis)}@nuha.local` },
      update: { hp: String(row.hpWali) },
    });
    await prisma.relasiWali.upsert({ where: { waliId_anakId: { waliId: wali.id, anakId: orang.id } }, create: { waliId: wali.id, anakId: orang.id, hubungan: 'Orang Tua', pekerjaan: String(row.pekerjaan) }, update: {} });
  }

  for (const row of source.users) {
    const role = roles.find((item) => item.nama === row.peran || String(row.peran).startsWith(item.nama)) ?? roleByKey.get('ketua')!;
    const orang = await prisma.orang.upsert({ where: { email: String(row.email) }, create: { nama: String(row.nama), jk: JenisKelamin.L, email: String(row.email), aktif: Boolean(row.aktif) }, update: { nama: String(row.nama), aktif: Boolean(row.aktif) } });
    const user = await prisma.user.upsert({ where: { orangId: orang.id }, create: { orangId: orang.id, email: String(row.email), passwordHash, unitScope: String(row.unit), aktif: Boolean(row.aktif) }, update: { passwordHash, aktif: Boolean(row.aktif) } });
    await prisma.userPeran.upsert({ where: { userId_peranId: { userId: user.id, peranId: role.id } }, create: { userId: user.id, peranId: role.id }, update: {} });
  }

  for (const [index, row] of source.menuDefs.entries()) {
    const menu = await prisma.menu.upsert({ where: { key: String(row.key) }, create: { key: String(row.key), label: String(row.label), icon: String(row.icon ?? ''), urutan: index }, update: { label: String(row.label), urutan: index } });
    for (const key of (row.roles as string[]) ?? []) {
      const role = roleByKey.get(key);
      if (role) await prisma.menuPeran.upsert({ where: { menuId_peranId: { menuId: menu.id, peranId: role.id } }, create: { menuId: menu.id, peranId: role.id }, update: {} });
    }
  }

  for (const row of source.pegawai) {
    const unit = unitByKey.get(String(row.unit));
    const orang = await prisma.orang.upsert({ where: { email: `pegawai.${String(row.nip)}@nuha.local` }, create: { nama: String(row.nama), jk: JenisKelamin.L, email: `pegawai.${String(row.nip)}@nuha.local` }, update: { nama: String(row.nama) } });
    const pegawai = await prisma.pegawai.upsert({ where: { orangId: orang.id }, create: { orangId: orang.id, nip: String(row.nip), unitId: unit?.id, jabatan: String(row.jabatan), status: String(row.status), rekening: String(row.rek) }, update: { jabatan: String(row.jabatan), status: String(row.status), rekening: String(row.rek) } });
    await prisma.komponenGaji.upsert({ where: { pegawaiId: pegawai.id }, create: { pegawaiId: pegawai.id, pokok: Number(row.pokok), tunjJab: Number(row.tunjJab), tunjKel: Number(row.tunjKel), jamMengajar: Number(row.jam), tarifJam: Number(row.tarifJam), transport: Number(row.transport), bpjs: Number(row.bpjs), koperasi: Number(row.koperasi), pph: Number(row.pph) }, update: {} });
  }

  for (const row of source.pendaftar) await prisma.pendaftar.upsert({ where: { noReg: String(row.noReg) }, create: { noReg: String(row.noReg), nama: String(row.nama), pilihan: String(row.pilihan), asalSekolah: String(row.asal), tglDaftar: parseDate(row.tgl), nilai: Number(row.nilai), status: pendaftarStatus(row.status) }, update: { status: pendaftarStatus(row.status), nilai: Number(row.nilai) } });
  for (const row of source.obat) await prisma.obat.upsert({ where: { nama: String(row.nama) }, create: { nama: String(row.nama), satuan: String(row.satuan), kategori: String(row.kategori), stok: Number(row.stok), stokMin: Number(row.min), kadaluarsa: String(row.exp) }, update: { stok: Number(row.stok) } });
  for (const [index, row] of source.kegiatanHarian.entries()) await prisma.kegiatanHarian.upsert({ where: { id: index + 1 }, create: { id: index + 1, jam: String(row.jam), nama: String(row.nama), ket: String(row.ket), urutan: index }, update: { nama: String(row.nama) } });
  for (const row of source.halaqah) await prisma.halaqah.create({ data: { nama: String(row.nama), ustadz: String(row.ustadz), waktu: String(row.waktu), tempat: String(row.tempat), jenjang: String(row.jenjang), anggota: Number(row.anggota) } }).catch(() => undefined);
  for (const row of source.pengumumanSantri) await prisma.pengumuman.create({ data: { tgl: parseDate(row.tgl), judul: String(row.judul), isi: String(row.isi), target: 'Santri' } }).catch(() => undefined);
  for (const row of source.agenda) await prisma.agenda.create({ data: { tgl: parseDate(row.tgl), jam: String(row.jam), judul: String(row.judul), unit: String(row.unit) } }).catch(() => undefined);
  for (const row of source.waCases) await prisma.templateWa.upsert({ where: { kode: String(row.kode) }, create: { kode: String(row.kode), role: String(row.role), judul: String(row.judul), pemicu: String(row.pemicu), waktu: String(row.waktu), isi: String(row.isi), aktif: Boolean(row.aktif) }, update: { aktif: Boolean(row.aktif) } });

  // Transactional records — only for santri that resolved by name.
  const findSantri = (value: unknown) => santriByName.get(String(value));

  for (const row of source.setoran) {
    const santri = findSantri(row.santri);
    if (santri) await prisma.hafalan.create({ data: { santriId: santri.id, tgl: parseDate(row.tgl), surat: String(row.surat), ayat: String(row.ayat), jenis: String(row.jenis), nilai: String(row.nilai), penguji: String(row.penguji) } });
  }
  for (const row of source.tazir) {
    const santri = findSantri(row.santri);
    if (santri) await prisma.tazir.create({ data: { santriId: santri.id, tgl: parseDate(row.tgl), pelanggaran: String(row.pelanggaran), poin: Number(row.poin), sanksi: String(row.sanksi), petugas: String(row.petugas) } });
  }
  for (const row of source.izinList) {
    const santri = findSantri(row.santri);
    if (santri) await prisma.izin.upsert({ where: { kode: String(row.id) }, create: { kode: String(row.id), santriId: santri.id, jenis: String(row.alasan).split('—')[0].trim(), alasan: String(row.alasan), penjemput: String(row.penjemput), keluarAt: parseDate(row.keluar), kembaliAt: parseDate(row.kembali), status: ['Menunggu', 'Disetujui', 'Ditolak', 'Selesai'].includes(String(row.status)) ? (String(row.status) as never) : 'Menunggu' }, update: {} });
  }
  for (const row of source.kunjungan) {
    const santri = findSantri(row.santri);
    if (santri) await prisma.rekamMedis.create({ data: { santriId: santri.id, tgl: parseDate(row.tgl), jam: String(row.jam), keluhan: String(row.keluhan), diagnosis: String(row.diagnosis), terapi: String(row.terapi), tindakLanjut: String(row.lanjut), petugas: String(row.petugas) } });
  }
  for (const row of source.kunjunganWali) {
    const santri = findSantri(row.santri);
    if (santri) await prisma.kunjungan.create({ data: { santriId: santri.id, namaWali: String(row.wali ?? row.penjenguk ?? 'Wali'), hubungan: String(row.hubungan ?? ''), tgl: parseDate(row.tgl), jamMasuk: String(row.jam ?? row.masuk ?? ''), keperluan: String(row.keperluan ?? ''), status: String(row.status ?? 'Terjadwal') } });
  }
  for (const row of source.tagihanRows) {
    const santri = findSantri(row.santri);
    if (!santri) continue;
    const tagihan = await prisma.tagihan.upsert({ where: { kode: String(row.id) }, create: { kode: String(row.id), santriId: santri.id, jenis: String(row.jenis), periode: String(row.periode), nominal: Number(row.nominal), dibayar: Number(row.bayar), jatuhTempo: parseDate(row.jatuh) }, update: { dibayar: Number(row.bayar) } });
    if (Number(row.bayar) > 0) await prisma.pembayaran.create({ data: { tagihanId: tagihan.id, tgl: parseDate(row.jatuh), nominal: Number(row.bayar), metode: 'Transfer BSI' } }).catch(() => undefined);
  }
  for (const row of source.transaksi) {
    await prisma.transaksiKas.upsert({ where: { kode: String(row.kode) }, create: { kode: String(row.kode), tgl: parseDate(row.tgl), uraian: String(row.uraian), kategori: String(row.kategori), metode: String(row.metode), arah: Number(row.nominal) >= 0 ? 'Masuk' : 'Keluar', nominal: Math.abs(Number(row.nominal)) }, update: {} });
  }

  console.log('Seed complete: 20 santri, 12 pegawai, 18 pendaftar, and operational master data.');
  console.log('Demo login: ketua@nuha.pesantren.web.id / Nuha2026!');
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => prisma.$disconnect());
