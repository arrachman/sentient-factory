'use client';

import { useState } from 'react';
import { CheckCircle2, Play } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import {
  useBookingList,
  useCompleteBooking,
  useStartBooking,
} from '@/features/admin-booking/hooks/use-booking';
import {
  STATUS_BADGE_CLASS,
  STATUS_LABEL,
  type Booking,
} from '@/features/admin-booking/model/types';
import { useMe } from '@/features/auth/hooks/use-me';

export default function PsikologSessionsPage() {
  const me = useMe();
  const myUserId = me.data?.data.id;
  const [statusFilter, setStatusFilter] = useState<string>('checked_in');
  const list = useBookingList({ status: statusFilter, psikologUserId: myUserId, limit: 50 });
  const startMut = useStartBooking();
  const completeMut = useCompleteBooking();
  const qc = useQueryClient();

  const [noteOpen, setNoteOpen] = useState<Booking | null>(null);
  const [note, setNote] = useState('');

  // Save clinical note + complete booking
  const completeWithNoteMut = useMutation({
    mutationFn: async ({ bookingId, noteText }: { bookingId: number; noteText: string }) => {
      // Save note (kalau ada isi)
      if (noteText.trim()) {
        await apiClient.post(`/booking/${bookingId}/note`, { noteText: noteText.trim() });
      }
      // Complete booking
      return apiClient.post(`/booking/${bookingId}/complete`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking'] });
      toast.success('Sesi diselesaikan');
      setNoteOpen(null);
      setNote('');
    },
    onError: (e: Error) => toast.error('Gagal selesaikan sesi', { description: e.message }),
  });

  const items = list.data?.data ?? [];

  function handleComplete(b: Booking) {
    setNoteOpen(b);
    setNote('');
  }

  function submitComplete() {
    if (!noteOpen) return;
    completeWithNoteMut.mutate({ bookingId: noteOpen.id, noteText: note });
  }

  return (
    <div className="space-y-6 p-4 lg:p-8">
      <div>
        <h1 className="h1">Sesi</h1>
        <p className="caption mt-1">
          Sesi {me.data?.data.fullName ?? 'Anda'} yang sedang berlangsung atau menunggu.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['checked_in', 'in_progress', 'completed'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-outline'}`}
          >
            {STATUS_LABEL[s as keyof typeof STATUS_LABEL]}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {items.map((b: Booking) => (
          <div key={b.id} className="card-althea p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-medium text-teal-800">
                {b.client.name} — {b.service.name}
              </div>
              <div className="caption">
                {new Date(b.scheduledStart).toLocaleString('id-ID', {
                  weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                })}
                {' '}di {b.room.name}
              </div>
              <span className={`badge ${STATUS_BADGE_CLASS[b.status]} mt-1`}>{STATUS_LABEL[b.status]}</span>
            </div>
            <div className="flex gap-2">
              {b.status === 'checked_in' && (
                <button type="button" onClick={() => startMut.mutate(b.id)} className="btn btn-primary btn-sm">
                  <Play className="h-3.5 w-3.5" /> Mulai Sesi
                </button>
              )}
              {b.status === 'in_progress' && (
                <button type="button" onClick={() => handleComplete(b)} className="btn btn-primary btn-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Selesai
                </button>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && !list.isLoading && (
          <div className="card-althea p-8 text-center text-fg-muted">Tidak ada sesi.</div>
        )}
      </div>

      {noteOpen && (
        <div role="dialog" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setNoteOpen(null); }}>
          <div className="card-althea w-full max-w-md bg-card">
            <div className="border-b border-border px-6 py-4">
              <h2 className="h2">Catatan Sesi: {noteOpen.client.name}</h2>
              <p className="caption mt-1">{noteOpen.service.name}</p>
            </div>
            <div className="space-y-3 px-6 py-4">
              <div>
                <label className="caption mb-1 block">Catatan Klinis (opsional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={6}
                  className="input-althea h-auto py-2"
                  placeholder="Tulis catatan sesi di sini... (akan disimpan ke clinical record)"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => setNoteOpen(null)}
                  className="btn btn-outline"
                  disabled={completeWithNoteMut.isPending}
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={submitComplete}
                  disabled={completeWithNoteMut.isPending}
                  className="btn btn-primary"
                >
                  {completeWithNoteMut.isPending ? 'Memproses...' : 'Selesaikan Sesi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
