import { prisma } from '@/lib/prisma';
import { Card, Tabel, Kosong, Badge, UKURAN_HALAMAN } from '@/components';
import { whereUnit, type FilterPegawai } from './filter';

export async function TabPresensi({ f }: { f: FilterPegawai }) {
  const pegawai = whereUnit(f.unit);
  const presensi = await prisma.presensiPegawai.findMany({
    where: pegawai ? { pegawai } : {},
    include: { pegawai: { include: { orang: true } } },
    orderBy: [{ tgl: 'desc' }],
    take: UKURAN_HALAMAN,
  });

  return (
    <Card
      judul="Presensi Pegawai"
      sub="Presensi khusus pegawai, terpisah dari presensi santri."
    >
      {presensi.length === 0 ? (
        <Kosong pesan="Belum ada presensi pegawai tercatat." />
      ) : (
        <Tabel kolom={['Tanggal', 'Pegawai', 'Masuk', 'Pulang', 'Status']}>
          {presensi.map((p) => (
            <tr key={String(p.id)}>
              <td>{p.tgl.toLocaleDateString('id-ID')}</td>
              <td>{p.pegawai.orang.nama}</td>
              <td>{p.jamMasuk ?? '-'}</td>
              <td>{p.jamPulang ?? '-'}</td>
              <td><Badge status={p.status} /></td>
            </tr>
          ))}
        </Tabel>
      )}
    </Card>
  );
}
