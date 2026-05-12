'use client';

/**
 * Hook orchestrator untuk halaman Klien saya:
 *   - Fetch booking psikolog saat ini, aggregate ke klien unique
 *   - Filter (status tab + search + kategori) + sort + auto-select first
 *   - Counts per status
 */
import { useMemo, useState } from 'react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { useMe } from '@/features/auth/hooks/use-me';
import {
  type AggregatedClient,
  type CategoryOption,
  type RiskLevel,
  type SortKey,
  type StatusTab,
} from '../model/types';
import { aggregateClients } from '../model/aggregate';

export function usePatientsPage() {
  const me = useMe();
  const myUserId = me.data?.data.id;

  const [statusTab, setStatusTab] = useState<StatusTab>('Semua');
  const [katFilter, setKatFilter] = useState<CategoryOption>('Semua');
  const [sortBy, setSortBy] = useState<SortKey>('next');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const list = useBookingList({
    psikologUserId: myUserId,
    limit: 200,
    includeCancelled: true,
  });

  const allClients = useMemo<AggregatedClient[]>(() => {
    const items = list.data?.data ?? [];
    return aggregateClients(items);
  }, [list.data]);

  const counts: Record<StatusTab, number> = useMemo(
    () => ({
      Semua: allClients.length,
      Aktif: allClients.filter((c) => c.status === 'aktif').length,
      Baru: allClients.filter((c) => c.status === 'baru').length,
      Selesai: allClients.filter((c) => c.status === 'paket selesai').length,
    }),
    [allClients],
  );

  const todayCount = useMemo(
    () => allClients.filter((c) => c.next.startsWith('Hari ini')).length,
    [allClients],
  );

  const visible = useMemo(() => {
    let rows = allClients.slice();
    if (statusTab === 'Aktif')
      rows = rows.filter((c) => c.status === 'aktif');
    else if (statusTab === 'Baru')
      rows = rows.filter((c) => c.status === 'baru');
    else if (statusTab === 'Selesai')
      rows = rows.filter((c) => c.status === 'paket selesai');
    if (katFilter !== 'Semua')
      rows = rows.filter((c) => c.category === katFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.service.toLowerCase().includes(q),
      );
    }
    if (sortBy === 'next') {
      rows.sort((a, b) => {
        if (a.next === '—') return 1;
        if (b.next === '—') return -1;
        return a.next.localeCompare(b.next);
      });
    } else if (sortBy === 'name') {
      rows.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'risk') {
      const o: Record<RiskLevel, number> = {
        tinggi: 0,
        sedang: 1,
        rendah: 2,
        'belum dinilai': 3,
      };
      rows.sort((a, b) => o[a.risk] - o[b.risk]);
    }
    return rows;
  }, [allClients, statusTab, katFilter, sortBy, query]);

  const selected: AggregatedClient | null = useMemo(() => {
    if (allClients.length === 0) return null;
    if (selectedId !== null) {
      const found = allClients.find((c) => c.id === selectedId);
      if (found) return found;
    }
    return visible[0] ?? allClients[0] ?? null;
  }, [selectedId, visible, allClients]);

  function resetFilters() {
    setQuery('');
    setKatFilter('Semua');
    setStatusTab('Semua');
  }

  return {
    statusTab,
    setStatusTab,
    katFilter,
    setKatFilter,
    sortBy,
    setSortBy,
    query,
    setQuery,
    selectedId,
    setSelectedId,
    allClients,
    counts,
    todayCount,
    visible,
    selected,
    isLoading: list.isLoading,
    resetFilters,
  };
}
