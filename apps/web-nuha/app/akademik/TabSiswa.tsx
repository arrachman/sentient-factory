import { prisma } from '@/lib/prisma';
import { Avatar, Badge, Kosong } from '@/components/ui/primitives';

const UKURAN_HALAMAN = 15;

type Params = Record<string, string | string[] | undefined>;
const satu = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

/** Bangun href tab siswa dengan query yang sudah digabung, dipakai form dan pagination. */
function hrefSiswa(params: Record<string, string>) {
  const qs = new URLSearchParams({ tab: 'siswa', ...params });
  for (const [k, v] of [...qs.entries()]) if (!v) qs.delete(k);
  return `/akademik?${qs.toString()}`;
}

export async function TabSiswa({ searchParams }: { searchParams: Params }) {
  const q = satu(searchParams.q);
  const unit = satu(searchParams.unit);
  const kelas = satu(searchParams.kelas);
  const status = satu(searchParams.status);
  const halaman = Math.max(1, Number(satu(searchParams.halaman)) || 1);

  const [unitOpts, kelasOpts] = await Promise.all([
    prisma.unit.findMany({ orderBy: { nama: 'asc' } }),
    prisma.kelas.findMany({ where: unit ? { unit: { key: unit } } : undefined, include: { unit: true }, orderBy: { nama: 'asc' } }),
  ]);
  const statusOpts: string[] = ['Mukim', 'Kalong', 'Alumni', 'Keluar'];

  const where = {
    ...(q ? { OR: [{ orang: { nama: { contains: q } } }, { nis: { contains: q } }, { nisn: { contains: q } }] } : {}),
    ...(unit ? { unit: { key: unit } } : {}),
    ...(kelas ? { kelasId: Number(kelas) } : {}),
    ...(status ? { status: status as never } : {}),
  };

  const [total, siswaRows] = await Promise.all([
    prisma.santri.count({ where }),
    prisma.santri.findMany({
      where,
      include: { orang: true, unit: true, kelas: true, kamar: { include: { asrama: true } } },
      orderBy: { orang: { nama: 'asc' } },
      skip: (halaman - 1) * UKURAN_HALAMAN,
      take: UKURAN_HALAMAN,
    }),
  ]);
  const totalHalaman = Math.max(1, Math.ceil(total / UKURAN_HALAMAN));

  return (
    <div className="card">
      <form method="get" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16 }}>
        <input type="hidden" name="tab" value="siswa" />
        <div className="field" style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
          <label>Pencarian</label>
          <input type="text" name="q" placeholder="Nama, NIS, atau NISN" defaultValue={q} />
        </div>
        <div className="field" style={{ minWidth: 130, marginBottom: 0 }}>
          <label>Unit</label>
          <select name="unit" defaultValue={unit}>
            <option value="">Semua unit</option>
            {unitOpts.map((o) => <option key={o.key} value={o.key}>{o.nama}</option>)}
          </select>
        </div>
        <div className="field" style={{ minWidth: 150, marginBottom: 0 }}>
          <label>Kelas</label>
          <select name="kelas" defaultValue={kelas}>
            <option value="">Semua kelas</option>
            {kelasOpts.map((o) => <option key={o.id} value={o.id}>{o.unit.nama} · {o.nama}</option>)}
          </select>
        </div>
        <div className="field" style={{ minWidth: 130, marginBottom: 0 }}>
          <label>Status</label>
          <select name="status" defaultValue={status}>
            <option value="">Semua status</option>
            {statusOpts.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <button type="submit" className="btn">Terapkan</button>
      </form>

      <div className="tabel-wrap">
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>NIS / NISN</th>
              <th>Unit · Kelas</th>
              <th>Asrama</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {siswaRows.map((x) => (
              <tr key={String(x.id)}>
                <td>
                  <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
                    <Avatar nama={x.orang.nama} />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{x.orang.nama}</div>
                      <div className="muted" style={{ fontSize: 11.5 }}>{x.orang.jk} · {x.program ?? '-'}</div>
                    </div>
                  </div>
                </td>
                <td className="num">{x.nis}{x.nisn ? ` / ${x.nisn}` : ''}</td>
                <td>{x.unit ? `${x.unit.nama} · ${x.kelas?.nama ?? '-'}` : '-'}</td>
                <td>{x.kamar ? `${x.kamar.asrama.nama} ${x.kamar.kode}` : '-'}</td>
                <td><Badge status={x.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {siswaRows.length === 0 && <Kosong />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
        <span className="muted" style={{ fontSize: 12.5 }}>
          Menampilkan {siswaRows.length === 0 ? 0 : (halaman - 1) * UKURAN_HALAMAN + 1}–{(halaman - 1) * UKURAN_HALAMAN + siswaRows.length} dari {total}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: totalHalaman }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={hrefSiswa({ q, unit, kelas, status, halaman: String(p) })}
              className={`btn-sekunder ${p === halaman ? 'active' : ''}`}
              style={{ minWidth: 34, textAlign: 'center', padding: '7px 10px', borderRadius: 9, textDecoration: 'none', fontSize: 12.5, fontWeight: 600 }}
            >
              {p}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
