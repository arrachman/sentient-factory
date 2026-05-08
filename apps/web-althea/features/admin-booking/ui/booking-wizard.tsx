'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient, ApiError } from '@/lib/api-client';
import { useClientList } from '@/features/admin-clients/hooks/use-client';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';
import { useRoomList } from '@/features/admin-rooms/hooks/use-room';

type Props = {
  open: boolean;
  onClose: () => void;
};

type WizardState = {
  step: 1 | 2 | 3 | 4;
  clientId: number | null;
  serviceId: number | null;
  scheduledStart: string;
  scheduledEnd: string;
  psikologUserId: number | null;
  roomId: number | null;
  bufferOverride: boolean;
  notes: string;
};

const INIT: WizardState = {
  step: 1,
  clientId: null,
  serviceId: null,
  scheduledStart: '',
  scheduledEnd: '',
  psikologUserId: null,
  roomId: null,
  bufferOverride: false,
  notes: '',
};

function pad(n: number) { return String(n).padStart(2, '0'); }

function defaultStartIso(): string {
  // Tomorrow 09:00 local
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  // Local ISO without TZ shift (datetime-local format YYYY-MM-DDTHH:mm)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function addMinutes(iso: string, minutes: number): string {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + minutes);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isoToBackend(local: string): string {
  // Convert local datetime string (without TZ) ke backend ISO with timezone
  const d = new Date(local);
  return d.toISOString();
}

export function BookingWizard({ open, onClose }: Props) {
  const [s, setS] = useState<WizardState>(INIT);
  const qc = useQueryClient();

  // Reset saat dialog dibuka
  useEffect(() => {
    if (open) {
      setS({ ...INIT, scheduledStart: defaultStartIso() });
    }
  }, [open]);

  const clientList = useClientList({ limit: 200 });
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });

  const selectedService = useMemo(
    () => serviceList.data?.data.find((sv) => sv.id === s.serviceId),
    [serviceList.data, s.serviceId],
  );

  // Auto-set scheduledEnd berdasarkan service duration
  useEffect(() => {
    if (selectedService && s.scheduledStart) {
      setS((prev) => ({
        ...prev,
        scheduledEnd: addMinutes(prev.scheduledStart, selectedService.durationMinutes),
      }));
    }
  }, [selectedService, s.scheduledStart]);

  const createMut = useMutation({
    mutationFn: async (payload: object) => {
      return apiClient.post<{ success: boolean; data: { id: number } }>('/booking', payload);
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
    if (s.step === 3) return Boolean(s.scheduledStart && s.scheduledEnd);
    if (s.step === 4) return s.psikologUserId !== null && s.roomId !== null;
    return false;
  }

  function submit() {
    if (!s.clientId || !s.serviceId || !s.psikologUserId || !s.roomId) return;
    createMut.mutate({
      clientId: s.clientId,
      serviceId: s.serviceId,
      psikologUserId: s.psikologUserId,
      roomId: s.roomId,
      scheduledStart: isoToBackend(s.scheduledStart),
      scheduledEnd: isoToBackend(s.scheduledEnd),
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
              {n}. {n === 1 ? 'Klien' : n === 2 ? 'Layanan' : n === 3 ? 'Jadwal' : 'Psikolog & Ruang'}
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

          {s.step === 3 && (
            <div className="space-y-3">
              <div>
                <label className="caption mb-1 block">Jadwal mulai</label>
                <input
                  type="datetime-local"
                  value={s.scheduledStart}
                  onChange={(e) => setS({ ...s, scheduledStart: e.target.value })}
                  className="input-althea"
                />
              </div>
              <div>
                <label className="caption mb-1 block">Jadwal selesai (auto dari durasi layanan)</label>
                <input
                  type="datetime-local"
                  value={s.scheduledEnd}
                  onChange={(e) => setS({ ...s, scheduledEnd: e.target.value })}
                  className="input-althea"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={s.bufferOverride}
                  onChange={(e) => setS({ ...s, bufferOverride: e.target.checked })}
                  className="h-4 w-4"
                />
                <span>
                  Buffer override (skip 15-min buffer + jam operasional check). Pakai untuk back-to-back atau
                  emergency walk-in.
                </span>
              </label>
            </div>
          )}

          {s.step === 4 && (
            <div className="space-y-3">
              <div>
                <label className="caption mb-1 block">Pilih Psikolog</label>
                <select
                  value={s.psikologUserId ?? ''}
                  onChange={(e) => setS({ ...s, psikologUserId: e.target.value ? Number(e.target.value) : null })}
                  className="input-althea"
                >
                  <option value="">-- pilih psikolog --</option>
                  {(psikologList.data?.data ?? []).map((p) => (
                    <option key={p.userId} value={p.userId}>
                      {p.fullName ?? p.email} {p.title ? `(${p.title})` : ''}
                    </option>
                  ))}
                </select>
              </div>
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
