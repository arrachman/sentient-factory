import Link from 'next/link';
import { Shell } from '@/components/templates/Shell';
import { requirePage } from '@/lib/access';
import { prisma } from '@/lib/prisma';
import { Pagination, bacaHalaman, bacaLimit, LimitPicker, satu } from '@/components';
import { FormRelasiWali } from './FormRelasiWali';
import { DaftarRelasi } from './DaftarRelasi';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function WaliPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await requirePage('induk');
  const sp = await searchParams;
  const halaman = bacaHalaman(sp);
  const limit = bacaLimit(sp);
  const q = satu(sp.q)?.trim() ?? '';

  const where = q
    ? { OR: [{ wali: { nama: { contains: q } } }, { anak: { nama: { contains: q } } }] }
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

  const fq = q ? `&q=${encodeURIComponent(q)}` : '';
  const totalHalaman = Math.max(1, Math.ceil(total / limit));

  return <Shell session={session} active="data" title="Wali santri">
    <Link href="/data" className="muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
      &larr; Kembali ke Kelola Data
    </Link>

    <FormRelasiWali santri={santri.map((s) => ({ orangId: String(s.orangId), nama: s.orang.nama, nis: s.nis }))} />

    <form method="get" action="/data/wali" className="card bilah-filter">
      <input type="hidden" name="limit" value={limit} />
      <div className="bilah-filter-kolom" style={{ flex: '1 1 260px', maxWidth: 420 }}>
        <label htmlFor="cari-wali">Cari</label>
        <input id="cari-wali" type="text" name="q" defaultValue={q} placeholder="Nama wali atau nama santri…" />
      </div>
      <div className="bilah-filter-aksi">
        <button className="btn" type="submit">Filter</button>
        {q && <a className="btn btn-sekunder" href={`/data/wali?limit=${limit}`}>Reset</a>}
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
      buatHref={(p) => `/data/wali?halaman=${p}&limit=${limit}${fq}`}
      ekstra={<LimitPicker limit={limit} hrefBase="/data/wali" query={fq} />}
    />
  </Shell>;
}
