'use client';

/**
 * Booking Paket Multi-Sesi.
 *
 * Mirror flow booking-wizard single-session: tiap sesi punya date + slot
 * picker yang menyesuaikan ClinicSettings.slotsOfDay + availability psikolog
 * (override + weekly) + ruangan/psikolog day-booking conflict.
 *
 * Per-row hooks dipisah ke `<SessionRow />` supaya jumlah hook tetap stabil
 * (React rules-of-hooks: hooks per komponen, bukan per iteration).
 */
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api-client';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { useClientList } from '@/features/admin-clients/hooks/use-client';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import {
  usePsikologList,
  usePsikologAvailabilityForDate,
} from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';

type Props = {
  open: boolean;
  onClose: () => void;
};

type SessionRowState = {
  date: string; // YYYY-MM-DD (TZ klinik)
  slotIdx: number | null;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function dateStrAfterDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function buildIso(dateStr: string, hhmm: string): string {
  return new Date(`${dateStr}T${hhmm}:00`).toISOString();
}

export function PackageWizard({ open, onClose }: Props) {
  const qc = useQueryClient();
  const [clientId, setClientId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [psikologUserId, setPsikologUserId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<SessionRowState[]>([]);
  const [intervalDays, setIntervalDays] = useState(7);
  const [bufferOverride, setBufferOverride] = useState(false);
  const [notes, setNotes] = useState('');

  // Reset on open
  useEffect(() => {
    if (open) {
      setClientId(null);
      setServiceId(null);
      setPsikologUserId(null);
      setRoomId(null);
      setSessions([]);
      setIntervalDays(7);
      setBufferOverride(false);
      setNotes('');
    }
  }, [open]);

  const clientList = useClientList({ limit: 200 });
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const settingsQuery = useSettings();

  const slots = settingsQuery.data?.data.slotsOfDay ?? [];

  // Filter psikolog by service (kosong = handle semua).
  const psikologListFiltered = useMemo(() => {
    const all = psikologList.data?.data ?? [];
    if (!serviceId) return all;
    return all.filter((p) => {
      const ids = p.serviceIds ?? [];
      return ids.length === 0 || ids.includes(serviceId);
    });
  }, [psikologList.data, serviceId]);

  // Filter only multi-session services
  const packageServices = useMemo(
    () => (serviceList.data?.data ?? []).filter((s) => s.sessionCount > 1),
    [serviceList.data],
  );
  const selectedService = useMemo(
    () => packageServices.find((s) => s.id === serviceId),
    [packageServices, serviceId],
  );

  // Init sessions saat service dipilih: N sesi, date interval dari hari ini.
  useEffect(() => {
    if (selectedService) {
      const total = selectedService.sessionCount;
      setSessions(
        Array.from({ length: total }, (_, i) => ({
          date: dateStrAfterDays(7 + i * intervalDays),
          slotIdx: null,
        })),
      );
    } else {
      setSessions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService]);

  function reapplyInterval() {
    if (!selectedService || sessions.length === 0) return;
    const base = sessions[0].date;
    const baseDate = new Date(`${base}T00:00:00`);
    setSessions((prev) =>
      prev.map((s, i) => {
        if (i === 0) return s;
        const d = new Date(baseDate);
        d.setDate(d.getDate() + i * intervalDays);
        return {
          ...s,
          date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
        };
      }),
    );
  }

  function updateSession(i: number, partial: Partial<SessionRowState>) {
    setSessions((prev) =>
      prev.map((s, idx) => {
        if (idx !== i) return s;
        const next = { ...s, ...partial };
        // Reset slot kalau ganti tanggal — slot availability beda per hari.
        if (partial.date && partial.date !== s.date) next.slotIdx = null;
        return next;
      }),
    );
  }

  // Detect duplicate (date + slotIdx) di antar-sesi → bentrok dengan diri sendiri
  const intraConflict = useMemo(() => {
    const seen = new Map<string, number[]>();
    sessions.forEach((s, i) => {
      if (s.slotIdx === null) return;
      const key = `${s.date}#${s.slotIdx}`;
      const arr = seen.get(key) ?? [];
      arr.push(i);
      seen.set(key, arr);
    });
    const conflicts = new Set<number>();
    for (const arr of seen.values()) {
      if (arr.length > 1) arr.forEach((i) => conflicts.add(i));
    }
    return conflicts;
  }, [sessions]);

  const createMut = useMutation({
    mutationFn: async (payload: object) => {
      const idempotencyKey = (
        globalThis.crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random()}`
      ).replace(/[^a-zA-Z0-9_-]/g, '');
      return apiClient.post<{
        success: boolean;
        data: { packageGroupId: string; sessionCount: number };
      }>('/booking/package', payload, {
        headers: { 'Idempotency-Key': idempotencyKey },
      });
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success(`Package ${res.data.sessionCount} sesi berhasil dibuat`);
      onClose();
    },
    onError: (err: Error) => {
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as { conflictType?: string; message?: string };
        toast.error(`Conflict: ${body?.conflictType ?? 'unknown'}`, {
          description:
            body?.message ?? 'Bentrok jadwal — adjust slot atau aktifkan buffer override',
        });
        return;
      }
      toast.error('Gagal create package', { description: err.message });
    },
  });

  const canSubmit =
    !!clientId &&
    !!serviceId &&
    !!psikologUserId &&
    !!roomId &&
    sessions.length >= 2 &&
    sessions.every((s) => s.slotIdx !== null) &&
    intraConflict.size === 0 &&
    !createMut.isPending;

  function submit() {
    if (!canSubmit || !selectedService) return;
    createMut.mutate({
      clientId,
      serviceId,
      psikologUserId,
      roomId,
      sessions: sessions.map((s) => {
        const slot = slots[s.slotIdx as number];
        return {
          scheduledStart: buildIso(s.date, slot.start),
          scheduledEnd: buildIso(s.date, slot.end),
        };
      }),
      bufferOverride,
      notes: notes.trim() || undefined,
    });
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="h2">Booking Paket Multi-Sesi</h2>
            <p className="caption mt-1">
              Untuk service dengan <code>sessionCount &gt; 1</code>. Slot picker
              menyesuaikan jadwal psikolog (override + weekly) &amp; booking yang
              sudah ada. Atomic — semua sesi divalidasi bersama di backend.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="caption mb-1 block">Klien</label>
              <select
                value={clientId ?? ''}
                onChange={(e) =>
                  setClientId(e.target.value ? Number(e.target.value) : null)
                }
                className="input-althea"
              >
                <option value="">-- pilih --</option>
                {(clientList.data?.data ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.phoneWa}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="caption mb-1 block">Service Paket</label>
              <select
                value={serviceId ?? ''}
                onChange={(e) =>
                  setServiceId(e.target.value ? Number(e.target.value) : null)
                }
                className="input-althea"
              >
                <option value="">-- pilih paket --</option>
                {packageServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.sessionCount} sesi × {s.durationMinutes}min — Rp{' '}
                    {Number(s.basePrice).toLocaleString('id-ID')}
                  </option>
                ))}
              </select>
              {packageServices.length === 0 && (
                <p className="caption mt-1 text-fg-muted">
                  Tidak ada service paket aktif. Tambah di menu Layanan dengan
                  sessionCount &gt; 1.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="caption mb-1 block">
                Psikolog (semua sesi)
              </label>
              <select
                value={psikologUserId ?? ''}
                onChange={(e) =>
                  setPsikologUserId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="input-althea"
              >
                <option value="">-- pilih --</option>
                {psikologListFiltered.map((p) => (
                  <option key={p.userId} value={p.userId}>
                    {p.fullName ?? p.email}
                  </option>
                ))}
              </select>
              {serviceId && psikologListFiltered.length === 0 && (
                <p className="caption mt-1 text-fg-muted">
                  Tidak ada psikolog yang menangani layanan ini.
                </p>
              )}
            </div>
            <div>
              <label className="caption mb-1 block">Ruang (semua sesi)</label>
              <select
                value={roomId ?? ''}
                onChange={(e) =>
                  setRoomId(e.target.value ? Number(e.target.value) : null)
                }
                className="input-althea"
              >
                <option value="">-- pilih --</option>
                {(roomList.data?.data ?? []).map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.type}] {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedService && sessions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="h3">{sessions.length} Jadwal Sesi</h3>
                <div className="flex items-center gap-2">
                  <label className="caption">Interval (hari):</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={intervalDays}
                    onChange={(e) => setIntervalDays(Number(e.target.value))}
                    className="input-althea max-w-[80px]"
                  />
                  <button
                    type="button"
                    onClick={reapplyInterval}
                    className="btn btn-outline btn-sm"
                  >
                    Apply Interval
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {sessions.map((s, i) => (
                  <SessionRow
                    key={i}
                    index={i}
                    state={s}
                    slots={slots}
                    psikologUserId={psikologUserId}
                    roomId={roomId}
                    isIntraConflict={intraConflict.has(i)}
                    onChange={(partial) => updateSession(i, partial)}
                  />
                ))}
              </div>
              {!psikologUserId && (
                <p className="caption text-fg-muted">
                  Pilih psikolog dulu untuk melihat slot tersedia per tanggal.
                </p>
              )}
              <p className="caption text-fg-muted">
                💡 Tip: edit tanggal Sesi 1 + klik &quot;Apply Interval&quot; untuk auto-fill
                tanggal sesi berikutnya.
              </p>
            </div>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={bufferOverride}
              onChange={(e) => setBufferOverride(e.target.checked)}
              className="h-4 w-4"
            />
            <span>
              Buffer override (skip cek availability, buffer 15-menit, jam
              operasional)
            </span>
          </label>

          <div>
            <label className="caption mb-1 block">Catatan (opsional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="input-althea h-auto py-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Batal
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="btn btn-primary disabled:opacity-50"
          >
            {createMut.isPending
              ? 'Menyimpan...'
              : `Buat ${sessions.length} Booking Sekaligus`}
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Per-session row: date + slot picker dengan availability per tanggal.
// =====================================================================

type Slot = { start: string; end: string };

function SessionRow({
  index,
  state,
  slots,
  psikologUserId,
  roomId,
  isIntraConflict,
  onChange,
}: {
  index: number;
  state: SessionRowState;
  slots: Slot[];
  psikologUserId: number | null;
  roomId: number | null;
  isIntraConflict: boolean;
  onChange: (partial: Partial<SessionRowState>) => void;
}) {
  // Resolve effective availability (override + weekly) untuk tanggal ini.
  const availabilityQuery = usePsikologAvailabilityForDate(
    psikologUserId,
    state.date,
  );
  const resolved = availabilityQuery.data?.data;

  // Existing bookings psikolog di tanggal ini → slot mana yang sudah taken.
  const dayBookings = useBookingList({
    psikologUserId: psikologUserId ?? undefined,
    date: psikologUserId && state.date ? state.date : undefined,
    limit: 50,
    includeCancelled: false,
  });

  // Existing bookings ruangan di tanggal ini → slot mana yang ruang penuh.
  const roomDayBookings = useBookingList({
    roomId: roomId ?? undefined,
    date: roomId && state.date ? state.date : undefined,
    limit: 50,
    includeCancelled: false,
  });

  const psikologClosed = Boolean(
    psikologUserId && resolved && !resolved.isOpen,
  );

  const { unavailableIdx, reasonMap } = useMemo(() => {
    const taken = new Set<number>();
    const reasons = new Map<number, string>();
    if (!psikologUserId) return { unavailableIdx: taken, reasonMap: reasons };
    if (psikologClosed) {
      slots.forEach((_, i) => {
        taken.add(i);
        reasons.set(i, 'psikolog libur');
      });
      return { unavailableIdx: taken, reasonMap: reasons };
    }
    // 1. Slot di luar window availability psikolog.
    const allowed = resolved?.slotIndices;
    if (allowed != null) {
      const set = new Set(allowed);
      slots.forEach((_, idx) => {
        if (!set.has(idx)) {
          taken.add(idx);
          reasons.set(idx, 'di luar jadwal psikolog');
        }
      });
    }
    // 2. Slot bentrok dengan booking psikolog lain.
    for (const b of dayBookings.data?.data ?? []) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      slots.forEach((slot, idx) => {
        const slotStart = new Date(`${state.date}T${slot.start}:00`).getTime();
        const slotEnd = new Date(`${state.date}T${slot.end}:00`).getTime();
        if (bStart < slotEnd && bEnd > slotStart) {
          taken.add(idx);
          if (!reasons.has(idx)) reasons.set(idx, 'psikolog sudah ada booking');
        }
      });
    }
    // 3. Slot bentrok dengan booking di ruangan.
    for (const b of roomDayBookings.data?.data ?? []) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      slots.forEach((slot, idx) => {
        const slotStart = new Date(`${state.date}T${slot.start}:00`).getTime();
        const slotEnd = new Date(`${state.date}T${slot.end}:00`).getTime();
        if (bStart < slotEnd && bEnd > slotStart) {
          taken.add(idx);
          if (!reasons.has(idx)) reasons.set(idx, 'ruangan terpakai');
        }
      });
    }
    return { unavailableIdx: taken, reasonMap: reasons };
  }, [
    psikologUserId,
    psikologClosed,
    resolved,
    dayBookings.data,
    roomDayBookings.data,
    slots,
    state.date,
  ]);

  const overrideReason =
    resolved?.source === 'override' ? resolved.reason : null;

  return (
    <div className="card-althea p-3 bg-cream-50 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge badge-sage">Sesi {index + 1}</span>
        <input
          type="date"
          value={state.date}
          onChange={(e) => onChange({ date: e.target.value })}
          className="input-althea max-w-[180px]"
        />
        <select
          value={state.slotIdx ?? ''}
          onChange={(e) =>
            onChange({
              slotIdx: e.target.value === '' ? null : Number(e.target.value),
            })
          }
          className="input-althea max-w-[260px]"
          disabled={!psikologUserId || slots.length === 0}
        >
          <option value="">-- pilih slot --</option>
          {slots.map((slot, idx) => {
            const blocked = unavailableIdx.has(idx);
            return (
              <option key={idx} value={idx} disabled={blocked}>
                {slot.start}–{slot.end}
                {blocked ? ` (${reasonMap.get(idx) ?? 'tidak tersedia'})` : ''}
              </option>
            );
          })}
        </select>
        {isIntraConflict && (
          <span className="caption text-danger">
            ⚠ bentrok dengan sesi lain
          </span>
        )}
      </div>
      {psikologClosed && (
        <p className="caption text-amber-700">
          Psikolog tidak praktik di tanggal ini
          {resolved?.source === 'override'
            ? overrideReason
              ? ` (override: ${overrideReason})`
              : ' (override khusus)'
            : ' (sesuai jadwal mingguan)'}
          .
        </p>
      )}
    </div>
  );
}
