'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api-client';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { useClientList } from '@/features/admin-clients/hooks/use-client';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';

type Props = {
  open: boolean;
  onClose: () => void;
};

type WizardState = {
  step: 1 | 2 | 3 | 4;
  clientId: number | null;
  serviceId: number | null;
  /** YYYY-MM-DD format (date input) */
  date: string;
  /** Slot index in clinic settings slotsOfDay; null = belum pilih */
  slotIdx: number | null;
  psikologUserId: number | null;
  roomId: number | null;
  bufferOverride: boolean;
  notes: string;
};

function pad(n: number) { return String(n).padStart(2, '0'); }

function tomorrowDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const INIT: WizardState = {
  step: 1,
  clientId: null,
  serviceId: null,
  date: tomorrowDateStr(),
  slotIdx: null,
  psikologUserId: null,
  roomId: null,
  bufferOverride: false,
  notes: '',
};

function buildIso(dateStr: string, timeHHMM: string): string {
  // Local datetime → ISO with timezone
  const d = new Date(`${dateStr}T${timeHHMM}:00`);
  return d.toISOString();
}

export function BookingWizard({ open, onClose }: Props) {
  const [s, setS] = useState<WizardState>(INIT);
  const qc = useQueryClient();

  // Reset saat dialog dibuka
  useEffect(() => {
    if (open) {
      setS({ ...INIT });
    }
  }, [open]);

  const clientList = useClientList({ limit: 200 });
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });
  const settingsQuery = useSettings();

  const selectedService = useMemo(
    () => serviceList.data?.data.find((sv) => sv.id === s.serviceId),
    [serviceList.data, s.serviceId],
  );
  const slots = settingsQuery.data?.data.slotsOfDay ?? [];
  const closedDays = settingsQuery.data?.data.closedDayOfWeek ?? [];
  const selectedSlot = s.slotIdx !== null ? slots[s.slotIdx] : null;
  const isClosedDay = closedDays.includes(new Date(`${s.date}T00:00:00`).getDay());

  // Fetch booking psikolog di tanggal terpilih (untuk filter slot yang sudah
  // dipakai). Selalu di-call (rules-of-hooks), tapi backend cuma return
  // berarti ketika psikologUserId + date both set.
  const psikologDayBookings = useBookingList({
    psikologUserId: s.psikologUserId ?? undefined,
    date: s.psikologUserId && s.date ? s.date : undefined,
    limit: 50,
    includeCancelled: false,
  });

  // Set of slot indices yang konflik dengan booking psikolog di tanggal tsb.
  const unavailableSlotIdx = useMemo(() => {
    if (!s.psikologUserId || !s.date) return new Set<number>();
    const bookings = psikologDayBookings.data?.data ?? [];
    const taken = new Set<number>();
    for (const b of bookings) {
      const bStart = new Date(b.scheduledStart).getTime();
      const bEnd = new Date(b.scheduledEnd).getTime();
      slots.forEach((slot, idx) => {
        const slotStart = new Date(`${s.date}T${slot.start}:00`).getTime();
        const slotEnd = new Date(`${s.date}T${slot.end}:00`).getTime();
        if (bStart < slotEnd && bEnd > slotStart) taken.add(idx);
      });
    }
    return taken;
  }, [psikologDayBookings.data, slots, s.date, s.psikologUserId]);

  const createMut = useMutation({
    mutationFn: async (payload: object) => {
      const idempotencyKey = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).replace(/[^a-zA-Z0-9_-]/g, '');
      return apiClient.post<{ success: boolean; data: { id: number } }>('/booking', payload, {
        headers: { 'Idempotency-Key': idempotencyKey },
      });
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success(`Booking #${res.data.id} berhasil dibuat`);
      onClose();
    },
    onError: (err: Error) => {
      // Conflict detection: parse 409 untuk show alternative
      if (err instanceof ApiError && err.status === 409) {
        const body = err.body as { conflictType?: string; conflictBookingId?: number };
        toast.error(`Conflict: ${body?.conflictType ?? 'unknown'}`, {
          description: `Booking #${body?.conflictBookingId} bertabrakan. Pilih slot/psikolog/ruang lain, atau aktifkan "Buffer override".`,
        });
        return;
      }
      toast.error('Gagal create booking', { description: err.message });
    },
  });

  if (!open) return null;

  function next() { setS((p) => ({ ...p, step: Math.min(4, p.step + 1) as 1 | 2 | 3 | 4 })); }
  function prev() { setS((p) => ({ ...p, step: Math.max(1, p.step - 1) as 1 | 2 | 3 | 4 })); }

  function canNext(): boolean {
    if (s.step === 1) return s.clientId !== null;
    if (s.step === 2) return s.serviceId !== null;
    if (s.step === 3) return s.psikologUserId !== null;
    if (s.step === 4) return Boolean(s.date && s.slotIdx !== null && s.roomId !== null);
    return false;
  }

  function submit() {
    if (!s.clientId || !s.serviceId || !s.psikologUserId || !s.roomId || !selectedSlot) return;
    createMut.mutate({
      clientId: s.clientId,
      serviceId: s.serviceId,
      psikologUserId: s.psikologUserId,
      roomId: s.roomId,
      scheduledStart: buildIso(s.date, selectedSlot.start),
      scheduledEnd: buildIso(s.date, selectedSlot.end),
      sessionN: 1,
      sessionTotal: selectedService?.sessionCount ?? 1,
      bufferOverride: s.bufferOverride,
      notes: s.notes.trim() || undefined,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="card-althea w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="h2">Booking Wizard</h2>
            <p className="caption mt-1">Step {s.step} dari 4</p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-icon" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex border-b border-border">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={`flex-1 px-3 py-2 text-center text-xs font-medium ${
                s.step === n ? 'bg-sage-100 text-sage-800' : s.step > n ? 'bg-success-soft text-success' : 'text-fg-muted'
              }`}
            >
              {n}. {n === 1 ? 'Klien' : n === 2 ? 'Layanan' : n === 3 ? 'Psikolog' : 'Jadwal & Ruang'}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 min-h-[280px]">
          {s.step === 1 && (
            <div>
              <label className="caption mb-1 block">Pilih Klien</label>
              {clientList.isLoading ? (
                <div className="text-fg-muted">Memuat klien...</div>
              ) : (
                <select
                  value={s.clientId ?? ''}
                  onChange={(e) => setS({ ...s, clientId: e.target.value ? Number(e.target.value) : null })}
                  className="input-althea"
                >
                  <option value="">-- pilih klien --</option>
                  {(clientList.data?.data ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.phoneWa} {c.medicalRecordNumber ? `(${c.medicalRecordNumber})` : ''}
                    </option>
                  ))}
                </select>
              )}
              <p className="caption mt-2 text-fg-muted">
                Klien tidak ada? Tambah dulu di menu <strong>Klien</strong>.
              </p>
            </div>
          )}

          {s.step === 2 && (
            <div>
              <label className="caption mb-1 block">Pilih Layanan</label>
              <select
                value={s.serviceId ?? ''}
                onChange={(e) => setS({ ...s, serviceId: e.target.value ? Number(e.target.value) : null })}
                className="input-althea"
              >
                <option value="">-- pilih layanan --</option>
                {(serviceList.data?.data ?? []).map((sv) => (
                  <option key={sv.id} value={sv.id}>
                    [{sv.category}] {sv.name} — {sv.sessionCount}× {sv.durationMinutes}min — Rp {Number(sv.basePrice).toLocaleString('id-ID')}
                  </option>
                ))}
              </select>
              {selectedService && (
                <div className="card-althea-flat mt-3 p-3 text-sm">
                  <div><strong>{selectedService.name}</strong></div>
                  <div className="caption mt-1">
                    {selectedService.sessionCount} sesi × {selectedService.durationMinutes} menit •{' '}
                    Total Rp {Number(selectedService.basePrice).toLocaleString('id-ID')}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Pilih Psikolog */}
          {s.step === 3 && (
            <div className="space-y-3">
              <div>
                <label className="caption mb-1 block">Pilih Psikolog</label>
                {psikologList.isLoading ? (
                  <div className="text-fg-muted">Memuat psikolog...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(psikologList.data?.data ?? []).map((p) => {
                      const active = s.psikologUserId === p.userId;
                      const initial = (p.fullName ?? p.email).slice(0, 2).toUpperCase();
                      return (
                        <button
                          key={p.userId}
                          type="button"
                          onClick={() => setS({ ...s, psikologUserId: p.userId })}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-md border text-left transition-colors ${
                            active
                              ? 'bg-sage-50 border-sage-500'
                              : 'bg-card border-border hover:border-sage-300'
                          }`}
                        >
                          <span
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 999,
                              background: p.color ?? 'var(--sage-500)',
                              color: '#fff',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: 12,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {initial}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[13.5px] font-semibold text-teal-800 truncate">
                              {p.fullName ?? p.email}
                            </span>
                            <span className="caption truncate">
                              {p.title ?? '—'}
                              {p.specialty && p.specialty.length > 0
                                ? ` · ${p.specialty.length} spesialisasi`
                                : ''}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                <p className="caption mt-2 text-fg-muted">
                  Tahap berikutnya akan tampil slot yang masih kosong untuk psikolog ini di
                  tanggal yang kamu pilih.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Tanggal + Slot (filtered) + Ruang + Override */}
          {s.step === 4 && (
            <div className="space-y-3">
              <div>
                <label className="caption mb-1 block">Tanggal</label>
                <input
                  type="date"
                  value={s.date}
                  onChange={(e) => setS({ ...s, date: e.target.value, slotIdx: null })}
                  className="input-althea max-w-[220px]"
                />
                {isClosedDay && !s.bufferOverride && (
                  <p className="caption mt-1 text-amber-700">
                    ⚠ Klinik tutup di hari ini. Centang override di bawah, atau pilih tanggal lain.
                  </p>
                )}
              </div>

              <div>
                <label className="caption mb-1 block">
                  Slot tersedia untuk{' '}
                  <strong className="text-teal-800">
                    {psikologList.data?.data.find((p) => p.userId === s.psikologUserId)?.fullName ??
                      'psikolog'}
                  </strong>
                </label>
                {slots.length === 0 ? (
                  <p className="caption italic text-fg-muted">
                    Belum ada slot operasional. Set di Pengaturan → Slot Operasional dulu.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {slots.map((slot, i) => {
                      const active = s.slotIdx === i;
                      const taken = unavailableSlotIdx.has(i);
                      const disabled = taken && !s.bufferOverride;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => !disabled && setS({ ...s, slotIdx: i })}
                          disabled={disabled}
                          className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors text-left ${
                            active
                              ? 'bg-sage-50 border-sage-500 text-teal-800'
                              : taken
                                ? 'bg-cream-100 border-border text-fg-muted line-through cursor-not-allowed opacity-70'
                                : 'bg-card border-border text-fg hover:border-sage-300'
                          }`}
                          title={taken ? 'Sudah ada booking lain di slot ini' : undefined}
                        >
                          <div className="font-semibold">
                            {slot.start} – {slot.end}
                          </div>
                          <div className="caption mt-0.5">
                            {taken ? 'sudah penuh' : slot.label || 'tersedia'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
                {psikologDayBookings.isLoading && (
                  <p className="caption mt-1 text-fg-muted">Mengecek slot kosong…</p>
                )}
                {!psikologDayBookings.isLoading &&
                  unavailableSlotIdx.size > 0 &&
                  slots.length > 0 && (
                    <p className="caption mt-1 text-fg-muted">
                      {slots.length - unavailableSlotIdx.size} dari {slots.length} slot tersedia
                      di tanggal ini.
                    </p>
                  )}
              </div>

              {selectedService && selectedSlot && (
                <p className="caption text-fg-muted">
                  💡 Slot {selectedSlot.start}–{selectedSlot.end} = {(() => {
                    const [sh, sm] = selectedSlot.start.split(':').map(Number);
                    const [eh, em] = selectedSlot.end.split(':').map(Number);
                    return eh * 60 + em - (sh * 60 + sm);
                  })()}{' '}
                  menit. Durasi {selectedService.name}: {selectedService.durationMinutes} menit.
                </p>
              )}

              <div>
                <label className="caption mb-1 block">Pilih Ruang</label>
                <select
                  value={s.roomId ?? ''}
                  onChange={(e) => setS({ ...s, roomId: e.target.value ? Number(e.target.value) : null })}
                  className="input-althea"
                >
                  <option value="">-- pilih ruang --</option>
                  {(roomList.data?.data ?? []).map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.type}] {r.name} (kapasitas {r.capacity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-md border border-border p-3 bg-cream-50">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={s.bufferOverride}
                    onChange={(e) => setS({ ...s, bufferOverride: e.target.checked })}
                    className="h-4 w-4 mt-0.5 flex-shrink-0"
                  />
                  <span className="flex flex-col gap-1">
                    <span className="font-medium text-teal-800">
                      Lewati validasi jeda &amp; jam buka klinik
                    </span>
                    <span className="caption">
                      Sistem biasanya menolak booking yang berhimpit kurang dari 15 menit dari sesi
                      lain, atau di hari tutup. Centang HANYA untuk kasus khusus: walk-in darurat,
                      sesi beruntun yang disengaja, atau sesi di hari libur. Semua override
                      tercatat di audit log.
                    </span>
                  </span>
                </label>
              </div>

              <div>
                <label className="caption mb-1 block">Catatan (opsional)</label>
                <textarea
                  value={s.notes}
                  onChange={(e) => setS({ ...s, notes: e.target.value })}
                  rows={2}
                  className="input-althea h-auto py-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={prev}
            disabled={s.step === 1}
            className="btn btn-outline disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> Sebelumnya
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">Batal</button>
            {s.step < 4 ? (
              <button type="button" onClick={next} disabled={!canNext()} className="btn btn-primary disabled:opacity-50">
                Selanjutnya <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!canNext() || createMut.isPending}
                className="btn btn-primary disabled:opacity-50"
              >
                {createMut.isPending ? 'Menyimpan...' : 'Buat Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
