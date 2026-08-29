import { prisma } from '@/lib/prisma';
import { Avatar, Kosong, kelasStatus } from '@/components';
import { ubahStatusIzin } from './actions';

/** Overdue = izin Disetujui, sudah lewat jadwal kembali, tapi belum ditandai Selesai. */
export async function TabIzin() {
  const izin = await prisma.izin.findMany({
    include: { santri: { include: { orang: true, kamar: true } } },
    orderBy: { keluarAt: 'desc' },
  });

  const sekarang = new Date();
  const baris = izin.map((z) => ({
    ...z,
    overdue: z.status === 'Disetujui' && !!z.kembaliAt && z.kembaliAt < sekarang,
    perluAksi: z.status === 'Menunggu',
  }));
  const menunggu = baris.filter((z) => z.perluAksi).length;
  const telat = baris.filter((z) => z.overdue).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <section className="grid g3">
        <div className="card">
          <div className="label">Menunggu persetujuan</div>
          <div className="angka" style={{ color: '#E8973A' }}>{menunggu}</div>
        </div>
        <div className="card">
          <div className="label">Telat kembali</div>
          <div className="angka" style={{ color: '#B91C1C' }}>{telat}</div>
        </div>
        <div className="card">
          <div className="label">Alur izin</div>
          <div className="muted" style={{ marginTop: 6, lineHeight: 1.6 }}>Ajukan → Disetujui → Keluar → Kembali</div>
        </div>
      </section>

      {baris.length === 0 ? (
        <Kosong pesan="Belum ada pengajuan izin." />
      ) : (
        <section className="grid g2">
          {baris.map((z) => (
            <div
              key={String(z.id)}
              className="card"
              style={{ borderLeft: `4px solid ${z.overdue ? '#B91C1C' : '#0F6B3D'}`, display: 'flex', flexDirection: 'column', gap: 11 }}
            >
              <div style={{ display: 'flex', gap: 11, alignItems: 'center', flexWrap: 'wrap' }}>
                <Avatar nama={z.santri.orang.nama} size={34} />
                <div style={{ flex: 1, minWidth: 130 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{z.santri.orang.nama}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{z.kode} · kamar {z.santri.kamar?.kode ?? '—'}</div>
                </div>
                <span className={`badge ${kelasStatus(z.status)}`}>{z.status}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                {z.alasan}
                <div className="muted" style={{ fontSize: 12, marginTop: 3 }}>Penjemput: {z.penjemput ?? '—'}</div>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 12, flexWrap: 'wrap' }}>
                <span>Keluar: <strong>{z.keluarAt.toLocaleString('id-ID')}</strong></span>
                <span>Kembali: <strong>{z.kembaliAt ? z.kembaliAt.toLocaleString('id-ID') : '—'}</strong></span>
              </div>
              {z.overdue && (
                <div className="alert alert-kritis" style={{ padding: '9px 12px', fontSize: 12 }}>
                  Santri belum kembali — sudah melewati batas waktu.
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {z.perluAksi && (
                  <>
                    <form action={ubahStatusIzin}>
                      <input type="hidden" name="id" value={String(z.id)} />
                      <input type="hidden" name="aksi" value="setuju" />
                      <button type="submit" className="btn">Setujui</button>
                    </form>
                    <form action={ubahStatusIzin}>
                      <input type="hidden" name="id" value={String(z.id)} />
                      <input type="hidden" name="aksi" value="tolak" />
                      <button type="submit" className="btn-sekunder" style={{ color: '#991B1B' }}>Tolak</button>
                    </form>
                  </>
                )}
                {z.status !== 'Selesai' && (
                  <form action={ubahStatusIzin}>
                    <input type="hidden" name="id" value={String(z.id)} />
                    <input type="hidden" name="aksi" value="kembali" />
                    <button type="submit" className="btn-sekunder">Tandai sudah kembali</button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
