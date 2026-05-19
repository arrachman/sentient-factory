'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api-client';
import {
  usePsikologList,
  usePsikologAvailabilityForDate,
} from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { resolveServiceSlots } from '@/features/admin-layanan/model/slot';
import { DateStrip } from './booking-wizard/date-strip';
import { SlotGrid } from './booking-wizard/slot-grid';
import { buildIso, pastSlotIdx, toDateKey } from './booking-wizard/wizard-utils';
import type { Booking } from '../model/types';

function isoToDateKey(iso: string): string {
  return toDateKey(new Date(iso));
}

function isoToTimeHHMM(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function RescheduleDialog({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlotIdx, setSelectedSlotIdx] = useState<number | null>(null);
  const [psikologUserId, setPsikologUserId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [reason, setReason] = useState('');

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const settingsQuery = useSettings();
  const qc = useQueryClient();

  const globalSlots = settingsQuery.data?.data.slotsOfDay ?? [];
  const closedDays = settingsQuery.data?.data.closedDayOfWeek ?? [];
  const holidays = settingsQuery.data?.data.holidays ?? [];

  // Service lengkap dengan slotOverrides untuk resolve slot yang tepat
  const selectedService = useMemo(
    () => serviceList.data?.data.find((sv) => sv.id === booking?.serviceId),
    [serviceList.data, booking?.serviceId],
  );

  const slots = useMemo(
    () => resolveServiceSlots(globalSlots, selectedService?.slotOverrides),
    [globalSlots, selectedService],
  );

  // Filter psikolog by serviceIds (konsisten dengan booking wizard)
  const psikologListFiltered = useMemo(() => {
    const all = psikologList.data?.data ?? [];
    if (!booking?.serviceId) return all;
    return all.filter((p) => {
      const ids = p.serviceIds ?? [];
      return ids.length === 0 || ids.includes(booking.serviceId);
    });
  }, [psikologList.data, booking?.serviceId]);

  const selectedPsikolog = useMemo(
    () => psikologList.data?.data.find((p) => p.userId === psikologUserId) ?? null,
    [psikologList.data, psikologUserId],
  );

  // Init state saat booking berubah
  useEffect(() => {
    if (booking) {
      setSelectedDate(isoToDateKey(booking.scheduledStart));
      setPsikologUserId(booking.psikologUserId);
      setRoomId(booking.roomId);
      setReason('');
      setSelectedSlotIdx(null);
    }
  }, [booking]);

  // Pre-select slot saat slots selesai load
  useEffect(() => {
    if (!booking || slots.length === 0 || selectedSlotIdx !== null) return;
    const currentTime = isoToTimeHHMM(booking.scheduledStart);
    const idx = slots.findIndex((s) => s.start === currentTime);
    if (idx !== -1) setSelectedSlotIdx(idx);
  }, [booking, slots, selectedSlotIdx]);

  // Availability psikolog di tanggal terpilih
  const availabilityQuery = usePsikologAvailabilityForDate(psikologUserId, selectedDate);
  const resolvedAvailability = availabilityQuery.data?.data;

  const psikologClosedToday = useMemo(() => {
    if (!psikologUserId || !selectedDate || !resolvedAvailability) return false;
    return !resolvedAvailability.isOpen;
  }, [resolvedAvailability, psikologUserId, selectedDate]);

  // Booking psikolog di tanggal terpilih (untuk hitung slot conflict)
  const psikologDayBookings = useBookingList({
    psikologUserId: psikologUserId ?? undefined,
    date: psikologUserId && selectedDate ? selectedDate : undefined,
    limit: 50,
    includeCancelled: false,
  });

  // Semua booking di tanggal terpilih (untuk hitung ruangan terpakai)
  const allDayBookings = useBookingList({
    date: selectedDate || undefined,
    limit: 100,
    includeCancelled: false,
  });

  // Slot tidak tersedia — exclude booking saat ini dari conflict check
  const unavailableSlotIdx = useMemo(() => {
    if (!psikologUserId || !selectedDate) return new Set<number>();
    if (psikologClosedToday) return new Set<number>(slots.map((_, i) => i));

    const taken = pastSlotIdx(selectedDate, slots);
    const allowed = resolvedAvailability?.slotIndices;
    if (allowed !== null && allowed !== undefined) {
      const allowedSet = new Set(allowed);
      slots.forEach((_, idx) => {
        if (!allowedSet.has(idx)) taken.add(idx);
      });
    }
    // Booking lain milik psikolog ini di hari yang sama (exclude booking ini sendiri)
    const bookings = (psikologDayBookings.data?.data ?? []).filter(
      (b) => b.id !== booking?.id,
    );
    for (const b of bookings) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      slots.forEach((slot, idx) => {
        const sStart = new Date(`${selectedDate}T${slot.start}:00`).getTime();
        const sEnd = new Date(`${selectedDate}T${slot.end}:00`).getTime();
        if (bStart < sEnd && bEnd > sStart) taken.add(idx);
      });
    }
    return taken;
  }, [
    psikologDayBookings.data,
    slots,
    selectedDate,
    psikologUserId,
    psikologClosedToday,
    resolvedAvailability,
    booking?.id,
  ]);

  // Ruangan terpakai di slot terpilih (exclude booking ini sendiri)
  const selectedSlot = selectedSlotIdx !== null ? slots[selectedSlotIdx] : null;
  const occupiedRoomIds = useMemo(() => {
    if (!selectedDate || !selectedSlot) return new Set<number>();
    const sStart = new Date(`${selectedDate}T${selectedSlot.start}:00`).getTime();
    const sEnd = new Date(`${selectedDate}T${selectedSlot.end}:00`).getTime();
    const occupied = new Set<number>();
    for (const b of (allDayBookings.data?.data ?? []).filter((b) => b.id !== booking?.id)) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      if (bStart < sEnd && bEnd > sStart) occupied.add(b.roomId);
    }
    return occupied;
  }, [allDayBookings.data, selectedDate, selectedSlot, booking?.id]);

  const mut = useMutation({
    mutationFn: async (payload: object) => {
      if (!booking) throw new Error('No booking selected');
      return apiClient.post(`/booking/${booking.id}/reschedule`, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success('Booking di-reschedule');
      onClose();
    },
    onError: (err: Error) => {
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as { conflictType?: string; conflictBookingId?: number };
        toast.error(`Conflict ${body?.conflictType}`, {
          description: `Bertabrakan dengan booking #${body?.conflictBookingId}.`,
        });
        return;
      }
      toast.error('Gagal reschedule', { description: err.message });
    },
  });

  if (!booking) return null;

  const canSubmit =
    !!selectedDate && selectedSlotIdx !== null && !!psikologUserId && !mut.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !selectedSlot) return;
    mut.mutate({
      scheduledStart: buildIso(selectedDate, selectedSlot.start),
      scheduledEnd: buildIso(selectedDate, selectedSlot.end),
      psikologUserId: psikologUserId ?? undefined,
      roomId: roomId ?? undefined,
      reason: reason.trim() || undefined,
    });
  }

  const overrideReason =
    resolvedAvailability?.source === 'override' ? resolvedAvailability.reason : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea w-full max-w-xl max-h-[92vh] flex flex-col bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 flex-shrink-0">
          <div>
            <h2 className="h2">Reschedule Booking #{booking.id}</h2>
            <p className="caption mt-1">
              {booking.client.name} — {booking.service.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon btn-sm"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="space-y-4 px-6 py-4">
            {/* Psikolog */}
            <div>
              <label className="caption mb-1 block">Psikolog</label>
              <select
                value={psikologUserId ?? ''}
                onChange={(e) => {
                  setPsikologUserId(e.target.value ? Number(e.target.value) : null);
                  setSelectedSlotIdx(null);
                }}
                className="input-althea"
              >
                <option value="">-- pilih psikolog --</option>
                {psikologListFiltered.map((p) => (
                  <option key={p.userId} value={p.userId}>
                    {p.fullName ?? p.email}
                  </option>
                ))}
              </select>
            </div>

            {/* DateStrip */}
            <DateStrip
              selectedDate={selectedDate}
              psikolog={selectedPsikolog}
              psikologUserId={psikologUserId}
              closedDayOfWeek={closedDays}
              holidays={holidays}
              onChangeDate={(date) => {
                setSelectedDate(date);
                setSelectedSlotIdx(null);
              }}
            />

            {psikologClosedToday && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                ⚠ <strong>{selectedPsikolog?.fullName}</strong> tidak praktik di tanggal ini
                {resolvedAvailability?.source === 'override'
                  ? ' (override khusus tanggal ini'
                  : ' (sesuai jadwal mingguan psikolog'}
                {overrideReason ? `: ${overrideReason}` : ''}
                ). Pilih tanggal lain atau ganti psikolog.
              </div>
            )}
            {!psikologClosedToday && resolvedAvailability?.source === 'override' && (
              <div className="rounded-md border border-sage-200 bg-sage-50 px-3 py-2 text-xs text-sage-800">
                ℹ Tanggal ini pakai <strong>jadwal khusus</strong> psikolog (override)
                {overrideReason ? ` — ${overrideReason}` : ''}.
              </div>
            )}

            {/* SlotGrid */}
            <SlotGrid
              slots={slots}
              unavailableSlotIdx={unavailableSlotIdx}
              slotIdx={selectedSlotIdx}
              psikologName={selectedPsikolog?.fullName ?? null}
              isLoadingBookings={psikologDayBookings.isLoading}
              onPick={(idx) => setSelectedSlotIdx(idx)}
            />

            {/* Ruang */}
            <div>
              <label className="caption mb-1 block">Ruang (opsional ganti)</label>
              <select
                value={roomId ?? ''}
                onChange={(e) =>
                  setRoomId(e.target.value ? Number(e.target.value) : null)
                }
                className="input-althea"
              >
                <option value="">-- tetap pakai ruang saat ini --</option>
                {(roomList.data?.data ?? []).map((r) => {
                  const occupied =
                    selectedSlotIdx !== null && occupiedRoomIds.has(r.id);
                  return (
                    <option key={r.id} value={r.id} disabled={occupied}>
                      {occupied ? '🔴 ' : ''}[{r.type}] {r.name}
                      {occupied ? ' — terpakai' : ''}
                    </option>
                  );
                })}
              </select>
              {selectedSlotIdx !== null && occupiedRoomIds.size > 0 && (
                <p className="caption mt-1 text-rose-700">
                  ⚠ Ruangan bertanda 🔴 sudah terpakai di slot ini.
                </p>
              )}
            </div>

            {/* Alasan */}
            <div>
              <label className="caption mb-1 block">
                Alasan reschedule (opsional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                className="input-althea h-auto py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border px-6 py-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn btn-primary btn-sm disabled:opacity-50"
            >
              {mut.isPending ? 'Menyimpan...' : 'Reschedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
