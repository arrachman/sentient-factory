import { prisma } from '@/lib/prisma';
import { recordAudit } from '@/lib/audit';
import type { Field } from './types';

/**
 * Satu baris `orang` adalah identitas dasar; perannya (santri, guru, staf,
 * wali) hidup di tabel lain. Operator dulu harus membuat orang lebih dahulu
 * lalu membuka modul Santri/Kepegawaian dan menyalin ID-nya. Field virtual di
 * bawah memindahkan langkah itu ke dalam form: pilih peran sekali, barisnya
 * dibuatkan di sini setelah identitas tersimpan.
 */
export const PERAN_ORANG = ['santri', 'guru', 'staf', 'wali', 'belum'] as const;
export type PeranOrang = (typeof PERAN_ORANG)[number];

const LABEL_PERAN: Record<PeranOrang, string> = {
  santri: 'Santri',
  guru: 'Guru',
  staf: 'Staf',
  wali: 'Wali murid',
  belum: 'Belum ditentukan',
};

const HUBUNGAN_WALI = ['Ayah', 'Ibu', 'Wali'];

const tampilBila = (sama: PeranOrang[]) => ({ field: 'peranOrang', sama: [...sama] as string[] });

/** Field virtual: tidak ada kolomnya di tabel `orang`. */
export const FIELD_PERAN: Field[] = [
  {
    name: 'peranOrang',
    label: 'Daftarkan sebagai',
    type: 'select',
    required: true,
    virtual: true,
    span: 3,
    group: 'Peran',
    options: [...PERAN_ORANG],
    optionLabels: LABEL_PERAN,
    hint: 'Menentukan modul tempat orang ini ikut terdaftar.',
  },
  {
    name: 'peranNis',
    label: 'NIS',
    type: 'text',
    virtual: true,
    group: 'Peran',
    tampilBila: tampilBila(['santri']),
    hint: 'Kosongkan bila belum ada.',
    placeholder: '2026001',
  },
  {
    name: 'peranStatusSantri',
    label: 'Status santri',
    type: 'select',
    virtual: true,
    group: 'Peran',
    options: ['Mukim', 'Kalong'],
    tampilBila: tampilBila(['santri']),
  },
  {
    name: 'peranNip',
    label: 'NIP',
    type: 'text',
    virtual: true,
    group: 'Peran',
    tampilBila: tampilBila(['guru', 'staf']),
    hint: 'Kosongkan untuk dibuatkan otomatis.',
    placeholder: '198701012010011001',
  },
  {
    name: 'peranJabatan',
    label: 'Jabatan',
    type: 'text',
    virtual: true,
    group: 'Peran',
    tampilBila: tampilBila(['guru', 'staf']),
    placeholder: 'Guru Mapel / Tata Usaha',
    hint: 'Menentukan kategori: yang memuat kata "Guru" terbaca sebagai guru.',
  },
  {
    // Jabatan struktural (SK) sengaja terpisah dari `peranJabatan`: kategori
    // orang disimpulkan dari `jabatan`, jadi menaruh "Waka Kurikulum" di sana
    // akan membuat guru terbaca staf. Lihat FILTER_KATEGORI_ORANG di bawah.
    name: 'peranTugasTambahan',
    label: 'Tugas tambahan / jabatan struktural',
    type: 'text',
    virtual: true,
    span: 3,
    group: 'Peran',
    tampilBila: tampilBila(['guru', 'staf']),
    placeholder: 'Waka Kurikulum / Wali Kelas 10',
    hint: 'Opsional. Jabatan dari SK, bukan penentu hak akses menu.',
  },
  {
    name: 'peranWali',
    label: 'Wali santri ini',
    type: 'orang-banyak',
    virtual: true,
    span: 3,
    group: 'Peran',
    hubungan: HUBUNGAN_WALI,
    tampilBila: tampilBila(['santri']),
    placeholder: 'Klik untuk melihat daftar, atau ketik nama…',
    hint: 'Boleh lebih dari satu; yang pertama jadi wali utama.',
  },
  {
    name: 'peranAnak',
    label: 'Santri yang diwalikan',
    type: 'orang-banyak',
    virtual: true,
    span: 3,
    group: 'Peran',
    hubungan: HUBUNGAN_WALI,
    hanyaSantri: true,
    tampilBila: tampilBila(['wali']),
    placeholder: 'Klik untuk melihat daftar santri…',
    hint: 'Boleh lebih dari satu santri.',
  },
];

