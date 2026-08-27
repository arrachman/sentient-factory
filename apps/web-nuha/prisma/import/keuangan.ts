/**
 * Importir CSV keuangan: tagihan SPP, pembayaran, komponen gaji, transaksi
 * kas. Dijalankan lewat `npm run import:keuangan -- --tagihan <path>
 * --pembayaran <path> --gaji <path> --kas <path>` (semua flag opsional,
 * hanya berkas yang diberikan yang diproses).
 *
 * Prinsip:
 * - Validasi SELURUH baris dari SELURUH berkas dulu, kumpulkan semua galat.
 *   Kalau ada satu saja galat, TIDAK ADA yang ditulis ke DB dan proses
 *   keluar dengan exit code 1.
 * - Idempoten: upsert berbasis kode unik (Tagihan.kode, TransaksiKas.kode)
 *   atau kombinasi tagihan+tgl+nominal+ref untuk Pembayaran.
 * - `Tagihan.dibayar` selalu dihitung ulang dari SUM(Pembayaran), kolom
 *   `dibayar` di CSV tagihan hanya dipakai sebagai nilai awal saat insert.
 */
import { prisma } from '@/lib/prisma';
import { recordAudit } from '@/lib/audit';
import { parseCsv } from './lib/csv';
import { keAngka, keTanggal, keArahKas } from './lib/nilai';
import { readFileSync } from 'node:fs';

type Galat = { berkas: string; baris: number; pesan: string };

const AKTOR_SKRIP = { nama: 'Importir CSV (skrip)' };

/** Baca argumen CLI berbentuk `--nama nilai`. */
const bacaArgumen = (argv: string[]): Record<string, string> => {
  const hasil: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) {
      const kunci = argv[i].slice(2);
      hasil[kunci] = argv[i + 1] ?? '';
      i += 1;
    }
  }
  return hasil;
};

const bacaCsv = (path: string): Record<string, string>[] => parseCsv(readFileSync(path, 'utf-8'));

const HEADER_TAGIHAN = ['kode', 'nisn', 'nama_santri', 'jenis', 'periode', 'nominal', 'dibayar', 'jatuh_tempo'];
const HEADER_PEMBAYARAN = ['kode_tagihan', 'tgl', 'nominal', 'metode', 'ref'];
const HEADER_GAJI = ['nip', 'nama_pegawai', 'unit', 'pokok', 'tunj_jab', 'tunj_kel', 'jam_mengajar', 'tarif_jam', 'transport', 'bpjs', 'koperasi', 'pph', 'rekening'];
const HEADER_KAS = ['kode', 'tgl', 'uraian', 'kategori', 'metode', 'arah', 'nominal'];

const validasiHeader = (baris: Record<string, string>[], header: string[], berkas: string, galat: Galat[]): void => {
  if (baris.length === 0) return;
  const kolomAda = new Set(Object.keys(baris[0]));
  const kurang = header.filter((kolom) => !kolomAda.has(kolom));
  if (kurang.length > 0) {
    galat.push({ berkas, baris: 0, pesan: `header kurang kolom: ${kurang.join(', ')}` });
  }
};

type SiapTagihan = { kode: string; nisnClean: string; santriId: bigint; jenis: string; periode: string; nominal: number; dibayarAwal: number; jatuhTempo: Date };

/** Validasi + siapkan baris tagihan. Mengumpulkan galat, tidak melempar. */
async function siapkanTagihan(baris: Record<string, string>[], berkas: string, galat: Galat[]): Promise<SiapTagihan[]> {
  validasiHeader(baris, HEADER_TAGIHAN, berkas, galat);
  const hasil: SiapTagihan[] = [];
  const kodeTerlihat = new Set<string>();

  for (const [idx, row] of baris.entries()) {
    const noBaris = idx + 2; // +1 header, +1 basis-1
    try {
      const kode = row.kode?.trim();
      if (!kode) throw new Error('kode tagihan kosong');
      if (kodeTerlihat.has(kode)) throw new Error(`kode "${kode}" duplikat di dalam berkas`);
      kodeTerlihat.add(kode);

      const nisn = row.nisn?.trim();
      if (!nisn) throw new Error('nisn kosong');
      const santri = await prisma.santri.findUnique({ where: { nisn }, select: { id: true } });
      if (!santri) throw new Error(`nisn "${nisn}" tidak ditemukan di data santri`);

      const jenis = row.jenis?.trim();
      if (!jenis) throw new Error('jenis tagihan kosong');
      const periode = row.periode?.trim();
      if (!periode) throw new Error('periode kosong');

      const nominal = keAngka(row.nominal, 'nominal');
      const dibayarAwal = keAngka(row.dibayar, 'dibayar');
      const jatuhTempo = keTanggal(row.jatuh_tempo, 'jatuh_tempo');

      hasil.push({ kode, nisnClean: nisn, santriId: santri.id, jenis, periode, nominal, dibayarAwal, jatuhTempo });
    } catch (error) {
      galat.push({ berkas, baris: noBaris, pesan: error instanceof Error ? error.message : String(error) });
    }
  }
  return hasil;
}

