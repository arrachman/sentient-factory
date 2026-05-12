'use client';

/**
 * Hook orchestrator untuk halaman Catatan Klinis (psikolog).
 *
 *   - Fetch booking psikolog sendiri (recent + completed)
 *   - Auto-select sesi terbaru saat data loaded
 *   - Fetch existing notes per sesi terpilih
 *   - Sync SOAP form ↔ note text (parse + serialize)
 *   - Save mutation (POST /booking/:id/note)
 */
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { useMe } from '@/features/auth/hooks/use-me';
import type { Booking } from '@/features/admin-booking/model/types';
import {
  parseSOAPFromNote,
  serializeSOAP,
  toServiceKind,
} from '../model/format';
import type {
  ClinicalNoteListResponse,
  ServiceKind,
} from '../model/types';

export function usePsikologSessions() {
  const me = useMe();
  const myUserId = me.data?.data.id;
  const qc = useQueryClient();

  const list = useBookingList({
    psikologUserId: myUserId,
    limit: 50,
    includeCancelled: false,
  });

  const items = useMemo<Booking[]>(() => {
    const data = list.data?.data ?? [];
    return [...data].sort(
      (a, b) =>
        new Date(b.scheduledStart).getTime() -
        new Date(a.scheduledStart).getTime(),
    );
  }, [list.data]);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Auto-select sesi paling baru saat list loaded
  useEffect(() => {
    if (selectedId === null && items.length > 0) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  const selected: Booking | null = useMemo(() => {
    if (selectedId === null) return null;
    return items.find((b) => b.id === selectedId) ?? null;
  }, [selectedId, items]);

  // Fetch notes for selected booking
  const notesQuery = useQuery({
    queryKey: ['clinic', 'booking', selected?.id, 'notes'],
    queryFn: () =>
      apiClient.get<ClinicalNoteListResponse>(
        `/booking/${selected!.id}/note`,
      ),
    enabled: !!selected?.id,
  });

  const inferredKind: ServiceKind = selected
    ? toServiceKind(selected.service.category)
    : 'dewasa';
  const [kind, setKind] = useState<ServiceKind>('dewasa');

  // Sync `kind` ke inferred saat user pilih sesi lain
  useEffect(() => {
    setKind(inferredKind);
  }, [selected?.id, inferredKind]);

  const [soap, setSoap] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Load latest note ke form saat data berubah
  useEffect(() => {
    const latest = notesQuery.data?.data?.[0];
    if (latest) {
      setSoap(parseSOAPFromNote(latest.noteText, kind));
      setSavedAt(
        new Date(latest.createdAt).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
    } else if (selected) {
      setSoap({});
      setSavedAt(null);
    }
  }, [notesQuery.data, selected?.id, kind]);

  const saveMut = useMutation({
    mutationFn: async () => {
      if (!selected) throw new Error('Pilih sesi dulu');
      const noteText = serializeSOAP(soap, kind);
      if (!noteText.trim())
        throw new Error('Isi minimal satu bagian SOAP sebelum simpan');
      return apiClient.post(`/booking/${selected.id}/note`, { noteText });
    },
    onSuccess: () => {
      toast.success('Catatan tersimpan');
      qc.invalidateQueries({
        queryKey: ['clinic', 'booking', selected?.id, 'notes'],
      });
      setSavedAt(
        new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      );
    },
    onError: (e: Error) =>
      toast.error('Gagal simpan', { description: e.message }),
  });

  return {
    items,
    isLoadingList: list.isLoading,
    selectedId,
    setSelectedId,
    selected,
    kind,
    setKind,
    soap,
    setSoap,
    savedAt,
    save: () => saveMut.mutate(),
    saving: saveMut.isPending,
  };
}
