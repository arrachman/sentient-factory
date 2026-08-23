import { prisma } from '@/lib/prisma';
import { Avatar, Badge, Kosong } from '@/components';

/** Pengumuman kelulusan: pendaftar yang sudah lulus, tidak lulus, atau daftar ulang. */
export async function TabKelulusan() {
  const pendaftar = await prisma.pendaftar.findMany({
    where: { status: { in: ['Lulus', 'TidakLulus', 'DaftarUlang'] } },
    orderBy: { nama: 'asc' },
  });

  return (
    <div className="card">
      <h3 className="card-judul">Pengumuman kelulusan</h3>
      <p className="card-sub" style={{ marginBottom: 14 }}>
        Daftar ulang dibuka sesuai jadwal PPDB yang ditetapkan panitia.
      </p>
      {pendaftar.length === 0 ? (
        <Kosong pesan="Belum ada pendaftar dengan keputusan kelulusan." />
      ) : (
        <div className="grid g2">
          {pendaftar.map((p) => (
            <div key={String(p.id)} className="inset" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Avatar nama={p.nama} size={34} />
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ fontWeight: 600 }}>{p.nama}</div>
                <div className="muted" style={{ fontSize: 11.5 }}>{p.noReg} · {p.pilihan}</div>
              </div>
              <Badge status={p.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