/**
 * Peran orang tidak disimpan sebagai kolom — ia disimpulkan dari relasi
 * (baris `santri`, `pegawai`, atau relasi wali). Jadi filternya berupa field
 * virtual dengan peta nilai → klausa `where` Prisma. "Guru" adalah himpunan
 * bagian dari "Pegawai" (dibedakan lewat kata "Guru" di `jabatan`), sesuai
 * badge peran di tabel yang menyebut semua baris `pegawai` sebagai Pegawai.
 */
export const FILTER_KATEGORI_ORANG: Field = {
  name: 'kategoriOrang',
  label: 'Peran',
  type: 'select',
  virtual: true,
  hanyaFilter: true,
  options: ['santri', 'guru', 'pegawai', 'wali', 'belum'],
  optionLabels: { santri: 'Santri', guru: 'Guru', pegawai: 'Pegawai', wali: 'Wali', belum: 'Tanpa peran' },
  filterWhere: {
    santri: { santri: { isNot: null } },
    guru: { pegawai: { is: { jabatan: { contains: 'Guru' } } } },
    pegawai: { pegawai: { isNot: null } },
    wali: { waliDari: { some: {} } },
    // Orang yang belum terhubung ke modul mana pun — biasanya sisa impor
    // identitas yang perannya belum ditetapkan.
    belum: { santri: { is: null }, pegawai: { is: null }, waliDari: { none: {} } },
  },
};

const teks = (input: Record<string, unknown>, key: string) => String(input[key] ?? '').trim();

/** NIP wajib & unik di skema, jadi sediakan cadangan yang deterministik. */
const nipCadangan = (orangId: string) => `NIP-${orangId.padStart(6, '0')}`;

async function catat(orangId: string, ringkasan: string, perubahan: Record<string, unknown>, aktor: { id: string; nama: string }, aksi: 'CRUD_CREATE' | 'CRUD_UPDATE' | 'CRUD_DELETE' = 'CRUD_CREATE') {
  await recordAudit({ aksi, entitas: 'orang_peran', entitasId: orangId, ringkasan, perubahan, aktor });
}

type Relasi = { id: string; hubungan: string };

/** Pemilih banyak orang mengirim JSON; tolak apa pun yang bukan daftar id sah. */
function bacaRelasi(input: Record<string, unknown>, key: string): Relasi[] {
  const mentah = teks(input, key);
  if (!mentah) return [];
  let terurai: unknown;
  try {
    terurai = JSON.parse(mentah);
  } catch {
    return [];
  }
  if (!Array.isArray(terurai)) return [];
  const hasil: Relasi[] = [];
  const sudah = new Set<string>();
  for (const item of terurai) {
    if (!item || typeof item !== 'object') continue;
    const { id, hubungan } = item as Record<string, unknown>;
    const idTeks = String(id ?? '').trim();
    if (!/^\d+$/.test(idTeks) || sudah.has(idTeks)) continue;
    sudah.add(idTeks);
    hasil.push({ id: idTeks, hubungan: HUBUNGAN_WALI.includes(String(hubungan)) ? String(hubungan) : 'Wali' });
  }
  return hasil;
}

/**
 * Sambungkan pasangan wali↔anak. Relasi ini banyak-ke-banyak dan unik per
 * (wali, anak), jadi pasangan yang sudah ada di-update alih-alih ditolak.
 * Wali utama hanya satu per anak — yang sudah ada tidak diturunkan diam-diam.
 */
