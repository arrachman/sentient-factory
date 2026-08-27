'use client';

import { useRouter } from 'next/navigation';
import { OPSI_LIMIT } from '@/components/utils/pagination';

/** Dropdown "baris per halaman" — navigasi ke halaman 1 dengan limit baru. */
export function LimitPicker({ limit, hrefBase, query = '' }: { limit: number; hrefBase: string; query?: string }) {
  const router = useRouter();
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5 }} className="muted">
      Baris per halaman
      <select
        value={limit}
        onChange={(event) => router.push(`${hrefBase}?limit=${event.target.value}${query}`)}
        style={{ padding: '5px 8px', border: '1px solid var(--garis-input)', borderRadius: 8, fontSize: 12.5 }}
      >
        {OPSI_LIMIT.map((opsi) => <option key={opsi} value={opsi}>{opsi}</option>)}
      </select>
    </label>
  );
}
