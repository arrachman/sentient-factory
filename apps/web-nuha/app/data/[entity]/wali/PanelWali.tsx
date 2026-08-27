import { prisma } from '@/lib/prisma';
import { Pagination, LimitPicker } from '@/components';
import { FormRelasiWali } from './FormRelasiWali';
import { DaftarRelasi } from './DaftarRelasi';

/** Query param khusus panel wali — dipisahkan agar tak bentrok dengan filter tabel orang. */
const P_CARI = 'wq';
const P_HALAMAN = 'whalaman';
const P_LIMIT = 'wlimit';
const LIMIT_BAWAAN = 10;

export type ParamWali = { cari: string; halaman: number; limit: number };

/** Baca parameter panel wali dari searchParams halaman `/data/orang`. */
export function bacaParamWali(sp: Record<string, string | string[] | undefined>): ParamWali {
  const satu = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';
  const halaman = Number.parseInt(satu(sp[P_HALAMAN]), 10);
  const limit = Number.parseInt(satu(sp[P_LIMIT]), 10);
  return {
    cari: satu(sp[P_CARI]).trim(),
    halaman: Number.isFinite(halaman) && halaman > 0 ? halaman : 1,
    limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : LIMIT_BAWAAN,
  };
}

/**
 * Panel "Hubungkan wali ke santri" yang menempel di halaman Identitas orang.
 * Relasi wali↔anak adalah pasangan antar-baris `orang`, jadi tidak bisa jadi
 * entitas CRUD biasa — tapi tempatnya tetap di sini agar operator tidak
 * berpindah halaman untuk mengurus orang yang sama.
 */
export async function PanelWali({ param }: { param: ParamWali }) {
  const { cari, halaman, limit } = param;
  const where = cari
    ? { OR: [{ wali: { nama: { contains: cari } } }, { anak: { nama: { contains: cari } } }] }
    : undefined;

  const [relasi, total, santri] = await Promise.all([
    prisma.relasiWali.findMany({
      where,
      include: {
        wali: { select: { id: true, nama: true, hp: true } },
        anak: { select: { id: true, nama: true, santri: { select: { nis: true, kelas: { select: { nama: true } } } } } },
      },
      orderBy: [{ anak: { nama: 'asc' } }, { utama: 'desc' }],
      skip: (halaman - 1) * limit,
      take: limit,
    }),
    prisma.relasiWali.count({ where }),
    // Kandidat anak: hanya orang yang benar-benar terdaftar sebagai santri.
    prisma.santri.findMany({
      select: { orangId: true, nis: true, orang: { select: { nama: true } } },
      orderBy: { orang: { nama: 'asc' } },
    }),
  ]);

  const fq = cari ? `&${P_CARI}=${encodeURIComponent(cari)}` : '';
  const totalHalaman = Math.max(1, Math.ceil(total / limit));
  const hrefBase = '/data/orang';

  return <section id="wali" style={{ marginTop: 28 }}>
    <FormRelasiWali santri={santri.map((s) => ({ orangId: String(s.orangId), nama: s.orang.nama, nis: s.nis }))} />

    <form method="get" action={hrefBase} className="card bilah-filter">
      <input type="hidden" name={P_LIMIT} value={limit} />
      <div className="bilah-filter-kolom" style={{ flex: '1 1 260px', maxWidth: 420 }}>
        <label htmlFor="cari-wali">Cari relasi wali</label>
        <input id="cari-wali" type="text" name={P_CARI} defaultValue={cari} placeholder="Nama wali atau nama santri…" />
      </div>
      <div className="bilah-filter-aksi">
        <button className="btn" type="submit">Filter</button>
        {cari && <a className="btn btn-sekunder" href={`${hrefBase}?${P_LIMIT}=${limit}#wali`}>Reset</a>}
      </div>
    </form>

    <DaftarRelasi
      relasi={relasi.map((r) => ({
        id: String(r.id),
        waliNama: r.wali.nama,
        waliHp: r.wali.hp,
        anakId: String(r.anak.id),
        anakNama: r.anak.nama,
        nis: r.anak.santri?.nis ?? null,
        kelas: r.anak.santri?.kelas?.nama ?? null,
        hubungan: r.hubungan,
        pekerjaan: r.pekerjaan,
        utama: r.utama,
      }))}
    />

    <Pagination
      halaman={halaman}
      totalHalaman={totalHalaman}
      total={total}
      jumlahBaris={relasi.length}
      ukuranHalaman={limit}
      buatHref={(p) => `${hrefBase}?${P_HALAMAN}=${p}&${P_LIMIT}=${limit}${fq}#wali`}
      ekstra={<LimitPicker limit={limit} hrefBase={hrefBase} query={fq} param={P_LIMIT} hash="#wali" />}
    />
  </section>;
}