type SiapPembayaran = { kodeTagihan: string; tgl: Date; nominal: number; metode: string; ref: string | null };

async function siapkanPembayaran(baris: Record<string, string>[], berkas: string, galat: Galat[], kodeTagihanValid: Set<string>): Promise<SiapPembayaran[]> {
  validasiHeader(baris, HEADER_PEMBAYARAN, berkas, galat);
  const hasil: SiapPembayaran[] = [];

  for (const [idx, row] of baris.entries()) {
    const noBaris = idx + 2;
    try {
      const kodeTagihan = row.kode_tagihan?.trim();
      if (!kodeTagihan) throw new Error('kode_tagihan kosong');

      const tersediaDiDb = kodeTagihanValid.has(kodeTagihan)
        || (await prisma.tagihan.findUnique({ where: { kode: kodeTagihan }, select: { id: true } })) !== null;
      if (!tersediaDiDb) throw new Error(`kode_tagihan "${kodeTagihan}" tidak ditemukan (tidak ada di DB maupun berkas tagihan yang diimpor bersamaan)`);

      const tgl = keTanggal(row.tgl, 'tgl');
      const nominal = keAngka(row.nominal, 'nominal');
      const metode = row.metode?.trim();
      if (!metode) throw new Error('metode kosong');
      const ref = row.ref?.trim() || null;

      hasil.push({ kodeTagihan, tgl, nominal, metode, ref });
    } catch (error) {
      galat.push({ berkas, baris: noBaris, pesan: error instanceof Error ? error.message : String(error) });
    }
  }
  return hasil;
}

type SiapGaji = {
  pegawaiId: bigint; nip: string; pokok: number; tunjJab: number; tunjKel: number;
  jamMengajar: number; tarifJam: number; transport: number; bpjs: number; koperasi: number; pph: number;
};

async function siapkanGaji(baris: Record<string, string>[], berkas: string, galat: Galat[]): Promise<SiapGaji[]> {
  validasiHeader(baris, HEADER_GAJI, berkas, galat);
  const hasil: SiapGaji[] = [];
  const nipTerlihat = new Set<string>();

  for (const [idx, row] of baris.entries()) {
    const noBaris = idx + 2;
    try {
      const nip = row.nip?.trim();
      if (!nip) throw new Error('nip kosong');
      if (nipTerlihat.has(nip)) throw new Error(`nip "${nip}" duplikat di dalam berkas`);
      nipTerlihat.add(nip);

      const pegawai = await prisma.pegawai.findUnique({ where: { nip }, select: { id: true } });
      if (!pegawai) throw new Error(`nip "${nip}" tidak ditemukan di data pegawai`);

      const pokok = keAngka(row.pokok, 'pokok');
      const tunjJab = keAngka(row.tunj_jab, 'tunj_jab');
      const tunjKel = keAngka(row.tunj_kel, 'tunj_kel');
      const jamMengajar = keAngka(row.jam_mengajar, 'jam_mengajar');
      const tarifJam = keAngka(row.tarif_jam, 'tarif_jam');
      const transport = keAngka(row.transport, 'transport');
      const bpjs = keAngka(row.bpjs, 'bpjs');
      const koperasi = keAngka(row.koperasi, 'koperasi');
      const pph = keAngka(row.pph, 'pph');

      hasil.push({ pegawaiId: pegawai.id, nip, pokok, tunjJab, tunjKel, jamMengajar, tarifJam, transport, bpjs, koperasi, pph });
    } catch (error) {
      galat.push({ berkas, baris: noBaris, pesan: error instanceof Error ? error.message : String(error) });
    }
  }
  return hasil;
}

