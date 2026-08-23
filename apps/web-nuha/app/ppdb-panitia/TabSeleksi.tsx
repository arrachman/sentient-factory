import { prisma } from '@/lib/prisma';
import { Avatar, Badge, Kosong } from '@/components/ui/primitives';
import { ubahStatusSeleksi } from './actions';

/** Pendaftar yang masih perlu diverifikasi/diseleksi, dengan aksi keputusan. */
export async function TabSeleksi() {
  const pendaftar = await prisma.pendaftar.findMany({
    where: { status: { in: ['Baru', 'Verifikasi', 'Seleksi'] } },
    orderBy: { tglDaftar: 'asc' },
  });

  return (
    <div className="card">
      <h3 className="card-judul">Seleksi &amp; verifikasi</h3>
      <p className="card-sub" style={{ marginBottom: 14 }}>
        Tes baca Al-Qur&apos;an, wawancara wali, dan verifikasi berkas. Tetapkan keputusan per pendaftar.
      </p>
      {pendaftar.length === 0 ? (
        <Kosong pesan="Tidak ada pendaftar yang menunggu keputusan." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pendaftar.map((p) => (
            <div key={String(p.id)} className="inset" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <Avatar nama={p.nama} size={36} />
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontWeight: 600 }}>{p.nama}</div>
                <div className="muted" style={{ fontSize: 11.5 }}>
                  {p.noReg} · {p.pilihan} · nilai {p.nilai ? Number(p.nilai).toFixed(1) : '-'}
                </div>
              </div>
              <Badge status={p.status} />
              <div style={{ display: 'flex', gap: 8 }}>
                <form action={ubahStatusSeleksi}>
                  <input type="hidden" name="id" value={String(p.id)} />
                  <input type="hidden" name="aksi" value="lulus" />
                  <button className="btn" type="submit">Luluskan</button>
                </form>
                <form action={ubahStatusSeleksi}>
                  <input type="hidden" name="id" value={String(p.id)} />
                  <input type="hidden" name="aksi" value="tolak" />
                  <button className="btn btn-sekunder" type="submit">Tidak lulus</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
