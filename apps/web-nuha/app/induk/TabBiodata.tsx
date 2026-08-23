import { prisma } from '@/lib/prisma';

const formatTgl = (tgl: Date | null) =>
  tgl ? tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

/** Tab Biodata: identitas dasar dari `Orang` + peran aktifnya sebagai `Santri`. */
export async function TabBiodata({ santriId }: { santriId: bigint }) {
  const santri = await prisma.santri.findUnique({
    where: { id: santriId },
    include: { orang: true, unit: true, kelas: true, kamar: { include: { asrama: true } } },
  });
  if (!santri) return null;

  const jumlahRekamMedis = await prisma.rekamMedis.count({ where: { santriId } });
  const mukim = santri.status === 'Mukim';
  const kalong = santri.status === 'Kalong';

  return (
    <div className="grid g2">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        <h3 className="card-judul" style={{ marginBottom: 0 }}>Identitas</h3>
        <Baris label="Nama lengkap" nilai={santri.orang.nama} />
        <Baris label="Tanggal lahir" nilai={formatTgl(santri.orang.tglLahir)} />
        <Baris label="Tempat lahir" nilai={santri.orang.tmpLahir ?? '-'} />
        <Baris label="Jenis kelamin" nilai={santri.orang.jk === 'L' ? 'Putra' : 'Putri'} />
        <Baris label="Alamat" nilai={santri.orang.alamat ?? '-'} />
        <Baris label="Tahun masuk" nilai={santri.tahunMasuk ?? '-'} terakhir />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        <h3 className="card-judul" style={{ marginBottom: 0 }}>Peran aktif di yayasan</h3>
        <div className="inset">
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--hijau)' }}>Unit {santri.unit?.nama ?? '-'}</div>
          <div className="muted" style={{ marginTop: 3 }}>
            Kelas {santri.kelas?.nama ?? '-'} · presensi &amp; nilai dikelola kepala unit
          </div>
        </div>
        {mukim && (
          <div className="inset" style={{ background: '#FFFBEB', border: '1px solid #F0CFA4' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#92400E' }}>Santri mukim</div>
            <div className="muted" style={{ marginTop: 3 }}>
              Asrama {santri.kamar?.asrama.nama ?? '-'} kamar {santri.kamar?.kode ?? '-'} · program {santri.program ?? '-'}
            </div>
          </div>
        )}
        {kalong && (
          <div className="inset" style={{ background: '#FEF9F3', border: '1px solid #EED9C0' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#9A3412' }}>Santri kalong (tidak mukim)</div>
            <div className="muted" style={{ marginTop: 3 }}>Mengikuti diniyah sore, tidak menempati asrama.</div>
          </div>
        )}
        <div className="inset" style={{ background: '#F5F8FF', border: '1px solid #CBD9F5' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1E40AF' }}>Pasien Poskestren</div>
          <div className="muted" style={{ marginTop: 3 }}>{jumlahRekamMedis} catatan pemeriksaan tercatat pada profil ini.</div>
        </div>
      </div>
    </div>
  );
}

function Baris({ label, nilai, terakhir }: { label: string; nilai: string; terakhir?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, paddingBottom: terakhir ? 0 : 9, borderBottom: terakhir ? 'none' : '1px solid var(--krem-3)' }}>
      <span className="muted">{label}</span>
      <span style={{ fontWeight: 600, color: 'var(--teks-kuat)', textAlign: 'right' }}>{nilai}</span>
    </div>
  );
}
