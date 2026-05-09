'use client';

import { useMemo } from 'react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { useMe } from '@/features/auth/hooks/use-me';

export default function PsikologPatientsPage() {
  const me = useMe();
  const myUserId = me.data?.data.id;

  // Pasien = unique clients dari booking psikolog ini
  const list = useBookingList({ psikologUserId: myUserId, limit: 200, includeCancelled: true });

  const patients = useMemo(() => {
    const items = list.data?.data ?? [];
    const map = new Map<number, { id: number; name: string; phoneWa: string; gender: string; sessionCount: number }>();
    for (const b of items) {
      const existing = map.get(b.client.id);
      if (existing) {
        existing.sessionCount++;
      } else {
        map.set(b.client.id, {
          id: b.client.id,
          name: b.client.name,
          phoneWa: b.client.phoneWa,
          gender: b.client.gender,
          sessionCount: 1,
        });
      }
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [list.data]);

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="h1">Pasien Saya</h1>
        <p className="caption mt-1">Pasien yang pernah/akan ada sesi dengan {me.data?.data.fullName ?? 'Anda'}.</p>
      </div>

      <div className="card-althea overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 border-b border-border text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Nama</th>
              <th className="px-4 py-2 font-medium">Gender</th>
              <th className="px-4 py-2 font-medium">WA</th>
              <th className="px-4 py-2 font-medium text-right">Total Sesi</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-cream-50">
                <td className="px-4 py-2 font-medium">{p.name}</td>
                <td className="px-4 py-2">{p.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                <td className="px-4 py-2 font-mono text-xs">{p.phoneWa}</td>
                <td className="px-4 py-2 text-right">{p.sessionCount}</td>
              </tr>
            ))}
            {patients.length === 0 && !list.isLoading && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-fg-muted">Belum ada pasien.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="caption text-right">Total: {patients.length} pasien</div>
    </div>
  );
}
