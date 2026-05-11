/**
 * Konstanta domain Pemakaian Ruangan.
 *
 * Dipakai oleh `ui/rooms-page.tsx` dan sub-komponennya. Diisolasi di sini
 * supaya komponen UI tidak mengandung literal data.
 */
import { DoorOpen, ListChecks, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CreateRoomInput, RoomType } from './types';

export type SlotDef = { start: string; end: string };

/**
 * Slot operasional klinik — 6 slot 90-menit. Sumber tunggal supaya
 * SchedulePage & RoomsPage memetakan slot yang sama.
 */
export const SLOTS: SlotDef[] = [
  { start: '08:00', end: '09:30' },
  { start: '10:00', end: '11:30' },
  { start: '13:00', end: '14:30' },
  { start: '15:00', end: '16:30' },
  { start: '17:00', end: '18:30' },
  { start: '19:00', end: '20:30' },
];

export type RoomTypeStyle = { bg: string; fg: string; icon: LucideIcon };

export const ROOM_TYPE_STYLE: Record<RoomType, RoomTypeStyle> = {
  konseling: {
    bg: 'var(--svc-konseling-soft)',
    fg: 'var(--sage-700)',
    icon: DoorOpen,
  },
  anak: { bg: 'var(--svc-anak-soft)', fg: '#8b3d2a', icon: DoorOpen },
  tes: { bg: 'var(--svc-tes-soft)', fg: '#6b5320', icon: ListChecks },
  seminar: { bg: 'var(--info-soft)', fg: '#2c4a60', icon: Users },
};

/**
 * Default fasilitas per type — fallback ketika `room.description` kosong.
 * Ditampilkan di RoomDetailPanel sebagai badges.
 */
export const DEFAULT_FACILITIES: Record<RoomType, string[]> = {
  konseling: ['Sofa', 'Meja', 'AC', 'Tisu'],
  anak: ['Mainan', 'Karpet', 'Meja kecil', 'Cermin observasi'],
  tes: ['Komputer', 'Meja tunggal', 'Sound proof'],
  seminar: ['Proyektor', 'AC', 'Whiteboard'],
};

export const EMPTY_ROOM: CreateRoomInput = {
  name: '',
  type: 'konseling',
  capacity: 1,
  facilities: [],
  description: '',
  isActive: true,
};
