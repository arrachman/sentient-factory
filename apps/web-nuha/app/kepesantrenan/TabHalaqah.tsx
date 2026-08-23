import { prisma } from '@/lib/prisma';
import { Kosong, Tabel } from '@/components/ui/primitives';

export async function TabHalaqah() {
  const halaqah = await prisma.halaqah.findMany({ orderBy: { nama: 'asc' } });

  return (
    <div className="card">
      <div className="card-judul">Jadwal halaqah &amp; kajian kitab</div>
      {halaqah.length === 0 ? (
        <Kosong pesan="Belum ada jadwal halaqah." />
      ) : (
        <Tabel kolom={['Halaqah', 'Pengampu', 'Waktu', 'Tempat', 'Jenjang', { label: 'Anggota', num: true }]}>
          {halaqah.map((h) => (
            <tr key={h.id}>
              <td>{h.nama}</td>
              <td>{h.ustadz}</td>
              <td>{h.waktu}</td>
              <td>{h.tempat}</td>
              <td>{h.jenjang}</td>
              <td className="num"><strong>{h.anggota}</strong></td>
            </tr>
          ))}
        </Tabel>
      )}
    </div>
  );
}
