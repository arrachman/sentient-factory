'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Banknote,
  Bell,
  FileText,
  History,
  Receipt,
  Send,
  X,
} from 'lucide-react';
import { bookingApi } from '../api/booking.api';
import { STATUS_BADGE_CLASS, STATUS_LABEL, type Booking } from '../model/types';
import { DetailRow, formatDateTime, rp } from './booking-detail-utils';
import { PLAN_FEATURES } from '@/shared/config/clinic-plan';

type Props = { booking: Booking | null; onClose: () => void };

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu Konfirmasi',
  dp_paid: 'DP Lunas',
  lunas: 'Lunas',
  refunded: 'Refund',
};

export function BookingDetailDialog({ booking, onClose }: Props) {
  const qc = useQueryClient();
  const [tab, setTab] = useState<'detail' | 'notes' | 'payment' | 'history'>('detail');
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const notesQuery = useQuery({
    queryKey: ['clinic', 'booking', booking?.id, 'notes'],
    queryFn: () => bookingApi.listNotes(booking!.id),
    enabled: !!booking && tab === 'notes',
  });

  const paymentQuery = useQuery({
    queryKey: ['clinic', 'booking', booking?.id, 'payment'],
    queryFn: () => bookingApi.getPaymentByBooking(booking!.id),
    enabled: PLAN_FEATURES.payment && !!booking && (tab === 'payment' || tab === 'detail'),
  });

  const reminderMut = useMutation({
    mutationFn: (templateName: string) => bookingApi.sendReminder(booking!.id, templateName),
    onSuccess: (res) => toast.success(res.message ?? 'Reminder dispatched'),
    onError: (e: Error) => toast.error('Gagal kirim reminder', { description: e.message }),
  });

  const recordPaymentMut = useMutation({
    mutationFn: ({ paymentId, amount, method }: { paymentId: number; amount: number; method: string }) =>
      bookingApi.recordPayment(paymentId, amount, method),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking', booking?.id, 'payment'] });
      qc.invalidateQueries({ queryKey: ['clinic', 'booking', 'list'] });
      toast.success('Pembayaran tercatat');
      setPaidAmount('');
    },
    onError: (e: Error) => toast.error('Gagal record', { description: e.message }),
  });

  const createPaymentMut = useMutation({
    mutationFn: () => {
      if (!booking) throw new Error('No booking');
      const base = Number(booking.service.basePrice);
      const tax = Math.round(base * 0.11);
      const total = base + tax;
      const dp = Math.round(total * 0.5);
      return bookingApi.createPayment(booking.id, total, dp, tax);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clinic', 'booking', booking?.id, 'payment'] });
      toast.success('Payment record dibuat');
    },
    onError: (e: Error) => toast.error('Gagal buat payment', { description: e.message }),
  });

  const sendReceiptMut = useMutation({
    mutationFn: (paymentId: number) => bookingApi.sendReceipt(paymentId),
    onSuccess: () => toast.success('Receipt sent via WA'),
    onError: (e: Error) => toast.error('Gagal kirim receipt', { description: e.message }),
  });

  if (!booking) return null;

  const payment = paymentQuery.data?.data;
  const rescheduleHistory = ((booking as { rescheduleHistory?: unknown[] }).rescheduleHistory ?? []) as Array<{
    from: { start: string; end: string; psikologUserId: number; roomId: number };
    to: { start: string; end: string; psikologUserId: number; roomId: number };
    reason?: string;
    at: string;
  }>;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-althea w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="h2">Booking #{booking.id}</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className={`badge ${STATUS_BADGE_CLASS[booking.status]}`}>
                {STATUS_LABEL[booking.status]}
              </span>
              {booking.createdViaWalkIn && <span className="badge badge-warn">Walk-in</span>}
              {booking.sessionTotal > 1 && (
                <span className="caption">
                  Sesi {booking.sessionN}/{booking.sessionTotal}
                </span>
              )}
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-icon btn-sm" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border px-6 flex gap-1 overflow-x-auto">
          {[
            { id: 'detail', label: 'Detail', icon: <FileText className="h-4 w-4" /> },
            { id: 'notes', label: 'Catatan Klinis', icon: <FileText className="h-4 w-4" /> },
            ...(PLAN_FEATURES.payment
              ? [{ id: 'payment', label: 'Pembayaran', icon: <Banknote className="h-4 w-4" /> }]
              : []),
            {
              id: 'history',
              label: `Riwayat (${rescheduleHistory.length})`,
              icon: <History className="h-4 w-4" />,
            },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition ${
                tab === t.id
                  ? 'border-sage-500 text-sage-700'
                  : 'border-transparent text-fg-muted hover:text-teal-800'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {tab === 'detail' && (
            <div className="space-y-3 text-sm">
              <DetailRow label="Klien" value={
                <div>
                  <div className="font-medium">{booking.client.name}</div>
                  <div className="caption font-mono">{booking.client.phoneWa}</div>
                </div>
              } />
              <DetailRow label="Layanan" value={
                <div>
                  <div>{booking.service.name}</div>
                  <div className="caption">{booking.service.category} · {booking.service.durationMinutes}min · {rp(booking.service.basePrice)}</div>
                </div>
              } />
              <DetailRow label="Psikolog" value={
                <div className="flex items-center gap-2">
                  <span className="avatar avatar-sm" style={booking.psikolog.clinicPsikologProfile?.color ? { backgroundColor: booking.psikolog.clinicPsikologProfile.color, color: '#fff' } : undefined}>
                    {(booking.psikolog.fullName || booking.psikolog.email).slice(0, 2).toUpperCase()}
                  </span>
                  <span>{booking.psikolog.fullName || booking.psikolog.email}</span>
                </div>
              } />
              <DetailRow label="Ruang" value={booking.room.name} />
              <DetailRow label="Mulai" value={formatDateTime(booking.scheduledStart)} />
              <DetailRow label="Selesai" value={formatDateTime(booking.scheduledEnd)} />
              {booking.notes && <DetailRow label="Catatan" value={<div className="whitespace-pre-wrap">{booking.notes}</div>} />}

              {/* Payment summary — paket premium only */}
              {PLAN_FEATURES.payment && payment && (
                <DetailRow
                  label="Pembayaran"
                  value={
                    <div className="flex items-center gap-2">
                      <span className="badge badge-sage">{PAYMENT_STATUS_LABEL[payment.status] || payment.status}</span>
                      <span className="caption">{rp(payment.paidAmount)} / {rp(payment.totalAmount)}</span>
                    </div>
                  }
                />
              )}

              {/* Quick actions */}
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                {!['cancelled', 'completed'].includes(booking.status) && (
                  <>
                    <button
                      type="button"
                      onClick={() => reminderMut.mutate('Pengingat H-1')}
                      disabled={reminderMut.isPending}
                      className="btn btn-outline btn-sm"
                    >
                      <Bell className="h-3.5 w-3.5" /> Reminder H-1
                    </button>
                    <button
                      type="button"
                      onClick={() => reminderMut.mutate('Pengingat 30 Menit')}
                      disabled={reminderMut.isPending}
                      className="btn btn-outline btn-sm"
                    >
                      <Bell className="h-3.5 w-3.5" /> Reminder 30 menit
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {tab === 'notes' && (
            <div className="space-y-2">
              {notesQuery.isLoading && <div className="caption">Memuat catatan...</div>}
              {(notesQuery.data?.data ?? []).map((n) => (
                <div key={n.id} className="card-althea p-3 bg-cream-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="caption text-fg-muted">
                      {new Date(n.createdAt).toLocaleString('id-ID')}
                    </span>
                    {n.isPrivate && <span className="badge badge-neutral">Private</span>}
                  </div>
                  <div className="whitespace-pre-wrap text-sm">{n.noteText}</div>
                </div>
              ))}
              {!notesQuery.isLoading && (notesQuery.data?.data ?? []).length === 0 && (
                <div className="caption text-center py-8 text-fg-muted">
                  Belum ada catatan klinis untuk booking ini.
                </div>
              )}
            </div>
          )}

          {tab === 'payment' && (
            <div className="space-y-3">
              {paymentQuery.isLoading && <div className="caption">Memuat...</div>}
              {!paymentQuery.isLoading && !payment && (
                <div className="card-althea p-4 text-center bg-cream-50 space-y-2">
                  <div className="caption text-fg-muted">Belum ada record pembayaran untuk booking ini.</div>
                  <button
                    type="button"
                    onClick={() => createPaymentMut.mutate()}
                    disabled={createPaymentMut.isPending}
                    className="btn btn-primary btn-sm"
                  >
                    Buat Record Pembayaran (auto DP 50% + PPN 11%)
                  </button>
                </div>
              )}
              {payment && (
                <>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <DetailRow label="Status" value={<span className="badge badge-sage">{PAYMENT_STATUS_LABEL[payment.status] || payment.status}</span>} />
                    <DetailRow label="Total" value={rp(payment.totalAmount)} />
                    <DetailRow label="PPN" value={rp(payment.taxAmount)} />
                    <DetailRow label="DP" value={rp(payment.dpAmount)} />
                    <DetailRow label="Dibayar" value={<span className="font-medium text-success">{rp(payment.paidAmount)}</span>} />
                    <DetailRow label="Sisa" value={rp(Number(payment.totalAmount) - Number(payment.paidAmount))} />
                  </div>

                  {payment.status !== 'lunas' && payment.status !== 'refunded' && (
                    <div className="card-althea p-3 bg-cream-50 space-y-2">
                      <div className="caption font-medium">Record Pembayaran</div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min={0}
                          placeholder="Nominal (Rp)"
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(e.target.value)}
                          className="input-althea"
                        />
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-althea">
                          <option value="cash">Cash</option>
                          <option value="transfer">Transfer</option>
                          <option value="qris">QRIS</option>
                          <option value="card">Kartu</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const amount = Number(paidAmount);
                            if (!amount || amount <= 0) {
                              toast.error('Nominal harus > 0');
                              return;
                            }
                            recordPaymentMut.mutate({ paymentId: payment.id, amount, method: paymentMethod });
                          }}
                          disabled={recordPaymentMut.isPending}
                          className="btn btn-primary btn-sm"
                        >
                          <Banknote className="h-3.5 w-3.5" /> Record
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaidAmount(String(Number(payment.dpAmount)))}
                          className="btn btn-outline btn-sm"
                        >
                          Isi DP
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaidAmount(String(Number(payment.totalAmount) - Number(payment.paidAmount)))}
                          className="btn btn-outline btn-sm"
                        >
                          Isi Sisa
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                    <a
                      href={`/api/clinic/payment/${payment.id}/receipt.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      <Receipt className="h-3.5 w-3.5" /> Download PDF
                    </a>
                    <button
                      type="button"
                      onClick={() => sendReceiptMut.mutate(payment.id)}
                      disabled={sendReceiptMut.isPending}
                      className="btn btn-outline btn-sm"
                    >
                      <Send className="h-3.5 w-3.5" /> Kirim Receipt via WA
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === 'history' && (
            <div className="space-y-2">
              {rescheduleHistory.length === 0 ? (
                <div className="caption text-center py-8 text-fg-muted">
                  Belum ada riwayat reschedule.
                </div>
              ) : (
                rescheduleHistory.map((h, i) => (
                  <div key={i} className="card-althea p-3 bg-cream-50 text-sm">
                    <div className="caption text-fg-muted mb-1">
                      {new Date(h.at).toLocaleString('id-ID')}
                    </div>
                    <div>
                      <span className="text-fg-muted">Dari:</span>{' '}
                      {new Date(h.from.start).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      {' → '}
                      <span className="text-fg-muted">Ke:</span>{' '}
                      {new Date(h.to.start).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {h.reason && <div className="caption mt-1">Alasan: {h.reason}</div>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

