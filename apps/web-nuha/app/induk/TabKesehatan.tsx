import { prisma } from '@/lib/prisma';
import { Kosong } from '@/components';

const formatTgl = (tgl: Date) => tgl.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

/** Tab Kesehatan: rekam medis Poskestren milik santri ini. */
export async function TabKesehatan({ santriId }: { santriId: bigint }) {
  const rekam = await prisma.rekamMedis.findMany({ where: { santriId }, orderBy: { tgl: 'desc' } });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h3 className="card-judul" style={{ marginBottom: 0 }}>Rekam medis Poskestren</h3>
      {rekam.length === 0
        ? <Kosong pesan="Belum ada rekam medis untuk santri ini." />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rekam.map((k) => (
              <div key={String(k.id)} className="inset">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 7 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--hijau)' }}>{formatTgl(k.tgl)}{k.jam ? ` · ${k.jam}` : ''}</span>
                  {k.diagnosis && <span className="badge badge-merah">{k.diagnosis}</span>}
                  <span className="muted" style={{ fontSize: 12 }}>{k.petugas}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--teks-2)', lineHeight: 1.6 }}>
                  <strong>Keluhan:</strong> {k.keluhan}<br />
                  <strong>Terapi:</strong> {k.terapi ?? '-'}<br />
                  <strong>Tindak lanjut:</strong> {k.tindakLanjut ?? '-'}
                </div>
              </div>
            ))}
          </div>
        )}
      <div className="alert alert-info">
        <div>Setiap catatan sakit di atas otomatis mengisi presensi akademik dan absensi jamaah pada tanggal yang sama.</div>
      </div>
    </div>
  );
}
