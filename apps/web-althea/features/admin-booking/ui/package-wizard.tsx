'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, X } from 'lucide-react';
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

type SessionRow = {
  scheduledStart: string; // local datetime-local format
  scheduledEnd: string;
};

function pad(n: number) { return String(n).padStart(2, '0'); }

function defaultStartIso(daysFromNow: number, hour = 9): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function addMinutes(iso: string, minutes: number): string {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + minutes);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PackageWizard({ open, onClose }: Props) {
  const qc = useQueryClient();
  const [clientId, setClientId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [psikologUserId, setPsikologUserId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [intervalDays, setIntervalDays] = useState(7);
  const [bufferOverride, setBufferOverride] = useState(false);
  const [notes, setNotes] = useState('');

  const clientList = useClientList({ limit: 200 });
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const psikologList = usePsikologList({ limit: 200, isActive: true });
  const roomList = useRoomList({ limit: 200, isActive: true });

  // Filter only multi-session services
  const packageServices = useMemo(
    () => (serviceList.data?.data ?? []).filter((s) => s.sessionCount > 1),
    [serviceList.data],
  );
  const selectedService = useMemo(
    () => packageServices.find((s) => s.id === serviceId),
    [packageServices, serviceId],
  );

  // When service selected, init sessions array dengan default interval
  useEffect(() => {
    if (selectedService) {
      const total = selectedService.sessionCount;
      const dur = selectedService.durationMinutes;
      const newSessions: SessionRow[] = Array.from({ length: total }, (_, i) => {
        const start = defaultStartIso(7 + i * intervalDays, 9);
        return { scheduledStart: start, scheduledEnd: addMinutes(start, dur) };
      });
      setSessions(newSessions);
    } else {
      setSessions([]);
    }
  }, [selectedService, intervalDays]);

  function updateSession(index: number, partial: Partial<SessionRow>) {
    setSessions((prev) => prev.map((s, i) => {
      if (i !== index) return s;
      const next = { ...s, ...partial };
      // Auto-update end based on start kalau service punya duration
      if (partial.scheduledStart && selectedService) {
        next.scheduledEnd = addMinutes(partial.scheduledStart, selectedService.durationMinutes);
      }
      return next;
    }));
  }

  function reapplyInterval() {
    if (!selectedService || sessions.length === 0) return;
    const dur = selectedService.durationMinutes;
    const baseStart = sessions[0].scheduledStart;
    setSessions((prev) =>
      prev.map((s, i) => {
        if (i === 0) return s;
        const next = addMinutes(baseStart, i * intervalDays * 24 * 60);
        return { scheduledStart: next, scheduledEnd: addMinutes(next, dur) };
      }),
    );
  }

  const createMut = useMutation({
    mutationFn: async (payload: object) => {
      // Idempotency-Key: stable per submission attempt — kalau network blip + retry,
      // server return cached response (tidak duplicate booking).
      const idempotencyKey = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).replace(/[^a-zA-Z0-9_-]/g, '');
      return apiClient.post<{ success: boolean; data: { packageGroupId: string; sessionCount: number } }>(
        '/booking/package',
        payload,
        { headers: { 'Idempotency-Key': idempotencyKey } },
      );
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
          description: body?.message ?? 'Bentrok jadwal — adjust slot atau aktifkan buffer override',
        });
        return;
      }
      toast.error('Gagal create package', { description: err.message });
    },
  });

  function submit() {
    if (!clientId || !serviceId || !psikologUserId || !roomId) {
      toast.error('Lengkapi semua field');
      return;
    }
    if (sessions.length < 2) {
      toast.error('Package minimal 2 sesi');
      return;
    }
    createMut.mutate({
      clientId,
      serviceId,
      psikologUserId,
      roomId,
      sessions: sessions.map((s) => ({
        scheduledStart: new Date(s.scheduledStart).toISOString(),
        scheduledEnd: new Date(s.scheduledEnd).toISOString(),
      })),
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
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="card-althea w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="h2">Booking Paket Multi-Sesi</h2>
            <p className="caption mt-1">
              Untuk service dengan <code>sessionCount &gt; 1</code> (e.g., Terapi Anak Lengkap 10 sesi). Atomic — semua sesi divalidasi bersama.
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-icon" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="caption mb-1 block">Klien</label>
              <select
                value={clientId ?? ''}
                onChange={(e) => setClientId(e.target.value ? Number(e.target.value) : null)}
                className="input-althea"
              >
                <option value="">-- pilih --</option>
                {(clientList.data?.data ?? []).map((c) => (
                  <option key={c.id} value={c.id}>{c.name} — {c.phoneWa}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="caption mb-1 block">Service Paket</label>
              <select
                value={serviceId ?? ''}
                onChange={(e) => setServiceId(e.target.value ? Number(e.target.value) : null)}
                className="input-althea"
              >
                <option value="">-- pilih paket --</option>
                {packageServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.sessionCount} sesi × {s.durationMinutes}min — Rp {Number(s.basePrice).toLocaleString('id-ID')}
                  </option>
                ))}
              </select>
              {packageServices.length === 0 && (
                <p className="caption mt-1 text-fg-muted">
                  Tidak ada service paket aktif. Tambah di menu Layanan dengan sessionCount &gt; 1.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="caption mb-1 block">Psikolog (default semua sesi)</label>
              <select
                value={psikologUserId ?? ''}
                onChange={(e) => setPsikologUserId(e.target.value ? Number(e.target.value) : null)}
                className="input-althea"
              >
                <option value="">-- pilih --</option>
                {(psikologList.data?.data ?? []).map((p) => (
                  <option key={p.userId} value={p.userId}>{p.fullName ?? p.email}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="caption mb-1 block">Ruang (default semua sesi)</label>
              <select
                value={roomId ?? ''}
                onChange={(e) => setRoomId(e.target.value ? Number(e.target.value) : null)}
                className="input-althea"
              >
                <option value="">-- pilih --</option>
                {(roomList.data?.data ?? []).map((r) => (
                  <option key={r.id} value={r.id}>[{r.type}] {r.name}</option>
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
                  <button type="button" onClick={reapplyInterval} className="btn btn-outline btn-sm">
                    Apply Interval
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {sessions.map((s, i) => (
                  <div key={i} className="card-althea p-3 bg-cream-50 flex flex-wrap items-center gap-2">
                    <span className="badge badge-sage">Sesi {i + 1}</span>
                    <input
                      type="datetime-local"
                      value={s.scheduledStart}
                      onChange={(e) => updateSession(i, { scheduledStart: e.target.value })}
                      className="input-althea max-w-[210px]"
                    />
                    <span className="caption text-fg-muted">→</span>
                    <input
                      type="datetime-local"
                      value={s.scheduledEnd}
                      onChange={(e) => updateSession(i, { scheduledEnd: e.target.value })}
                      className="input-althea max-w-[210px]"
                    />
                  </div>
                ))}
              </div>
              <p className="caption text-fg-muted">
                💡 Tip: edit Sesi 1 + klik &quot;Apply Interval&quot; untuk auto-fill semua sesi berikutnya
                berdasarkan jarak hari.
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
            <span>Buffer override (skip 15-min buffer + jam operasional check)</span>
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
          <button type="button" onClick={onClose} className="btn btn-ghost">Batal</button>
          <button
            type="button"
            onClick={submit}
            disabled={
              !clientId || !serviceId || !psikologUserId || !roomId || sessions.length < 2 || createMut.isPending
            }
            className="btn btn-primary disabled:opacity-50"
          >
            {createMut.isPending ? 'Menyimpan...' : `Buat ${sessions.length} Booking Sekaligus`}
          </button>
        </div>
      </div>
    </div>
  );
}