async function sambungkanWali(waliId: bigint, anakId: bigint, hubungan: string): Promise<boolean> {
  if (waliId === anakId) return false;
  const [adaWali, adaAnak] = await Promise.all([
    prisma.orang.count({ where: { id: waliId } }),
    prisma.orang.count({ where: { id: anakId } }),
  ]);
  if (!adaWali || !adaAnak) return false;
  const sudahAdaUtama = await prisma.relasiWali.count({ where: { anakId, utama: true } });
  await prisma.relasiWali.upsert({
    where: { waliId_anakId: { waliId, anakId } },
    create: { waliId, anakId, hubungan, peran: hubungan, utama: sudahAdaUtama === 0 },
    update: { hubungan, peran: hubungan },
  });
  return true;
}

/**
 * Buat baris peran untuk orang yang baru disimpan. Idempoten: bila orang itu
 * sudah punya baris santri/pegawai, biarkan yang lama (relasi 1-1 `orangId`).
 */
export async function daftarkanPeran(orangId: string, input: Record<string, unknown>, aktor: { id: string; nama: string }): Promise<void> {
  const peran = teks(input, 'peranOrang') as PeranOrang;
  if (!peran || peran === 'belum' || !PERAN_ORANG.includes(peran)) return;
  const id = BigInt(orangId);

  if (peran === 'santri') {
    if (!(await prisma.santri.count({ where: { orangId: id } }))) {
      const nis = teks(input, 'peranNis') || null;
      const status = teks(input, 'peranStatusSantri') === 'Kalong' ? 'Kalong' : 'Mukim';
      await prisma.santri.create({ data: { orangId: id, nis, status } });
      await catat(orangId, `Mendaftarkan sebagai santri${nis ? ` (NIS ${nis})` : ''}`, { peran, nis, status }, aktor);
    }
    // Santri boleh punya beberapa wali (ayah, ibu, wali lain).
    for (const wali of bacaRelasi(input, 'peranWali')) {
      if (await sambungkanWali(BigInt(wali.id), id, wali.hubungan)) {
        await catat(orangId, `Menetapkan orang #${wali.id} sebagai ${wali.hubungan}`, { waliId: wali.id, hubungan: wali.hubungan }, aktor);
      }
    }
    return;
  }

  if (peran === 'guru' || peran === 'staf') {
    if (await prisma.pegawai.count({ where: { orangId: id } })) return;
    const nip = teks(input, 'peranNip') || nipCadangan(orangId);
    const jabatan = teks(input, 'peranJabatan') || (peran === 'guru' ? 'Guru Mapel' : 'Staf');
    const tugasTambahan = teks(input, 'peranTugasTambahan') || null;
    await prisma.pegawai.create({ data: { orangId: id, nip, jabatan, tugasTambahan, status: 'Aktif' } });
    await catat(orangId, `Mendaftarkan sebagai ${LABEL_PERAN[peran].toLowerCase()} (NIP ${nip})`, { peran, nip, jabatan, tugasTambahan }, aktor);
    return;
  }

  // Wali tanpa santri yang dipilih tetap sah — identitasnya sudah tersimpan
  // dan relasinya bisa dibuat nanti di panel Wali santri. Satu wali boleh
  // mewakili beberapa santri sekaligus.
  for (const anak of bacaRelasi(input, 'peranAnak')) {
    if (await sambungkanWali(id, BigInt(anak.id), anak.hubungan)) {
      await catat(orangId, `Mendaftarkan sebagai ${anak.hubungan} dari orang #${anak.id}`, { peran, anakId: anak.id, hubungan: anak.hubungan }, aktor);
    }
  }
}

