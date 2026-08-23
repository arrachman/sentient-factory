import { prisma } from '@/lib/prisma';
import { Avatar, Badge, Kosong, Tabel } from '@/components/ui/primitives';
import { DaftarPpdb } from './DaftarPpdb';

/** Seluruh pendaftar, difilter lewat query param `q` (bukan state klien). */
export async function TabPendaftar({ q }: { q: string }) {
  const pendaftar = await prisma.pendaftar.findMany({
    where: q
      ? { OR: [{ nama: { contains: q } }, { noReg: { contains: q } }] }
      : undefined,
    orderBy: { tglDaftar: 'desc' },
  });

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
        <h3 className="card-judul" style={{ marginBottom: 0 }}>Seluruh pendaftar</h3>
        <form method="get" style={{ display: 'flex' }}>
          <input type="hidden" name="tab" value="pendaftar" />
          <input className="field" name="q" defaultValue={q} placeholder="Cari nama / no. pendaftaran" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--garis)', minWidth: 230 }} />
        </form>
      </div>
      {pendaftar.length === 0 ? (
        <Kosong pesan="Belum ada pendaftar yang cocok." />
      ) : (
        <Tabel kolom={['Pendaftar', 'Pilihan unit', 'Asal sekolah', { label: 'Nilai', num: true }, 'Status']}>
          {pendaftar.map((p) => (
            <tr key={String(p.id)}>
              <td>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Avatar nama={p.nama} size={30} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.nama}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{p.noReg} · {p.tglDaftar.toLocaleDateString('id-ID')}</div>
                  </div>
                </div>
              </td>
              <td>{p.pilihan}</td>
              <td>{p.asalSekolah ?? '-'}</td>
              <td className="num" style={{ fontWeight: 700 }}>{p.nilai ? Number(p.nilai).toFixed(1) : '-'}</td>
              <td><Badge status={p.status} /></td>
            </tr>
          ))}
        </Tabel>
      )}
      <div style={{ marginTop: 18 }}>
        <DaftarPpdb />
      </div>
    </div>
  );
}
