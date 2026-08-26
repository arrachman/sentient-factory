import { prisma } from '@/lib/prisma';
import { Card, Tabel, Kosong } from '@/components';

export async function TabBebanJam() {
  const beban = await prisma.bebanJam.findMany({
    include: { pegawai: { include: { orang: true } }, tahunAjaran: true },
    orderBy: [{ id: 'desc' }],
  });

  return (
    <Card
      judul="Beban Jam Mengajar"
      sub="Struktur data mengikuti SK Pembagian Tugas Guru 2026 — kolom jumlah jam di dokumen sumber KOSONG, belum diisi client. Menunggu data resmi sebelum diimpor."
    >
      {beban.length === 0 ? (
        <Kosong pesan="Belum ada beban jam tercatat — menunggu angka resmi dari client." />
      ) : (
        <Tabel kolom={['Pegawai', 'Tahun ajaran', 'Mapel', { label: 'Jumlah jam', num: true }, 'Keterangan']}>
          {beban.map((b) => (
            <tr key={String(b.id)}>
              <td>{b.pegawai.orang.nama}</td>
              <td>{b.tahunAjaran ? `${b.tahunAjaran.kode} ${b.tahunAjaran.semester}` : '-'}</td>
              <td>{b.mapel ?? '-'}</td>
              <td className="num">{b.jumlahJam ?? '-'}</td>
              <td>{b.keterangan ?? '-'}</td>
            </tr>
          ))}
        </Tabel>
      )}
    </Card>
  );
}
