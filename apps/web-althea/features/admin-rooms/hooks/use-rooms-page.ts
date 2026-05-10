'use client';

/**
 * Hook orchestrator untuk halaman Pemakaian Ruangan.
 *
 * Konsolidasi:
 *   - Tanggal aktif (state)
 *   - Picked cell (room × slot × booking)
 *   - CRUD drawer state (open / editing / form)
 *   - Sorted rooms list
 *   - Filtered bookings hari aktif
 *   - Stats (utilisasi, ruangan kosong, sesi hari ini)
 *   - Legend psikolog hari aktif
 *   - Mutations & handlers (create / update / delete + handlers)
 *
 * Halaman cuma binding props ke komponen — logic semua di sini biar
 * page.tsx tipis.
 */
import { useEffect, useMemo, useState } from 'react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import type { Booking } from '@/features/admin-booking/model/types';
import { EMPTY_ROOM, SLOTS } from '../model/constants';
import { shortName, todayKey } from '../model/utils';
import {
  useCreateRoom,
  useDeleteRoom,
  useRoomList,
  useUpdateRoom,
} from './use-room';
import type { CreateRoomInput, Room, RoomType } from '../model/types';
import type { LegendPsikolog } from '../ui/room-usage-legend';

const TYPE_ORDER: RoomType[] = ['konseling', 'anak', 'tes', 'seminar'];
const typeOrderIdx = (t: RoomType) => TYPE_ORDER.indexOf(t);

export type PickedCell = {
  room: Room;
  slotIdx: number;
  booking: Booking | null;
};

export function useRoomsPage() {
  // Init '' supaya SSR + client hydration konsisten (todayKey()=new Date()
  // mismatch antara server render & client hydrate). Set today di useEffect.
  const [date, setDate] = useState<string>('');
  useEffect(() => {
    if (!date) setDate(todayKey());
  }, [date]);
  const [picked, setPicked] = useState<PickedCell | null>(null);
  const [crudOpen, setCrudOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [form, setForm] = useState<CreateRoomInput>(EMPTY_ROOM);

  const roomList = useRoomList({ limit: 200, isActive: true });
  const bookingList = useBookingList({
    date,
    limit: 200,
    includeCancelled: false,
  });

  const rooms = useMemo<Room[]>(() => {
    const data = roomList.data?.data ?? [];
    return [...data].sort((a, b) => {
      const oa = typeOrderIdx(a.type);
      const ob = typeOrderIdx(b.type);
      if (oa !== ob) return oa - ob;
      return a.name.localeCompare(b.name);
    });
  }, [roomList.data]);

  const bookings = useMemo<Booking[]>(
    () => bookingList.data?.data ?? [],
    [bookingList.data],
  );

  const stats = useMemo(() => {
    const total = rooms.length;
    const sessions = bookings.length;
    const slotsAvailable = total * SLOTS.length;
    const utilization =
      slotsAvailable > 0 ? Math.round((sessions / slotsAvailable) * 100) : 0;
    const usedIds = new Set(bookings.map((b) => b.room.id));
    const empty = rooms.filter((r) => !usedIds.has(r.id)).length;
    return { total, sessions, slotsAvailable, utilization, empty };
  }, [rooms, bookings]);

  const todayPsikolog = useMemo<LegendPsikolog[]>(() => {
    const map = new Map<number, LegendPsikolog>();
    for (const b of bookings) {
      if (!map.has(b.psikolog.id)) {
        map.set(b.psikolog.id, {
          id: b.psikolog.id,
          short: shortName(b.psikolog.fullName, b.psikolog.email),
          color:
            b.psikolog.clinicPsikologProfile?.color ?? 'var(--sage-500)',
        });
      }
    }
    return Array.from(map.values());
  }, [bookings]);

  const createMut = useCreateRoom();
  const updateMut = useUpdateRoom();
  const deleteMut = useDeleteRoom();
  const submitting = createMut.isPending || updateMut.isPending;

  // ----- Handlers -----

  function pickCell(room: Room, slotIdx: number, booking: Booking | null) {
    setPicked({ room, slotIdx, booking });
  }
  function clearPicked() {
    setPicked(null);
  }

  function startCreate() {
    setEditing(null);
    setForm(EMPTY_ROOM);
    setCrudOpen(true);
  }
  function startEdit(room: Room) {
    setEditing(room);
    setForm({
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      description: room.description ?? '',
      isActive: room.isActive,
    });
    setCrudOpen(true);
  }
  function openCrud() {
    setCrudOpen(true);
  }
  function closeCrud() {
    setCrudOpen(false);
    setEditing(null);
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      updateMut.mutate(
        { id: editing.id, input: form },
        { onSuccess: closeCrud },
      );
    } else {
      createMut.mutate(form, { onSuccess: closeCrud });
    }
  }

  function deleteRoom(room: Room) {
    if (!confirm(`Hapus ruang "${room.name}"?`)) return;
    deleteMut.mutate(room.id, {
      onSuccess: () => {
        if (editing?.id === room.id) closeCrud();
        if (picked?.room.id === room.id) clearPicked();
      },
    });
  }

  return {
    // state
    date,
    setDate,
    picked,
    pickCell,
    clearPicked,
    crudOpen,
    editing,
    form,
    setForm,
    submitting,
    // data
    rooms,
    bookings,
    stats,
    todayPsikolog,
    isLoading: roomList.isLoading || bookingList.isLoading,
    // crud handlers
    startCreate,
    startEdit,
    openCrud,
    closeCrud,
    submitForm,
    deleteRoom,
  };
}
