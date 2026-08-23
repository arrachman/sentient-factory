import { prisma } from '@/lib/prisma';
import { Kosong, rp } from '@/components/ui/primitives';

/** Tab Keuangan: tagihan & pembayaran santri, digabung dari semua jenis (SPP/syahriyah/dll). */
export async function TabKeuangan({ santriId }: { santriId: bigint }) {
  const tagihan = await prisma.tagihan.findMany({
    where: { santriId },
    include: { santri: { include: { unit: true } } },
    orderBy: { jatuhTempo: 'desc' },
  });

  const statusTagihan = (t: (typeof tagihan)[number]) => {
    const dibayar = Number(t.dibayar);
    const nominal = Number(t.nominal);
    if (dibayar >= nominal) return { label: 'Lunas', bg: '#DCF0E3', fg: '#0F6B3D' };
    if (dibayar > 0) return { label: 'Sebagian', bg: '#FEF3C7', fg: '#92400E' };
    return { label: 'Belum bayar', bg: '#FEE2E2', fg: '#991B1B' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3 className="card-judul" style={{ marginBottom: 0 }}>Tagihan &amp; pembayaran</h3>
      {tagihan.length === 0
        ? <Kosong pesan="Belum ada tagihan untuk santri ini." />
        : tagihan.map((t) => {
          const st = statusTagihan(t);
          return (
            <div key={String(t.id)} className="inset" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.jenis}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  {t.periode} · jatuh tempo {t.jatuhTempo.toLocaleDateString('id-ID')} · {t.santri.unit?.nama ?? '-'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="muted" style={{ fontSize: 11.5 }}>Tagihan</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--hijau-gelap)' }}>{rp(Number(t.nominal))}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="muted" style={{ fontSize: 11.5 }}>Dibayar</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--hijau)' }}>{rp(Number(t.dibayar))}</div>
              </div>
              <span className="badge" style={{ background: st.bg, color: st.fg }}>{st.label}</span>
            </div>
          );
        })}
      <div className="alert alert-peringatan">
        <div>Tagihan santri mukim menggabungkan SPP unit sekolah, syahriyah pondok, uang makan, dan laundry dalam satu invoice.</div>
      </div>
    </div>
  );
}