type SiapKas = { kode: string; tgl: Date; uraian: string; kategori: string; metode: string; arah: 'Masuk' | 'Keluar'; nominal: number };

async function siapkanKas(baris: Record<string, string>[], berkas: string, galat: Galat[]): Promise<SiapKas[]> {
  validasiHeader(baris, HEADER_KAS, berkas, galat);
  const hasil: SiapKas[] = [];
  const kodeTerlihat = new Set<string>();

  for (const [idx, row] of baris.entries()) {
    const noBaris = idx + 2;
    try {
      const kode = row.kode?.trim();
      if (!kode) throw new Error('kode kas kosong');
      if (kodeTerlihat.has(kode)) throw new Error(`kode "${kode}" duplikat di dalam berkas`);
      kodeTerlihat.add(kode);

      const tgl = keTanggal(row.tgl, 'tgl');
      const uraian = row.uraian?.trim();
      if (!uraian) throw new Error('uraian kosong');
      const kategori = row.kategori?.trim();
      if (!kategori) throw new Error('kategori kosong');
      const metode = row.metode?.trim();
      if (!metode) throw new Error('metode kosong');
      const arah = keArahKas(row.arah, 'arah');
      const nominal = keAngka(row.nominal, 'nominal');

      hasil.push({ kode, tgl, uraian, kategori, metode, arah, nominal });
    } catch (error) {
      galat.push({ berkas, baris: noBaris, pesan: error instanceof Error ? error.message : String(error) });
    }
  }
  return hasil;
}

async function tulisAudit(aksi: string, entitas: string, entitasId: string, ringkasan: string): Promise<void> {
  // Skrip CLI tidak punya aktor sesi asli; recordAudit menerima aktor
  // opsional jadi kita pakai label generik agar tetap tercatat di audit log.
  await recordAudit({ aksi, entitas, entitasId, ringkasan, aktor: AKTOR_SKRIP });
}

