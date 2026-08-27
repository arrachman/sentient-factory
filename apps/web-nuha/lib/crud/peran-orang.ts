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
    name: 'peranAnakId',
    label: 'Anak (santri) yang diwalikan',
    type: 'number',
    virtual: true,
    hanyaBaru: true,
    group: 'Peran',
    ref: { model: 'orang', label: 'nama', orderBy: { nama: 'asc' }, idType: 'bigint' },
    tampilBila: tampilBila(['wali']),
    hint: 'Pilih santrinya; relasi tambahan bisa dikelola di panel Wali santri.',
  },
  {
    name: 'peranHubungan',
    label: 'Hubungan',
    type: 'select',
    virtual: true,
    hanyaBaru: true,
    group: 'Peran',
    options: HUBUNGAN_WALI,
    tampilBila: tampilBila(['wali']),
  },
];

const teks = (input: Record<string, unknown>, key: string) => String(input[key] ?? '').trim();

/** NIP wajib & unik di skema, jadi sediakan cadangan yang deterministik. */
const nipCadangan = (orangId: string) => `NIP-${orangId.padStart(6, '0')}`;

async function catat(orangId: string, ringkasan: string, perubahan: Record<string, unknown>, aktor: { id: string; nama: string }) {
  await recordAudit({ aksi: 'CRUD_CREATE', entitas: 'orang_peran', entitasId: orangId, ringkasan, perubahan, aktor });
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
    if (await prisma.santri.count({ where: { orangId: id } })) return;
    const nis = teks(input, 'peranNis') || null;
    const status = teks(input, 'peranStatusSantri') === 'Kalong' ? 'Kalong' : 'Mukim';
    await prisma.santri.create({ data: { orangId: id, nis, status } });
    await catat(orangId, `Mendaftarkan sebagai santri${nis ? ` (NIS ${nis})` : ''}`, { peran, nis, status }, aktor);
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

  // Wali tanpa anak yang dipilih tetap sah — identitasnya sudah tersimpan dan
  // relasinya bisa dibuat nanti di panel Wali santri.
  const anak = teks(input, 'peranAnakId');
  if (!anak || anak === orangId) return;
  const anakId = BigInt(anak);
  if (!(await prisma.orang.count({ where: { id: anakId } }))) return;
  const hubungan = HUBUNGAN_WALI.includes(teks(input, 'peranHubungan')) ? teks(input, 'peranHubungan') : 'Wali';
  const sudahAdaUtama = await prisma.relasiWali.count({ where: { anakId, utama: true } });
  await prisma.relasiWali.upsert({
    where: { waliId_anakId: { waliId: id, anakId } },
    create: { waliId: id, anakId, hubungan, peran: hubungan, utama: sudahAdaUtama === 0 },
    update: { hubungan, peran: hubungan },
  });
  await catat(orangId, `Mendaftarkan sebagai ${hubungan} dari orang #${anak}`, { peran, anakId: anak, hubungan }, aktor);
}
