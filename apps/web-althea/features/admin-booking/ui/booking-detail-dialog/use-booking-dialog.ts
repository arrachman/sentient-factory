'use client';

/**
 * Hook orchestrator untuk dialog detail booking.
 *   - Tab state + payment input fields
 *   - Lazy queries: notes (only when notes tab open), payment (always saat dialog open)
 *   - Mutations: send reminder, record payment, create payment, send receipt
 */
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bookingApi } from '../../api/booking.api';
import type { Booking } from '../../model/types';
import type { DialogTab } from './dialog-tabs';
import type { RescheduleEvent } from './booking-history-tab';

export function useBookingDialog(booking: Booking | null) {
  const qc = useQueryClient();
  const [tab, setTab] = useState<DialogTab>('detail');
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
    enabled: !!booking && (tab === 'payment' || tab === 'detail'),
  });

  const reminderMut = useMutation({
    mutationFn: (templateName: string) =>
      bookingApi.sendReminder(booking!.id, templateName),
    onSuccess: (res) =>
      toast.success(res.message ?? 'Reminder dispatched'),
    onError: (e: Error) =>
      toast.error('Gagal kirim reminder', { description: e.message }),
  });

  const recordPaymentMut = useMutation({
    mutationFn: ({
      paymentId,
      amount,
      method,
    }: {
      paymentId: number;
      amount: number;
      method: string;
    }) => bookingApi.recordPayment(paymentId, amount, method),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['clinic', 'booking', booking?.id, 'payment'],
      });
      qc.invalidateQueries({ queryKey: ['clinic', 'booking', 'list'] });
      toast.success('Pembayaran tercatat');
      setPaidAmount('');
    },
    onError: (e: Error) =>
      toast.error('Gagal record', { description: e.message }),
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
      qc.invalidateQueries({
        queryKey: ['clinic', 'booking', booking?.id, 'payment'],
      });
      toast.success('Payment record dibuat');
    },
    onError: (e: Error) =>
      toast.error('Gagal buat payment', { description: e.message }),
  });

  const sendReceiptMut = useMutation({
    mutationFn: (paymentId: number) => bookingApi.sendReceipt(paymentId),
    onSuccess: () => toast.success('Receipt sent via WA'),
    onError: (e: Error) =>
      toast.error('Gagal kirim receipt', { description: e.message }),
  });

  const rescheduleHistory = ((booking as { rescheduleHistory?: unknown[] } | null)
    ?.rescheduleHistory ?? []) as RescheduleEvent[];

  return {
    tab,
    setTab,
    paidAmount,
    setPaidAmount,
    paymentMethod,
    setPaymentMethod,
    notesQuery,
    paymentQuery,
    reminderMut,
    recordPaymentMut,
    createPaymentMut,
    sendReceiptMut,
    rescheduleHistory,
  };
}
