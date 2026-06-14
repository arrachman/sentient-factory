'use client';

/**
 * Hook untuk halaman /psikolog/rooms (read-only mirror dari admin-rooms).
 *
 * Logic:
 *   - Anchor date (init '' utk SSR-safe, post-mount → todayKey)
 *   - Filter by RoomType (chip toggle)
 *   - Fetch rooms (sorted: konseling > anak > tes > seminar)
 *   - Fetch bookings(date) — semua psikolog, karena ini view klinik-wide
 *     (psikolog perlu cek slot ruangan favorit-nya kosong vs busy lewat
 *     psikolog lain)
 *   - Derived stats (sama dengan admin): total, sessions today, utilization,
 *     empty rooms
 */
import { useEffect, useMemo, useState } from 'react';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import type {
  Room,
  RoomType,
} from '@/features/admin-rooms/model/types';
import type { Booking } from '@/features/admin-booking/model/types';

function pad(n: number) {
  return String(n).padStart(2, '0');
}
function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function todayKey(): string {
  return toDateKey(new Date());
}
function shiftDate(key: string, days: number): string {
  const d = new Date(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

const TYPE_ORDER: Record<RoomType, number> = {
  konseling: 0,
  anak: 1,
  tes: 2,
  seminar: 3,
};

export function usePsikologRooms() {
  const [date, setDate] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<RoomType | 'all'>('all');
  const [picked, setPicked] = useState<{
    room: Room;
    slotIdx: number;
    booking: Booking | null;
  } | null>(null);

  useEffect(() => {
    if (!date) setDate(todayKey());
  }, [date]);

  const settingsQuery = useSettings();
  const slots = useMemo(
    () => settingsQuery.data?.data.slotsOfDay ?? [],
    [settingsQuery.data],
  );

  const roomList = useRoomList({ limit: 200, isActive: true });
  const bookingList = useBookingList({
    date: date || todayKey(),
    limit: 200,
    includeCancelled: false,
  });

  const allRooms = useMemo(() => {
    const data = roomList.data?.data ?? [];
    return [...data].sort((a, b) => {
      const oa = TYPE_ORDER[a.type as RoomType] ?? 99;
      const ob = TYPE_ORDER[b.type as RoomType] ?? 99;
      if (oa !== ob) return oa - ob;
      return a.name.localeCompare(b.name);
    });
  }, [roomList.data]);

  const rooms = useMemo(() => {
    if (typeFilter === 'all') return allRooms;
    return allRooms.filter((r) => r.type === typeFilter);
  }, [allRooms, typeFilter]);

  const bookings = bookingList.data?.data ?? [];

  // Stats
  const stats = useMemo(() => {
    const total = rooms.length;
    const sessions = bookings.filter((b) =>
      rooms.some((r) => r.id === b.room.id),
    ).length;
    const slotsAvailable = total * slots.length;
    const utilization =
      slotsAvailable > 0 ? Math.round((sessions / slotsAvailable) * 100) : 0;
    const usedIds = new Set(bookings.map((b) => b.room.id));
    const empty = rooms.filter((r) => !usedIds.has(r.id)).length;
    return { total, sessions, slotsAvailable, utilization, empty };
  }, [rooms, bookings, slots]);

  function pickCell(room: Room, slotIdx: number, booking: Booking | null) {
    setPicked({ room, slotIdx, booking });
  }
  function clearPicked() {
    setPicked(null);
  }

  function shiftPrev() {
    if (!date) return;
    setDate(shiftDate(date, -1));
  }
  function shiftNext() {
    if (!date) return;
    setDate(shiftDate(date, 1));
  }
  function resetToToday() {
    setDate(todayKey());
  }

  const isLoading = roomList.isLoading || bookingList.isLoading;
  const ready = !!date;

  return {
    date,
    setDate,
    typeFilter,
    setTypeFilter,
    rooms,
    allRooms,
    bookings,
    stats,
    slots,
    picked,
    pickCell,
    clearPicked,
    shiftPrev,
    shiftNext,
    resetToToday,
    isLoading,
    ready,
  };
}