async function jalankan(): Promise<void> {
  const argumen = bacaArgumen(process.argv.slice(2));
  const galat: Galat[] = [];

  const pathTagihan = argumen.tagihan;
  const pathPembayaran = argumen.pembayaran;
  const pathGaji = argumen.gaji;
  const pathKas = argumen.kas;

  if (!pathTagihan && !pathPembayaran && !pathGaji && !pathKas) {
    console.error('Tidak ada berkas diberikan. Pakai --tagihan/--pembayaran/--gaji/--kas <path>.');
    process.exitCode = 1;
    return;
  }

  const dataTagihan = pathTagihan ? bacaCsv(pathTagihan) : [];
  const dataPembayaran = pathPembayaran ? bacaCsv(pathPembayaran) : [];
  const dataGaji = pathGaji ? bacaCsv(pathGaji) : [];
  const dataKas = pathKas ? bacaCsv(pathKas) : [];

  const siapTagihan = pathTagihan ? await siapkanTagihan(dataTagihan, pathTagihan, galat) : [];
  const kodeTagihanValid = new Set(siapTagihan.map((t) => t.kode));
  const siapPembayaran = pathPembayaran ? await siapkanPembayaran(dataPembayaran, pathPembayaran, galat, kodeTagihanValid) : [];
  const siapGaji = pathGaji ? await siapkanGaji(dataGaji, pathGaji, galat) : [];
  const siapKas = pathKas ? await siapkanKas(dataKas, pathKas, galat) : [];

  // Duplikat kode tagihan lintas file tidak relevan; tapi duplikat kode
  // tagihan vs kode kas (beda tabel) tidak masalah karena unique per model.

  if (galat.length > 0) {
    console.error(`Ditemukan ${galat.length} galat validasi. Tidak ada data yang ditulis ke DB.\n`);
    for (const g of galat) {
      const lokasi = g.baris > 0 ? `${g.berkas}:${g.baris}` : g.berkas;
      console.error(`  - [${lokasi}] ${g.pesan}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Validasi lolos. Menulis ke database...');

  const tagihanIdByKode = new Map<string, bigint>();
  for (const t of siapTagihan) {
    const tagihan = await prisma.tagihan.upsert({
      where: { kode: t.kode },
      create: {
        kode: t.kode,
        santriId: t.santriId,
        jenis: t.jenis,
        periode: t.periode,
        nominal: t.nominal,
        dibayar: t.dibayarAwal,
        jatuhTempo: t.jatuhTempo,
      },
      update: {
        santriId: t.santriId,
        jenis: t.jenis,
        periode: t.periode,
        nominal: t.nominal,
        jatuhTempo: t.jatuhTempo,
      },
    });
    tagihanIdByKode.set(t.kode, tagihan.id);
  }
  if (siapTagihan.length > 0) {
    console.log(`Tagihan: ${siapTagihan.length} baris di-upsert.`);
    await tulisAudit('import', 'Tagihan', 'batch', `Impor CSV: ${siapTagihan.length} tagihan (${pathTagihan}).`);
  }

  const tagihanTerdampak = new Set<bigint>();
  for (const p of siapPembayaran) {
    const tagihanId = tagihanIdByKode.get(p.kodeTagihan)
      ?? (await prisma.tagihan.findUniqueOrThrow({ where: { kode: p.kodeTagihan }, select: { id: true } })).id;

    // Idempoten: kombinasi tagihan+tgl+nominal+metode+ref dianggap identitas
    // pembayaran karena tabel ini tidak punya kolom kode unik sendiri.
    const existing = await prisma.pembayaran.findFirst({
      where: { tagihanId, tgl: p.tgl, nominal: p.nominal, metode: p.metode, ref: p.ref },
      select: { id: true },
    });
    if (!existing) {
      await prisma.pembayaran.create({
        data: { tagihanId, tgl: p.tgl, nominal: p.nominal, metode: p.metode, ref: p.ref },
      });
    }
    tagihanTerdampak.add(tagihanId);
  }

  for (const tagihanId of tagihanTerdampak) {
    const agregat = await prisma.pembayaran.aggregate({ where: { tagihanId }, _sum: { nominal: true } });
    await prisma.tagihan.update({
      where: { id: tagihanId },
      data: { dibayar: agregat._sum.nominal ?? 0 },
    });
  }
  if (siapPembayaran.length > 0) {
    console.log(`Pembayaran: ${siapPembayaran.length} baris diproses, ${tagihanTerdampak.size} tagihan dihitung ulang.`);
    await tulisAudit('import', 'Pembayaran', 'batch', `Impor CSV: ${siapPembayaran.length} pembayaran (${pathPembayaran}), ${tagihanTerdampak.size} tagihan dihitung ulang.`);
  }

  for (const g of siapGaji) {
    await prisma.komponenGaji.upsert({
      where: { pegawaiId: g.pegawaiId },
      create: {
        pegawaiId: g.pegawaiId,
        pokok: g.pokok,
        tunjJab: g.tunjJab,
        tunjKel: g.tunjKel,
        jamMengajar: g.jamMengajar,
        tarifJam: g.tarifJam,
        transport: g.transport,
        bpjs: g.bpjs,
        koperasi: g.koperasi,
        pph: g.pph,
      },
      update: {
        pokok: g.pokok,
        tunjJab: g.tunjJab,
        tunjKel: g.tunjKel,
        jamMengajar: g.jamMengajar,
        tarifJam: g.tarifJam,
        transport: g.transport,
        bpjs: g.bpjs,
        koperasi: g.koperasi,
        pph: g.pph,
      },
    });
  }
  if (siapGaji.length > 0) {
    console.log(`KomponenGaji: ${siapGaji.length} baris di-upsert.`);
    await tulisAudit('import', 'KomponenGaji', 'batch', `Impor CSV: ${siapGaji.length} komponen gaji (${pathGaji}).`);
  }

  for (const k of siapKas) {
    await prisma.transaksiKas.upsert({
      where: { kode: k.kode },
      create: { kode: k.kode, tgl: k.tgl, uraian: k.uraian, kategori: k.kategori, metode: k.metode, arah: k.arah, nominal: k.nominal },
      update: { tgl: k.tgl, uraian: k.uraian, kategori: k.kategori, metode: k.metode, arah: k.arah, nominal: k.nominal },
    });
  }
  if (siapKas.length > 0) {
    console.log(`TransaksiKas: ${siapKas.length} baris di-upsert.`);
    await tulisAudit('import', 'TransaksiKas', 'batch', `Impor CSV: ${siapKas.length} transaksi kas (${pathKas}).`);
  }

  console.log('Selesai.');
}

jalankan()
  .catch((error) => {
    console.error('Galat tak terduga saat impor:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
