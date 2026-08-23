import { prisma } from '@/lib/prisma';
import { Badge, Kosong, Tabel } from '@/components';

/** Unit di bawah yayasan beserta populasi santri & pegawai per unit. */
export async function TabUnit() {
  const units = await prisma.unit.findMany({
    include: { _count: { select: { santri: true, pegawai: true, kelas: true } } },
    orderBy: { nama: 'asc' },
  });

  return (
    <div className="card">
      <h3 className="card-judul" style={{ marginBottom: 14 }}>Unit di bawah yayasan</h3>
      {units.length === 0 ? (
        <Kosong pesan="Belum ada unit terdaftar." />
      ) : (
        <Tabel kolom={['Unit', 'Kode', 'Deskripsi', { label: 'Santri', num: true }, { label: 'Pegawai', num: true }, 'Status']}>
          {units.map((unit) => (
            <tr key={unit.id}>
              <td style={{ fontWeight: 600 }}>{unit.nama}</td>
              <td className="muted">{unit.key}</td>
              <td className="muted">{unit.deskripsi ?? '-'}</td>
              <td className="num" style={{ fontWeight: 700 }}>{unit._count.santri}</td>
              <td className="num">{unit._count.pegawai}</td>
              <td><Badge status={unit.aktif ? 'Aktif' : 'Nonaktif'} /></td>
            </tr>
          ))}
        </Tabel>
      )}
    </div>
  );
}
