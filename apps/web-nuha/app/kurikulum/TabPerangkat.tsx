import { prisma } from '@/lib/prisma';
import { Kosong } from '@/components/ui/primitives';
import { ajukanPerangkat, setujuiPerangkat } from './actions';

/** Tab silabus & modul ajar: guru mengajukan, kepala unit menyetujui. Pencarian lewat ?q=. */
export async function TabPerangkat({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const raw = searchParams.q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? '').trim();
  const perangkat = await prisma.perangkatAjar.findMany({ orderBy: { kode: 'desc' } });

  const qLower = q.toLowerCase();
  const baris = perangkat.filter((p) => `${p.topik} ${p.mapel} ${p.guru} ${p.jenis}`.toLowerCase().includes(qLower));

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
        <div>
          <h3 className="card-judul">Silabus, modul ajar & program</h3>
          <p className="card-sub">Guru menyusun lalu mengajukan; kepala unit menyetujui sebelum dipakai mengajar.</p>
        </div>
        <form method="get" action="/kurikulum" className="field" style={{ margin: 0, minWidth: 220 }}>
          <input type="hidden" name="tab" value="perangkat" />
          <input name="q" defaultValue={q} placeholder="Cari topik / mapel / guru" />
        </form>
      </div>
      {baris.length === 0 ? <Kosong pesan="Tidak ada perangkat ajar yang cocok." /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {baris.map((p) => (
            <div
              key={p.id}
              className="inset"
              style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', borderLeft: '4px solid var(--hijau-gelap)' }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.topik}</div>
                <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                  {p.kode} · {p.jenis} · {p.mapel} · kelas {p.kelas} · {p.pertemuan} pertemuan
                </div>
              </div>
              <div className="muted" style={{ fontSize: 12, minWidth: 150 }}>{p.guru}</div>
              <span className={`badge ${p.status === 'Disetujui' ? 'badge-hijau' : p.status === 'Menunggu review' ? 'badge-kuning' : 'badge-netral'}`}>
                {p.status}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                {p.status === 'Draf' && (
                  <form action={ajukanPerangkat}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="btn">Ajukan review</button>
                  </form>
                )}
                {p.status === 'Menunggu review' && (
                  <form action={setujuiPerangkat}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="btn-sekunder">Setujui</button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
