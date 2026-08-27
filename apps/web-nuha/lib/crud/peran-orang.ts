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
    hanyaBaru: true,
    span: 3,
    group: 'Peran',
    options: [...PERAN_ORANG],
    optionLabels: LABEL_PERAN,
    hint: 'Menentukan modul tempat orang ini ikut terdaftar. Pilih "Belum ditentukan" bila hanya ingin menyimpan identitasnya.',
  },
  {
    name: 'peranNis',
    label: 'NIS',
    type: 'text',
    virtual: true,
    hanyaBaru: true,
    group: 'Peran',
    tampilBila: tampilBila(['santri']),
    hint: 'Kosongkan bila belum ada — bisa dilengkapi di modul Santri.',
    placeholder: '2026001',
  },
  {
    name: 'peranStatusSantri',
    label: 'Status santri',
    type: 'select',
    virtual: true,
    hanyaBaru: true,
    group: 'Peran',
    options: ['Mukim', 'Kalong'],
    tampilBila: tampilBila(['santri']),
  },
  {
    name: 'peranNip',
    label: 'NIP',
    type: 'text',
    virtual: true,
    hanyaBaru: true,
    group: 'Peran',
    tampilBila: tampilBila(['guru', 'staf']),
    hint: 'Wajib untuk guru/staf dan harus unik. Kosongkan untuk dibuatkan otomatis.',
    placeholder: '198701012010011001',
  },
  {
    name: 'peranJabatan',
    label: 'Jabatan',
    type: 'text',
    virtual: true,
    hanyaBaru: true,
    group: 'Peran',
    tampilBila: tampilBila(['guru', 'staf']),
    placeholder: 'Guru Mapel / Tata Usaha',
  },
  {
    name: 'peranWali',
    label: 'Wali santri ini',
    type: 'orang-banyak',
    virtual: true,
    hanyaBaru: true,
    span: 3,
    group: 'Peran',
    hubungan: HUBUNGAN_WALI,
    tampilBila: tampilBila(['santri']),
    placeholder: 'Cari nama wali (ayah/ibu/wali)…',
    hint: 'Boleh lebih dari satu — cari identitas walinya lalu tentukan hubungannya. Wali pertama jadi wali utama (penerima notifikasi WhatsApp). Bisa juga dilengkapi nanti di panel Wali santri.',
  },
  {
    name: 'peranAnak',
    label: 'Santri yang diwalikan',
    type: 'orang-banyak',
    virtual: true,
    hanyaBaru: true,
    span: 3,
    group: 'Peran',
    hubungan: HUBUNGAN_WALI,
    hanyaSantri: true,
    tampilBila: tampilBila(['wali']),
    placeholder: 'Cari nama santri…',
    hint: 'Satu wali boleh mewakili beberapa santri — tambahkan semuanya di sini. Hanya orang yang sudah terdaftar sebagai santri yang muncul.',
  },
];

const teks = (input: Record<string, unknown>, key: string) => String(input[key] ?? '').trim();

/** NIP wajib & unik di skema, jadi sediakan cadangan yang deterministik. */
const nipCadangan = (orangId: string) => `NIP-${orangId.padStart(6, '0')}`;

async function catat(orangId: string, ringkasan: string, perubahan: Record<string, unknown>, aktor: { id: string; nama: string }) {
  await recordAudit({ aksi: 'CRUD_CREATE', entitas: 'orang_peran', entitasId: orangId, ringkasan, perubahan, aktor });
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
    await prisma.pegawai.create({ data: { orangId: id, nip, jabatan, status: 'Aktif' } });
    await catat(orangId, `Mendaftarkan sebagai ${LABEL_PERAN[peran].toLowerCase()} (NIP ${nip})`, { peran, nip, jabatan }, aktor);
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
