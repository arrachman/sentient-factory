import { prisma } from '@/lib/prisma';
import { Avatar, Badge, Kosong, Tabel } from '@/components';

/** Pengguna & peran, difilter lewat query param `q` (nama atau email). */
export async function TabPengguna({ q }: { q: string }) {
  const users = await prisma.user.findMany({
    where: q
      ? { OR: [{ email: { contains: q } }, { orang: { nama: { contains: q } } }] }
      : undefined,
    include: { orang: true, peran: { include: { peran: true } } },
    orderBy: { email: 'asc' },
  });

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
        <h3 className="card-judul" style={{ marginBottom: 0 }}>Pengguna &amp; peran</h3>
        <form method="get" style={{ display: 'flex' }}>
          <input type="hidden" name="tab" value="pengguna" />
          <input className="field" name="q" defaultValue={q} placeholder="Cari nama / email" style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--garis)', minWidth: 230 }} />
        </form>
      </div>
      {users.length === 0 ? (
        <Kosong pesan="Belum ada pengguna yang cocok." />
      ) : (
        <Tabel kolom={['Pengguna', 'Peran', 'Cakupan unit', 'Status']}>
          {users.map((user) => (
            <tr key={String(user.id)}>
              <td>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Avatar nama={user.orang.nama} size={30} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{user.orang.nama}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{user.email}</div>
                  </div>
                </div>
              </td>
              <td>{user.peran.map((r) => r.peran.nama).join(', ') || '-'}</td>
              <td className="muted">{user.unitScope ?? 'Seluruh unit'}</td>
              <td><Badge status={user.aktif ? 'Aktif' : 'Nonaktif'} /></td>
            </tr>
          ))}
        </Tabel>
      )}
    </div>
  );
}
