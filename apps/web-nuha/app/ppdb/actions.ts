'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/** Tiga berkas yang wajib dilampirkan — persis validasi di prototype. */
const BERKAS_WAJIB = ['Akta Kelahiran', 'Kartu Keluarga', 'Ijazah / SKL'];
const BERKAS_OPSIONAL = ['Foto 3x4 latar merah', 'Surat Keterangan Sehat'];

export type PayloadDaftarPpdb = {
  nama: string;
  nisn: string;
  jk: string;
  tempatLahir: string;
  tglLahir: string;
  alamat: string;
  wali: string;
  hp: string;
  asalSekolah: string;
  kabSekolah: string;
  tahunLulus: string;
  nilaiRapor: string;
  pernahMondok: string;
  pickUnit: Record<string, boolean>;
  jurusan: string;
  programPondok: string;
  berkas: Record<string, boolean>;
};

export type HasilDaftarPpdb =
  | { ok: true; noReg: string }
  | { ok: false; errors: Partial<Record<'nama' | 'nisn' | 'tglLahir' | 'wali' | 'hp' | 'asalSekolah' | 'unit' | 'berkas', string>> };

/** Validasi persis `validateStep` di prototype, dijalankan ulang untuk seluruh langkah sekaligus. */
function validasi(data: PayloadDaftarPpdb): Record<string, string> {
  const e: Record<string, string> = {};

  if (!data.nama.trim()) e.nama = 'Nama lengkap wajib diisi.';
  if (!data.nisn.trim()) e.nisn = 'NISN wajib diisi.';
  else if (!/^[0-9]{10}$/.test(data.nisn.trim())) e.nisn = 'NISN harus 10 digit angka.';
  if (!data.tglLahir.trim()) e.tglLahir = 'Tanggal lahir wajib diisi.';
  if (!data.wali.trim()) e.wali = 'Nama wali wajib diisi.';
  if (!data.hp.trim()) e.hp = 'No. HP wali wajib diisi.';
  else if (!/^08[0-9]{8,11}$/.test(data.hp.trim())) e.hp = 'Format HP tidak valid (08xxxxxxxxxx).';

  if (!data.asalSekolah.trim()) e.asalSekolah = 'Sekolah asal wajib diisi.';

  const unitTerpilih = Object.keys(data.pickUnit).filter((k) => data.pickUnit[k]);
  if (unitTerpilih.length === 0) e.unit = 'Pilih minimal satu unit.';

  const berkasKurang = BERKAS_WAJIB.filter((w) => !data.berkas[w]);
  if (berkasKurang.length) e.berkas = `Berkas wajib belum lengkap: ${berkasKurang.join(', ')}.`;

  return e;
}

/** Susun label pilihan unit, dipakai untuk kolom `pilihan` dan ditampilkan di cek status. */
function susunPilihan(data: PayloadDaftarPpdb): string {
  const bagian: string[] = [];
  if (data.pickUnit.SMP) bagian.push('SMP');
  if (data.pickUnit.MA) bagian.push(data.jurusan && data.jurusan !== '-' ? `MA (${data.jurusan})` : 'MA');
  if (data.pickUnit.Pondok) bagian.push(data.programPondok && data.programPondok !== '-' ? `Pondok (${data.programPondok})` : 'Pondok');
  return bagian.join(' + ') || '-';
}

/**
 * Tulis pendaftaran baru + berkasnya. Nomor registrasi berurutan per tahun
 * (`PPDB-<tahun>-NNNN`) diturunkan dari noReg terakhir di dalam transaksi;
 * kalau ada tabrakan (dua pendaftar submit bersamaan) constraint unik pada
 * `noReg` akan menolak insert dan kita coba lagi dengan angka berikutnya.
 */
export async function daftarPpdb(data: PayloadDaftarPpdb): Promise<HasilDaftarPpdb> {
  const errors = validasi(data);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const tahun = new Date().getFullYear();
  const prefix = `PPDB-${tahun}-`;
  const pilihan = susunPilihan(data);

  const berkasBaris = [...BERKAS_WAJIB, ...BERKAS_OPSIONAL]
    .filter((nama) => data.berkas[nama])
    .map((nama) => ({ nama, wajib: BERKAS_WAJIB.includes(nama), terverifikasi: false }));

  const MAKS_PERCOBAAN = 5;
  for (let percobaan = 0; percobaan < MAKS_PERCOBAAN; percobaan++) {
    try {
      const noReg = await prisma.$transaction(async (tx) => {
        const terakhir = await tx.pendaftar.findFirst({
          where: { noReg: { startsWith: prefix } },
          orderBy: { id: 'desc' },
          select: { noReg: true },
        });
        const nomorTerakhir = terakhir ? Number(terakhir.noReg.slice(prefix.length)) || 0 : 0;
        const nomorBaru = String(nomorTerakhir + 1).padStart(4, '0');
        const noRegBaru = `${prefix}${nomorBaru}`;

        await tx.pendaftar.create({
          data: {
            noReg: noRegBaru,
            nama: data.nama.trim(),
            jk: data.jk === 'P' ? 'P' : 'L',
            pilihan,
            asalSekolah: data.asalSekolah.trim(),
            hpWali: data.hp.trim(),
            tglDaftar: new Date(),
            status: 'Baru',
            berkas: { create: berkasBaris },
          },
        });

        return noRegBaru;
      });

      return { ok: true, noReg };
    } catch (err) {
      const konflikUnik = err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
      if (!konflikUnik || percobaan === MAKS_PERCOBAAN - 1) throw err;
      // noReg sudah dipakai pendaftar lain yang submit di waktu bersamaan — ulangi dengan nomor berikutnya.
    }
  }

  throw new Error('Gagal membuat nomor registrasi setelah beberapa percobaan.');
}
