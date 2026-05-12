'use client';

/**
 * Hook orchestrator untuk halaman Audit Log:
 *   - Filter state (kategori + search)
 *   - Selected event id
 *   - Derived: events filtered, counts per kategori, stats (4 metrics)
 *   - Auto-select first event on filter change
 *   - Total label untuk action bar
 *
 * Halaman tinggal binding props ke komponen.
 */
import { useEffect, useMemo, useState } from 'react';
import { useAuditLogs } from './use-audit';
import {
  type AuditCategory,
  type AuditEvent,
} from '../model/types';
import { isToday } from '../model/format';

const CLIENT_CHANGE_LABELS = [
  'Tambah data klien',
  'Ubah data klien',
  'Hapus data klien',
];

export function useAuditPage() {
  const [cat, setCat] = useState<AuditCategory>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useAuditLogs({ limit: 200 });
  const allEvents = useMemo<AuditEvent[]>(() => data?.events ?? [], [data]);

  const byCategory = useMemo(
    () => (cat === 'all' ? allEvents : allEvents.filter((e) => e.category === cat)),
    [allEvents, cat],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return byCategory;
    return byCategory.filter((e) =>
      [e.actionLabel, e.target, e.actor, e.actorRole, e.meta, e.ip, e.device]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [byCategory, search]);

  // Auto-select first; sticky if still in filtered
  useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null);
      return;
    }
    if (selectedId == null || !filtered.some((e) => e.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected = filtered.find((e) => e.id === selectedId) ?? filtered[0];

  const counts = useMemo(() => {
    const map: Partial<Record<AuditCategory, number>> = {};
    for (const e of allEvents) {
      map[e.category] = (map[e.category] ?? 0) + 1;
    }
    map.all = allEvents.length;
    return map;
  }, [allEvents]);

  const stats = useMemo(() => {
    const today = allEvents.filter((e) => isToday(e.iso));
    const denied = allEvents.filter(
      (e) => e.severity === 'danger' && /denied|br/i.test(e.actionLabel),
    );
    const loginFail = allEvents.filter(
      (e) => e.category === 'auth' && e.severity === 'danger',
    );
    const clientChanges = allEvents.filter(
      (e) =>
        e.category === 'klien' &&
        CLIENT_CHANGE_LABELS.includes(e.actionLabel),
    );
    const uniqueClientUsers = new Set(
      clientChanges.map((e) => e.raw.userId).filter((u) => u != null),
    ).size;
    return {
      todayCount: today.length,
      deniedCount: denied.length,
      loginFailCount: loginFail.length,
      clientChangesCount: clientChanges.length,
      clientChangesActiveUsers: uniqueClientUsers,
    };
  }, [allEvents]);

  const totalLabel = useMemo(() => {
    const today = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return `${allEvents.length} event · ${today} (hari ini)`;
  }, [allEvents.length]);

  return {
    cat,
    setCat,
    search,
    setSearch,
    selected,
    setSelectedId,
    allEvents,
    filtered,
    counts,
    stats,
    totalLabel,
    isLoading,
    isError,
    refetch,
  };
}
