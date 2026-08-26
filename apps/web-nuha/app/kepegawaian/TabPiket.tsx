import { prisma } from '@/lib/prisma';
import { Card, Tabel, Kosong } from '@/components';

export async function TabPiket() {
  const piket = await prisma.jadwalPiket.findMany({
    include: { pegawai: { include: { orang: true } } },
    orderBy: [{ urutan: 'asc' }],
  });

  return (
    <Card
      judul={`Jadwal Guru Piket — ${piket.length} baris`}
      sub="Sumber: jadwal piket mingguan yang dikonfirmasi client (bukan khusus masa orientasi)."
    >
      {piket.length === 0 ? (
        <Kosong pesan="Belum ada jadwal piket. Data foto sumber belum bisa diimpor otomatis karena sebagian besar nama guru belum cocok ke data Pegawai — menunggu konfirmasi client." />
      ) : (
        <Tabel kolom={['Hari', 'Waktu', 'Guru piket']}>
          {piket.map((p) => (
            <tr key={p.id}>
              <td>{p.hari}</td>
              <td>{p.waktuMulai}–{p.waktuSelesai}</td>
              <td>{p.pegawai?.orang.nama ?? '-'}</td>
            </tr>
          ))}
        </Tabel>
      )}
    </Card>
  );
}
