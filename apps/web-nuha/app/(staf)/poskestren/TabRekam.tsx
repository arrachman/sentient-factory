import { prisma } from '@/lib/prisma';
import { Avatar, Kosong, Tabel } from '@/components';

const WARNA_LANJUT: Record<string, string> = {
  'Rujuk Puskesmas': 'badge-merah',
  'Rawat Poskestren': 'badge-kuning',
};

export async function TabRekam() {
  const rekam = await prisma.rekamMedis.findMany({
    include: { santri: { include: { orang: true, kamar: { include: { asrama: true } } } } },
    orderBy: { tgl: 'desc' },
  });

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3 className="card-judul" style={{ marginBottom: 14 }}>Rekam medis santri</h3>
      {rekam.length === 0 ? <Kosong pesan="Belum ada rekam medis tercatat." /> : (
        <Tabel kolom={['Waktu', 'Pasien', 'Keluhan', 'Diagnosis', 'Terapi', 'Tindak lanjut']}>
          {rekam.map((k) => (
            <tr key={String(k.id)}>
              <td>
                {k.tgl.toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                <div className="muted">{k.jam ?? '-'}</div>
              </td>
              <td>
                <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                  <Avatar nama={k.santri.orang.nama} size={30} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{k.santri.orang.nama}</div>
                    <div className="muted">{k.santri.kamar?.asrama.nama ?? '-'}</div>
                  </div>
                </div>
              </td>
              <td>{k.keluhan}</td>
              <td style={{ fontWeight: 600 }}>{k.diagnosis ?? '-'}</td>
              <td>{k.terapi ?? '-'}</td>
              <td>
                {k.tindakLanjut ? <span className={`badge ${WARNA_LANJUT[k.tindakLanjut] ?? 'badge-netral'}`}>{k.tindakLanjut}</span> : '-'}
              </td>
            </tr>
          ))}
        </Tabel>
      )}
    </div>
  );
}
