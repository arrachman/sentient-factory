import { prisma } from '@/lib/prisma';
import { Kosong, ProgressBar, Tabel } from '@/components';

export async function TabObat({ q }: { q: string }) {
  const semuaObat = await prisma.obat.findMany({ orderBy: { nama: 'asc' } });
  const kata = q.trim().toLowerCase();
  const obat = kata
    ? semuaObat.filter((o) => `${o.nama} ${o.kategori ?? ''}`.toLowerCase().includes(kata))
    : semuaObat;
  const menipisN = semuaObat.filter((o) => o.stok < o.stokMin).length;

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div>
          <h3 className="card-judul">Persediaan obat & alkes</h3>
          <p className="card-sub">{menipisN} item perlu segera dibelanjakan.</p>
        </div>
        <form>
          <input className="field" name="q" defaultValue={q} placeholder="Cari nama obat / kategori" style={{ minWidth: 220 }} />
        </form>
      </header>
      {obat.length === 0 ? <Kosong /> : (
        <Tabel kolom={['Item', 'Kategori', { label: 'Stok', num: true }, 'Level', { label: 'Kedaluwarsa', num: true }, 'Status']}>
          {obat.map((o) => {
            const kritis = o.stok < o.stokMin;
            const pct = Math.min(100, Math.round((o.stok / Math.max(o.stokMin * 2, 1)) * 100));
            return (
              <tr key={o.id}>
                <td style={{ fontWeight: 600 }}>{o.nama}</td>
                <td className="muted">{o.kategori ?? '-'}</td>
                <td className="num" style={{ fontWeight: 700 }}>{o.stok} <span className="muted" style={{ fontWeight: 400 }}>{o.satuan}</span></td>
                <td style={{ minWidth: 120 }}><ProgressBar pct={pct} warna={kritis ? '#B91C1C' : '#0F6B3D'} /></td>
                <td className="num muted">{o.kadaluarsa ?? '-'}</td>
                <td><span className={`badge ${kritis ? 'badge-merah' : 'badge-hijau'}`}>{kritis ? 'Di bawah minimum' : 'Aman'}</span></td>
              </tr>
            );
          })}
        </Tabel>
      )}
    </div>
  );
}
