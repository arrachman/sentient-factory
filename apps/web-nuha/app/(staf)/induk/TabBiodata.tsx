import { prisma } from '@/lib/prisma';

const formatTgl = (tgl: Date | null) =>
  tgl ? tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

/** "Anak ke-2 dari 3 saudara"; luwes bila salah satu angkanya belum diisi. */
const formatAnakKe = (anakKe: number | null, jumlahSaudara: number | null) => {
  if (anakKe === null && jumlahSaudara === null) return '-';
  if (anakKe === null) return `dari ${jumlahSaudara} saudara`;
  if (jumlahSaudara === null) return `ke-${anakKe}`;
  return `ke-${anakKe} dari ${jumlahSaudara} saudara`;
};

/** Tab Biodata: identitas dasar dari `Orang` + peran aktifnya sebagai `Santri`. */
export async function TabBiodata({ santriId }: { santriId: bigint }) {
  const santri = await prisma.santri.findUnique({
    where: { id: santriId },
    include: {
      orang: { include: { riwayatPendidikan: { include: { unit: true, tahunAjaran: true }, orderBy: { tahunAjaran: { kode: 'desc' } } }, region: true } },
      unit: true, kelas: true, kamar: { include: { asrama: true } },
    },
  });
  if (!santri) return null;

  const alamatTampil = santri.orang.region
    ? [santri.orang.alamat, santri.orang.region.fullName ?? `${santri.orang.region.typeLabel ?? ''} ${santri.orang.region.name}`.trim()]
        .filter(Boolean)
        .join(', ')
    : santri.orang.alamat ?? '-';

  const jumlahRekamMedis = await prisma.rekamMedis.count({ where: { santriId } });
  const mukim = santri.status === 'Mukim';

  return (
    <div className="grid g2">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        <h3 className="card-judul" style={{ marginBottom: 0 }}>Identitas</h3>
        <Baris label="Nama lengkap" nilai={santri.orang.nama} />
        <Baris label="Tanggal lahir" nilai={formatTgl(santri.orang.tglLahir)} />
        <Baris label="Tempat lahir" nilai={santri.orang.tmpLahir ?? '-'} />
        <Baris label="Jenis kelamin" nilai={santri.orang.jk === 'L' ? 'Putra' : 'Putri'} />
        <Baris label="NIK" nilai={santri.orang.nik ?? '-'} />
        <Baris label="No. KK" nilai={santri.orang.noKk ?? '-'} />
        <Baris label="Alamat" nilai={alamatTampil} />
        <Baris label="Anak ke" nilai={formatAnakKe(santri.orang.anakKe, santri.orang.jumlahSaudara)} />
        <Baris label="Hobi" nilai={santri.orang.hobi ?? '-'} />
        <Baris label="Cita-cita" nilai={santri.orang.citaCita ?? '-'} />
        <Baris label="No. HP" nilai={santri.orang.hp ?? '-'} />
        <Baris label="Asal sekolah" nilai={santri.orang.asalSekolah ?? '-'} />
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
        {santri.orang.riwayatPendidikan.map((riwayat) => (
          <div key={String(riwayat.id)} className="inset" style={{ background: '#F5F8FF', border: '1px solid #CBD9F5' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1E40AF' }}>Riwayat pendidikan</div>
            <div className="muted" style={{ marginTop: 3 }}>
              {riwayat.status} {riwayat.unit.nama} · kelas {riwayat.kelasNama} · tahun ajaran {riwayat.tahunAjaran.kode} {riwayat.tahunAjaran.semester}
            </div>
          </div>
        ))}
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
