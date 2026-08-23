import { prisma } from '@/lib/prisma';
import type { SessionPayload } from '@/lib/auth';
import { Kosong, ProgressBar } from '@/components/ui/primitives';

const warnaKelengkapan = (pct: number) => (pct >= 90 ? '#0F6B3D' : pct >= 60 ? '#E8973A' : '#B91C1C');

/** Tab kelas saya: kelas & mapel yang diampu guru (dicocokkan lewat nama pada jadwal pelajaran). */
export async function TabKelas({ session }: { session: SessionPayload }) {
  const namaGuru = session.nama?.trim();
  if (!namaGuru) return <Kosong pesan="Nama pengguna tidak tersedia." />;

  const jadwal = await prisma.jadwalPelajaran.findMany({
    where: { guru: namaGuru, kelas: { not: null } },
    distinct: ['mapel', 'kelas'],
  });

  if (jadwal.length === 0) return <Kosong pesan="Anda belum diampukan kelas/mapel pada jadwal pelajaran." />;

  const semuaMapel = await prisma.mataPelajaran.findMany();
  const semuaKelas = await prisma.kelas.findMany({ include: { _count: { select: { santri: true } }, santri: true } });
  const hariIni = new Date();
  hariIni.setUTCHours(0, 0, 0, 0);

  const kartu = await Promise.all(jadwal.map(async (j) => {
    const kelas = semuaKelas.find((k) => k.nama === j.kelas);
    const mapel = semuaMapel.find((m) => m.nama === j.mapel);
    const siswaIds = kelas?.santri.map((s) => s.id) ?? [];
    const jumlahSiswa = siswaIds.length;

    let nilaiMasuk = 0;
    if (mapel && jumlahSiswa > 0) {
      const jumlahNilai = await prisma.nilai.count({ where: { mapelId: mapel.id, santriId: { in: siswaIds } } });
      nilaiMasuk = Math.round((jumlahNilai / jumlahSiswa) * 100);
    }

    let presensi = 'Belum ada data presensi hari ini';
    if (jumlahSiswa > 0) {
      const rekap = await prisma.presensi.groupBy({
        by: ['status'],
        where: { santriId: { in: siswaIds }, tgl: hariIni },
        _count: { status: true },
      });
      if (rekap.length > 0) {
        presensi = rekap.map((r) => `${r._count.status} ${r.status.toLowerCase()}`).join(' · ');
      }
    }

    return {
      key: `${j.mapel}-${j.kelas}`,
      kelasNama: j.kelas ?? '-',
      mapel: j.mapel,
      waliKelas: kelas?.waliKelas === namaGuru,
      jumlahSiswa,
      nilaiMasuk,
      presensi,
    };
  }));

  return (
    <div className="grid g2">
      {kartu.map((k) => (
        <div key={k.key} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <h3 className="card-judul">Kelas {k.kelasNama} · {k.mapel}</h3>
              <p className="muted" style={{ marginTop: 3 }}>{k.jumlahSiswa} siswa</p>
            </div>
            {k.waliKelas && <span className="badge badge-kuning">Wali Kelas</span>}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span className="muted">Kelengkapan input nilai</span>
              <strong style={{ color: warnaKelengkapan(k.nilaiMasuk) }}>{k.nilaiMasuk}%</strong>
            </div>
            <ProgressBar pct={k.nilaiMasuk} warna={warnaKelengkapan(k.nilaiMasuk)} />
          </div>
          <div className="muted" style={{ fontSize: 12.5 }}>Presensi hari ini: {k.presensi}</div>
        </div>
      ))}
    </div>
  );
}
