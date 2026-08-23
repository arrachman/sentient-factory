import { prisma } from '@/lib/prisma';
import { Kosong } from '@/components/ui/primitives';

const warnaLevel = (level: string): { bg: string; fg: string } => {
  if (level.startsWith('C2')) return { bg: '#DBEAFE', fg: '#1E40AF' };
  if (level.startsWith('C3')) return { bg: '#DCF0E3', fg: '#0F6B3D' };
  return { bg: '#FEF3C7', fg: '#92400E' };
};

/** Tab bank soal bersama, dicari lewat ?q=. */
export async function TabSoal({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const raw = searchParams.q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? '').trim();
  const soal = await prisma.bankSoal.findMany({ orderBy: { kode: 'desc' } });

  const qLower = q.toLowerCase();
  const baris = soal.filter((b) => `${b.mapel} ${b.topik} ${b.penulis}`.toLowerCase().includes(qLower));
  const totalButir = soal.reduce((total, item) => total + item.butir, 0);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
        <div>
          <h3 className="card-judul">Bank soal bersama</h3>
          <p className="card-sub">{totalButir} butir soal dalam {soal.length} paket, dapat langsung dipakai pada ujian LMS.</p>
        </div>
        <form method="get" action="/kurikulum" className="field" style={{ margin: 0, minWidth: 200 }}>
          <input type="hidden" name="tab" value="soal" />
          <input name="q" defaultValue={q} placeholder="Cari topik / mapel" />
        </form>
      </div>
      {baris.length === 0 ? <Kosong pesan="Tidak ada butir soal yang cocok." /> : (
        <div className="tabel-wrap">
          <table>
            <thead>
              <tr>
                <th>Paket</th><th>Mapel / Topik</th><th>Bentuk</th><th>Level kognitif</th>
                <th className="num">Butir</th><th className="num">Dipakai</th>
              </tr>
            </thead>
            <tbody>
              {baris.map((b) => {
                const warna = warnaLevel(b.level);
                return (
                  <tr key={b.id}>
                    <td className="muted">{b.kode}</td>
                    <td>
                      {b.mapel}
                      <div className="muted" style={{ fontSize: 11.5 }}>{b.topik} · {b.penulis}</div>
                    </td>
                    <td className="muted">{b.tipe}</td>
                    <td><span className="badge" style={{ background: warna.bg, color: warna.fg }}>{b.level}</span></td>
                    <td className="num">{b.butir}</td>
                    <td className="num">{b.dipakai}x</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
