'use client';

import { useMemo, useState } from 'react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { useMe } from '@/features/auth/hooks/use-me';
import {
  CATEGORY_OPTIONS,
  aggregateClients,
  type AggregatedClient,
} from './_lib/patients-model';
import { PatientDetailAside } from './_components/patient-detail-aside';
import { PatientListTable } from './_components/patient-list-table';
import { PatientsMobile } from './_components/patients-mobile';

type StatusTab = 'Semua' | 'Aktif' | 'Baru' | 'Selesai';
type SortBy = 'next' | 'name' | 'risk';

export default function PsikologPatientsPage() {
  const me = useMe();
  const myUserId = me.data?.data.id;

  const [statusTab, setStatusTab] = useState<StatusTab>('Semua');
  const [katFilter, setKatFilter] = useState<(typeof CATEGORY_OPTIONS)[number]>('Semua');
  const [sortBy, setSortBy] = useState<SortBy>('next');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const list = useBookingList({ psikologUserId: myUserId, limit: 200, includeCancelled: true });

  const allClients = useMemo<AggregatedClient[]>(() => {
    return aggregateClients(list.data?.data ?? []);
  }, [list.data]);

  const counts = useMemo(
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
    if (statusTab === 'Aktif') rows = rows.filter((c) => c.status === 'aktif');
    else if (statusTab === 'Baru') rows = rows.filter((c) => c.status === 'baru');
    else if (statusTab === 'Selesai') rows = rows.filter((c) => c.status === 'paket selesai');
    if (katFilter !== 'Semua') rows = rows.filter((c) => c.category === katFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (c) => c.name.toLowerCase().includes(q) || c.service.toLowerCase().includes(q),
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
      const o = { tinggi: 0, sedang: 1, rendah: 2, 'belum dinilai': 3 } as const;
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

  return (
    <>
      <PatientsMobile
        visible={visible}
        counts={counts}
        todayCount={todayCount}
        isLoading={list.isLoading}
        statusTab={statusTab}
        query={query}
        onSelectTab={setStatusTab}
        onQuery={setQuery}
        onSelect={setSelectedId}
      />

      <div
        className="hidden lg:flex"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
      <PatientListTable
        allClients={allClients}
        visible={visible}
        counts={counts}
        todayCount={todayCount}
        isLoading={list.isLoading}
        statusTab={statusTab}
        katFilter={katFilter}
        sortBy={sortBy}
        query={query}
        selectedId={selectedId}
        onSelectTab={setStatusTab}
        onKatFilter={setKatFilter}
        onSortBy={setSortBy}
        onQuery={setQuery}
        onSelect={setSelectedId}
        onResetFilters={() => {
          setQuery('');
          setKatFilter('Semua');
          setStatusTab('Semua');
        }}
      />
      {selected && <PatientDetailAside selected={selected} />}
      </div>
    </>
  );
}
