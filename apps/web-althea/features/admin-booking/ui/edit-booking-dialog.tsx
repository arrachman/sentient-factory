'use client';

/**
 * Form edit booking terpadu. Satu surface UX, tapi setiap perubahan
 * dispatch ke endpoint backend yang sudah tervalidasi:
 *  - jadwal / ruang / psikolog → POST /booking/:id/reschedule (cek konflik + WA + history)
 *  - status                    → start / complete / cancel (state machine + WA + audit)
 *  - catatan                   → PATCH /booking/:id (notes only)
 *
 * Pemilihan jadwal memakai UI yang sama dengan Booking Wizard:
 * DateStrip (week-strip color-coded) + SlotGrid, sehingga admin hanya bisa
 * memilih tanggal/slot sesuai ketersediaan jadwal psikolog (override → weekly),
 * slot operasional klinik, dan bentrok booking lain.
 *
 * Layanan & klien TIDAK bisa diubah di sini (efek berantai durasi/harga/paket) —
 * pakai Batal lalu buat booking baru.
 */
import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import {
  useBookingList,
  useCancelBooking,
  useCompleteBooking,
  useRescheduleBooking,
  useStartBooking,
  useUpdateBooking,
} from '../hooks/use-booking';
import {
  usePsikologAvailabilityForDate,
  usePsikologList,
} from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { STATUS_BADGE_CLASS, STATUS_LABEL, type Booking } from '../model/types';
import { DateStrip } from './booking-wizard/date-strip';
import { SlotGrid } from './booking-wizard/slot-grid';
import { buildIso, toDateKey } from './booking-wizard/wizard-utils';

type Slot = { start: string; end: string; label?: string };

function pad(n: number) {
  return String(n).padStart(2, '0');
}
function hhmm(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function findSlotIdx(slots: Slot[], startHHMM: string, endHHMM: string): number | null {
  let idx = slots.findIndex((s) => s.start === startHHMM && s.end === endHHMM);
  if (idx === -1) idx = slots.findIndex((s) => s.start === startHHMM);
  return idx === -1 ? null : idx;
}
function fmtRange(startIso: string, endIso: string): string {
  const s = new Date(startIso);
  const e = new Date(endIso);
  const datePart = s.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
  const t = (d: Date) =>
    d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });
  return `${datePart} · ${t(s)}–${t(e)}`;
}

