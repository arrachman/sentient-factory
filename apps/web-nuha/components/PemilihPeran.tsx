import { prisma } from '@/lib/prisma';
import { gantiPeran } from '@/lib/samaran';
import { PERAN_SUPERADMIN, type SessionPayload } from '@/lib/auth';

/**
 * Pemilih peran untuk super admin. Submit biasa lewat Server Action, tanpa
 * 'use client': memilih opsi mengirim form dan halaman dirender ulang dengan
 * menu milik peran yang dipilih.
 */
export async function PemilihPeran({ session }: { session: SessionPayload }) {
  const daftar = await prisma.peran.findMany({
    where: { key: { not: PERAN_SUPERADMIN } },
    orderBy: { nama: 'asc' },
  });
  const sedang = session.peranAsli ? session.peran[0] : '';

  return (
    <form action={gantiPeran} className="samaran">
      <label htmlFor="samaran-peran" className="label" style={{ margin: 0 }}>Lihat sebagai</label>
      <select id="samaran-peran" name="peran" defaultValue={sedang}>
        <option value="">Super admin (peran asli)</option>
        {daftar.map((peran) => (
          <option key={peran.key} value={peran.key}>{peran.nama}</option>
        ))}
      </select>
      <button type="submit" className="btn-sekunder">Terapkan</button>
    </form>
  );
}
