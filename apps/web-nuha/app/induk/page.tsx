import { redirect } from 'next/navigation';
import { readSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Shell } from '@/components/Shell';

export default async function IndukPage() {
  const session = await readSession();
  if (!session) redirect('/login');
  const santri = await prisma.santri.findMany({
    include: { orang: true, unit: true, kelas: true, kamar: { include: { asrama: true } } },
    orderBy: { nis: 'asc' },
  });

  return <Shell session={session} active="induk" title="Data Induk Santri">
    <div className="card">
      <h3>Satu identitas, banyak peran — {santri.length} santri lintas unit</h3>
      <table>
        <thead><tr><th>NIS</th><th>Nama</th><th>Unit / Kelas</th><th>Asrama</th><th>Program</th><th>Status</th></tr></thead>
        <tbody>
          {santri.map((row) => (
            <tr key={String(row.id)}>
              <td>{row.nis}</td>
              <td><strong>{row.orang.nama}</strong><br /><span className="muted">{row.orang.jk === 'L' ? 'Putra' : 'Putri'}</span></td>
              <td>{row.unit?.key ?? '-'} {row.kelas?.nama ?? ''}</td>
              <td>{row.kamar ? `${row.kamar.asrama.nama} · ${row.kamar.kode}` : '-'}</td>
              <td>{row.program ?? '-'}</td>
              <td><span className={`badge ${row.status === 'Mukim' ? 'badge-hijau' : 'badge-emas'}`}>{row.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Shell>;
}