/** Relasi yang dicabut operator ikut hilang; yang tersisa disesuaikan hubungannya. */
async function selaraskanRelasi(
  orangId: string,
  arah: 'wali' | 'anak',
  daftar: Relasi[],
  id: bigint,
  aktor: { id: string; nama: string },
): Promise<void> {
  const kunci = arah === 'wali' ? { anakId: id } : { waliId: id };
  const lama = await prisma.relasiWali.findMany({ where: kunci, select: { waliId: true, anakId: true } });
  const tetap = new Set(daftar.map((item) => item.id));
  for (const baris of lama) {
    const lawan = String(arah === 'wali' ? baris.waliId : baris.anakId);
    if (tetap.has(lawan)) continue;
    await prisma.relasiWali.delete({ where: { waliId_anakId: { waliId: baris.waliId, anakId: baris.anakId } } });
    await catat(orangId, `Mencabut relasi wali dengan orang #${lawan}`, { arah, lawan }, aktor, 'CRUD_DELETE');
  }
  for (const item of daftar) {
    const [waliId, anakId] = arah === 'wali' ? [BigInt(item.id), id] : [id, BigInt(item.id)];
    if (await sambungkanWali(waliId, anakId, item.hubungan)) {
      await catat(orangId, `Menetapkan relasi ${item.hubungan} dengan orang #${item.id}`, { arah, lawan: item.id, hubungan: item.hubungan }, aktor, 'CRUD_UPDATE');
    }
  }
}

/**
 * Selaraskan peran setelah identitas diubah. Baris santri/pegawai yang sudah
 * ada diperbarui, bukan digandakan; dan peran yang tidak lagi dipilih **tidak**
 * dihapus diam-diam — modul lain (nilai, presensi, gaji) masih merujuknya, jadi
 * pencabutannya dilakukan sengaja lewat modul asalnya. Relasi wali, yang tidak
 * dirujuk modul lain, memang ikut dicabut sesuai isi daftar.
 */
export async function selaraskanPeran(orangId: string, input: Record<string, unknown>, aktor: { id: string; nama: string }): Promise<void> {
  const peran = teks(input, 'peranOrang') as PeranOrang;
  if (!peran || !PERAN_ORANG.includes(peran)) return;
  const id = BigInt(orangId);

  if (peran === 'santri') {
    const nis = teks(input, 'peranNis') || null;
    const status = teks(input, 'peranStatusSantri') === 'Kalong' ? 'Kalong' : 'Mukim';
    const ada = await prisma.santri.count({ where: { orangId: id } });
    if (ada) {
      await prisma.santri.update({ where: { orangId: id }, data: { nis, status } });
      await catat(orangId, `Memperbarui data santri${nis ? ` (NIS ${nis})` : ''}`, { nis, status }, aktor, 'CRUD_UPDATE');
    } else {
      await prisma.santri.create({ data: { orangId: id, nis, status } });
      await catat(orangId, `Mendaftarkan sebagai santri${nis ? ` (NIS ${nis})` : ''}`, { peran, nis, status }, aktor);
    }
    if ('peranWali' in input) await selaraskanRelasi(orangId, 'wali', bacaRelasi(input, 'peranWali'), id, aktor);
    return;
  }

  if (peran === 'guru' || peran === 'staf') {
    const jabatan = teks(input, 'peranJabatan') || (peran === 'guru' ? 'Guru Mapel' : 'Staf');
    const ada = await prisma.pegawai.findUnique({ where: { orangId: id }, select: { nip: true } });
    const nip = teks(input, 'peranNip') || ada?.nip || nipCadangan(orangId);
    const tugasTambahan = teks(input, 'peranTugasTambahan') || null;
    if (ada) {
      await prisma.pegawai.update({ where: { orangId: id }, data: { nip, jabatan, tugasTambahan } });
      await catat(orangId, `Memperbarui data pegawai (NIP ${nip})`, { nip, jabatan, tugasTambahan }, aktor, 'CRUD_UPDATE');
    } else {
      await prisma.pegawai.create({ data: { orangId: id, nip, jabatan, tugasTambahan, status: 'Aktif' } });
      await catat(orangId, `Mendaftarkan sebagai ${LABEL_PERAN[peran].toLowerCase()} (NIP ${nip})`, { peran, nip, jabatan, tugasTambahan }, aktor);
    }
    return;
  }

  if (peran === 'wali' && 'peranAnak' in input) {
    await selaraskanRelasi(orangId, 'anak', bacaRelasi(input, 'peranAnak'), id, aktor);
  }
  // `belum`: tidak ada yang dibuat maupun dihapus.
}
