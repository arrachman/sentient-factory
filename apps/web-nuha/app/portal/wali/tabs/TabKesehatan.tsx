import { prisma } from '@/lib/prisma';
import { Kosong } from '@/components/ui/primitives';

export async function TabKesehatan({ santriId }: { santriId: bigint }) {
  const rekam = await prisma.rekamMedis.findMany({ where: { santriId }, orderBy: { tgl: 'desc' }, take: 15 });

  return (
    <>
      {rekam.length === 0 && <Kosong pesan="Belum ada catatan kesehatan dari poskestren." />}
      {rekam.map((k) => (
        <div key={String(k.id)} style={{ background: '#FFFFFF', border: '1px solid #E8E3D9', borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <span style={{ padding: '4px 10px', borderRadius: 999, background: '#FEE2E2', color: '#991B1B', fontSize: 11.5, fontWeight: 700 }}>{k.diagnosis ?? 'Belum terdiagnosis'}</span>
            <span style={{ fontSize: 11.5, color: '#6B7280' }}>{k.tgl.toLocaleDateString('id-ID')}{k.jam ? ` · ${k.jam}` : ''}</span>
          </div>
          <div style={{ fontSize: 12.5, color: '#374151', lineHeight: 1.65 }}>
            <strong>Keluhan:</strong> {k.keluhan}<br />
            <strong>Terapi:</strong> {k.terapi ?? '-'}<br />
            <strong>Tindak lanjut:</strong> {k.tindakLanjut ?? '-'}<br />
            <strong>Petugas:</strong> {k.petugas}
          </div>
        </div>
      ))}
      <div style={{ padding: '13px 15px', borderRadius: 12, background: '#F5F8FF', border: '1px solid #CBD9F5', fontSize: 12, color: '#1E3A8A', lineHeight: 1.6 }}>
        Setiap catatan sakit otomatis menjadi keterangan presensi sekolah — tidak perlu surat izin terpisah.
      </div>
    </>
  );
}