export function EditBookingDialog({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  const [date, setDate] = useState('');
  const [slotIdx, setSlotIdx] = useState<number | null>(null);
  const [psikologUserId, setPsikologUserId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const settingsQuery = useSettings();
  const reschedule = useRescheduleBooking();
  const updateNotes = useUpdateBooking();
  const startMut = useStartBooking();
  const completeMut = useCompleteBooking();
  const cancelMut = useCancelBooking();

  const slots: Slot[] = settingsQuery.data?.data.slotsOfDay ?? [];
  const closedDayOfWeek = settingsQuery.data?.data.closedDayOfWeek ?? [];
  const holidays = settingsQuery.data?.data.holidays ?? [];
  const slotsReady = slots.length > 0;

  // Slot index asli booking (untuk deteksi perubahan & supaya slot lama
  // tetap bisa dipilih ulang walau jadwal psikolog sudah berubah).
  const origSlotIdx = useMemo(() => {
    if (!booking || !slotsReady) return null;
    return findSlotIdx(slots, hhmm(booking.scheduledStart), hhmm(booking.scheduledEnd));
  }, [booking, slots, slotsReady]);

  // Reset saat booking berubah; re-init slotIdx ketika slot klinik selesai load.
  useEffect(() => {
    if (!booking) return;
    setDate(toDateKey(new Date(booking.scheduledStart)));
    setPsikologUserId(booking.psikologUserId);
    setRoomId(booking.roomId);
    setReason('');
    setNotes(booking.notes ?? '');
    setSlotIdx(
      slotsReady
        ? findSlotIdx(slots, hhmm(booking.scheduledStart), hhmm(booking.scheduledEnd))
        : null,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id, slotsReady]);

  const psikologListFiltered = useMemo(() => {
    const all = psikologList.data?.data ?? [];
    if (!booking) return all;
    return all.filter((p) => {
      const ids = p.serviceIds ?? [];
      return ids.length === 0 || ids.includes(booking.serviceId);
    });
  }, [psikologList.data, booking]);

  const selectedPsikolog = useMemo(
    () => psikologList.data?.data.find((p) => p.userId === psikologUserId) ?? null,
    [psikologList.data, psikologUserId],
  );
  const psikologName = selectedPsikolog?.fullName ?? null;

  const availabilityQuery = usePsikologAvailabilityForDate(psikologUserId, date);
  const resolvedAvailability = availabilityQuery.data?.data;
  const psikologClosedToday =
    !!psikologUserId && !!date && !!resolvedAvailability && !resolvedAvailability.isOpen;
  const overrideReason =
    resolvedAvailability?.source === 'override' ? resolvedAvailability.reason : null;

  const psikologDayBookings = useBookingList({
    psikologUserId: psikologUserId ?? undefined,
    date: psikologUserId && date ? date : undefined,
    limit: 50,
    includeCancelled: false,
  });
  const allDayBookings = useBookingList({
    date: date || undefined,
    limit: 100,
    includeCancelled: false,
  });

  const sameAsOriginal =
    !!booking &&
    date === toDateKey(new Date(booking.scheduledStart)) &&
    psikologUserId === booking.psikologUserId;

  const unavailableSlotIdx = useMemo(() => {
    if (!psikologUserId || !date) return new Set<number>();
    const taken = new Set<number>();
    if (psikologClosedToday) {
      slots.forEach((_, i) => taken.add(i));
    } else {
      const allowed = resolvedAvailability?.slotIndices;
      if (allowed !== null && allowed !== undefined) {
        const allowedSet = new Set(allowed);
        slots.forEach((_, idx) => {
          if (!allowedSet.has(idx)) taken.add(idx);
        });
      }
      for (const b of psikologDayBookings.data?.data ?? []) {
        if (booking && b.id === booking.id) continue; // jangan blok slot booking ini sendiri
        const bStart = new Date(b.scheduledStart).getTime();
        const bEnd = new Date(b.scheduledEnd).getTime();
        slots.forEach((slot, idx) => {
          const slotStart = new Date(`${date}T${slot.start}:00`).getTime();
          const slotEnd = new Date(`${date}T${slot.end}:00`).getTime();
          if (bStart < slotEnd && bEnd > slotStart) taken.add(idx);
        });
      }
    }
    // Slot asli booking selalu bisa dipilih kembali selama tanggal & psikolog
    // belum diubah (booking lama mungkin dibuat sebelum jadwal psikolog berubah).
    if (sameAsOriginal && origSlotIdx !== null) taken.delete(origSlotIdx);
    return taken;
  }, [
    psikologUserId,
    date,
    psikologClosedToday,
    resolvedAvailability,
    psikologDayBookings.data,
    slots,
    booking,
    sameAsOriginal,
    origSlotIdx,
  ]);

  const selectedSlot = slotIdx !== null ? slots[slotIdx] ?? null : null;

  const occupiedRoomIds = useMemo(() => {
    if (!date || slotIdx === null || !selectedSlot) return new Set<number>();
    const slotStart = new Date(`${date}T${selectedSlot.start}:00`).getTime();
    const slotEnd = new Date(`${date}T${selectedSlot.end}:00`).getTime();
    const occ = new Set<number>();
    for (const b of allDayBookings.data?.data ?? []) {
      if (booking && b.id === booking.id) continue;
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      if (bStart < slotEnd && bEnd > slotStart) occ.add(b.roomId);
    }
    return occ;
  }, [allDayBookings.data, date, slotIdx, selectedSlot, booking]);

  if (!booking) return null;

  const status = booking.status;
  // Backend: reschedule ditolak kalau in_progress/completed/cancelled.
  const canReschedule = status === 'checked_in';
  // Backend: PATCH notes ditolak kalau completed/cancelled.
  const canEditNotes = status !== 'completed' && status !== 'cancelled';
  const busy =
    reschedule.isPending ||
    updateNotes.isPending ||
    startMut.isPending ||
    completeMut.isPending ||
    cancelMut.isPending;

  const scheduleChanged =
    canReschedule &&
    !!date &&
    slotIdx !== null &&
    (date !== toDateKey(new Date(booking.scheduledStart)) ||
      slotIdx !== origSlotIdx ||
      psikologUserId !== booking.psikologUserId ||
      roomId !== booking.roomId);
  const notesChanged = canEditNotes && notes.trim() !== (booking.notes ?? '').trim();
  const dirty = scheduleChanged || notesChanged;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!booking || !dirty) return;
    try {
      if (scheduleChanged && slotIdx !== null) {
        const slot = slots[slotIdx];
        await reschedule.mutateAsync({
          id: booking.id,
          input: {
            scheduledStart: buildIso(date, slot.start),
            scheduledEnd: buildIso(date, slot.end),
            psikologUserId: psikologUserId ?? undefined,
            roomId: roomId ?? undefined,
            reason: reason.trim() || undefined,
          },
        });
      }
      if (notesChanged) {
        await updateNotes.mutateAsync({ id: booking.id, input: { notes: notes.trim() } });
      }
      onClose();
    } catch {
      // error toast sudah ditangani di masing-masing hook
    }
  }

  function doStart() {
    if (booking) startMut.mutate(booking.id, { onSuccess: onClose });
  }
  function doComplete() {
    if (booking) completeMut.mutate(booking.id, { onSuccess: onClose });
  }
  function doCancel() {
    if (!booking) return;
    const r = window.prompt('Alasan pembatalan (opsional):') ?? '';
    cancelMut.mutate({ id: booking.id, reason: r.trim() || undefined }, { onSuccess: onClose });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea w-full max-w-xl max-h-[90vh] overflow-y-auto bg-card">
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="h2">Edit Booking #{booking.id}</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className={`badge ${STATUS_BADGE_CLASS[status]}`}>{STATUS_LABEL[status]}</span>
              <span className="caption">
                {booking.client.name} — {booking.service.name}
              </span>
            </div>
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

        <form onSubmit={save} className="space-y-3 px-6 py-4">
          {!canReschedule ? (
            <>
              <div className="rounded-md border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
                Jadwal, ruang & psikolog hanya bisa diubah saat status{' '}
                <strong>Check-in</strong>. Booking ini <strong>{STATUS_LABEL[status]}</strong>.
              </div>
              <div className="rounded-md border border-border bg-cream-50 px-3 py-2.5 text-sm">
                <div className="caption mb-0.5">Jadwal saat ini</div>
                <div className="font-medium text-teal-800">
                  {fmtRange(booking.scheduledStart, booking.scheduledEnd)}
                </div>
                <div className="caption mt-1">
                  Psikolog: {booking.psikolog?.fullName ?? '—'} · Ruang:{' '}
                  {booking.room?.name ?? '—'}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="caption mb-1 block">Psikolog</label>
                <select
                  value={psikologUserId ?? ''}
                  onChange={(e) => {
                    setPsikologUserId(e.target.value ? Number(e.target.value) : null);
                    setSlotIdx(null);
                  }}
                  className="input-althea"
                >
                  {psikologListFiltered.map((p) => (
                    <option key={p.userId} value={p.userId}>
                      {p.fullName ?? p.email}
                    </option>
                  ))}
                </select>
              </div>

              <DateStrip
                selectedDate={date}
                psikolog={selectedPsikolog}
                psikologUserId={psikologUserId}
                closedDayOfWeek={closedDayOfWeek}
                holidays={holidays}
                onChangeDate={(d) => {
                  setDate(d);
                  setSlotIdx(null);
                }}
              />

              {psikologClosedToday && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  ⚠ <strong>{psikologName ?? 'Psikolog'}</strong> tidak praktik di tanggal ini
                  {resolvedAvailability?.source === 'override'
                    ? ' (override khusus tanggal ini'
                    : ' (sesuai jadwal mingguan psikolog'}
                  {overrideReason ? `: ${overrideReason}` : ''}). Pilih tanggal lain atau ganti
                  psikolog.
                </div>
              )}
              {!psikologClosedToday && resolvedAvailability?.source === 'override' && (
                <div className="rounded-md border border-sage-200 bg-sage-50 px-3 py-2 text-xs text-sage-800">
                  ℹ Tanggal ini pakai <strong>jadwal khusus</strong> psikolog (override)
                  {overrideReason ? ` — ${overrideReason}` : ''}.
                </div>
              )}

              <SlotGrid
                slots={slots}
                unavailableSlotIdx={unavailableSlotIdx}
                slotIdx={slotIdx}
                psikologName={psikologName}
                isLoadingBookings={psikologDayBookings.isLoading}
                onPick={(idx) => setSlotIdx(idx)}
              />

              <div>
                <label className="caption mb-1 block">Ruang</label>
                <select
                  value={roomId ?? ''}
                  onChange={(e) => setRoomId(e.target.value ? Number(e.target.value) : null)}
                  className="input-althea"
                >
                  <option value="">-- pilih ruang --</option>
                  {(roomList.data?.data ?? []).map((r) => {
                    const occupied = slotIdx !== null && occupiedRoomIds.has(r.id);
                    return (
                      <option key={r.id} value={r.id} disabled={occupied}>
                        {occupied ? '🔴 ' : ''}[{r.type}] {r.name}
                        {occupied ? ' — terpakai' : ''}
                      </option>
                    );
                  })}
                </select>
                {slotIdx !== null && occupiedRoomIds.size > 0 && (
                  <p className="caption mt-1 text-rose-700">
                    ⚠ Ruangan bertanda 🔴 sudah terpakai di slot ini.
                  </p>
                )}
              </div>

              {scheduleChanged && (
                <div>
                  <label className="caption mb-1 block">
                    Alasan perubahan jadwal (opsional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    className="input-althea h-auto py-2"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="caption mb-1 block">Catatan booking</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!canEditNotes}
              rows={3}
              className="input-althea h-auto py-2 disabled:opacity-60"
              placeholder={canEditNotes ? 'Catatan internal booking…' : 'Tidak bisa diubah'}
            />
          </div>

          {/* Status actions — sesuai state machine backend */}
          {(status === 'checked_in' || status === 'in_progress') && (
            <div className="flex flex-wrap gap-2 border-t border-border pt-3">
              <span className="caption self-center mr-1">Ubah status:</span>
              {status === 'checked_in' && (
                <button
                  type="button"
                  onClick={doStart}
                  disabled={busy}
                  className="btn btn-outline btn-sm"
                >
                  Mulai sesi
                </button>
              )}
              {status === 'in_progress' && (
                <button
                  type="button"
                  onClick={doComplete}
                  disabled={busy}
                  className="btn btn-outline btn-sm"
                >
                  Tandai selesai
                </button>
              )}
              <button
                type="button"
                onClick={doCancel}
                disabled={busy}
                className="btn btn-outline btn-sm text-danger"
              >
                Batalkan
              </button>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
              Tutup
            </button>
            <button type="submit" disabled={busy || !dirty} className="btn btn-primary btn-sm">
              {busy ? 'Menyimpan…' : 'Simpan perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
