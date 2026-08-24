export const UKURAN_HALAMAN = 15;

export type SearchParams = Record<string, string | string[] | undefined>;

/** Ambil satu nilai dari searchParams (kolaps array jadi string pertama). */
export const satu = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

/** Baca & clamp nomor halaman dari searchParams, minimal 1. */
export function bacaHalaman(sp: SearchParams) {
  return Math.max(1, Number(satu(sp.halaman)) || 1);
}
