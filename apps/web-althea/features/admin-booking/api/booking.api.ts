import { apiClient } from '@/lib/api-client';
import type { Booking, CreateBookingInput, ListResponse } from '../model/types';

type ListParams = {
  page?: number;
  limit?: number;
  status?: string;
  date?: string;
  psikologUserId?: number;
  clientId?: number;
  roomId?: number;
  includeCancelled?: boolean;
};

function qs(p: ListParams): string {
  const u = new URLSearchParams();
  if (p.page !== undefined) u.set('page', String(p.page));
  if (p.limit !== undefined) u.set('limit', String(p.limit));
  if (p.status) u.set('status', p.status);
  if (p.date) u.set('date', p.date);
  if (p.psikologUserId) u.set('psikologUserId', String(p.psikologUserId));
  if (p.clientId) u.set('clientId', String(p.clientId));
  if (p.roomId) u.set('roomId', String(p.roomId));
  if (typeof p.includeCancelled === 'boolean') u.set('includeCancelled', String(p.includeCancelled));
  const s = u.toString();
  return s ? `?${s}` : '';
}

export type ClinicalNote = {
  id: number;
  bookingId: number;
  psikologUserId: number;
  noteText: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Payment = {
  id: number;
  bookingId: number;
  totalAmount: string | number;
  taxAmount: string | number;
  dpAmount: string | number;
  paidAmount: string | number;
  status: 'pending' | 'dp_paid' | 'lunas' | 'refunded';
  paymentMethod: string | null;
  dpPaidAt: string | null;
  lunasAt: string | null;
};

export const bookingApi = {
  list: (p: ListParams = {}) => apiClient.get<ListResponse>(`/booking${qs(p)}`),
  getById: (id: number) => apiClient.get<{ success: boolean; data: Booking }>(`/booking/${id}`),
  create: (input: CreateBookingInput) => apiClient.post<{ success: boolean; data: Booking }>('/booking', input),
  confirm: (id: number) => apiClient.post<{ success: boolean }>(`/booking/${id}/confirm`),
  checkIn: (id: number) => apiClient.post<{ success: boolean }>(`/booking/${id}/check-in`),
  start: (id: number) => apiClient.post<{ success: boolean }>(`/booking/${id}/start`),
  complete: (id: number) => apiClient.post<{ success: boolean }>(`/booking/${id}/complete`),
  cancel: (id: number, reason?: string) => apiClient.post<{ success: boolean }>(`/booking/${id}/cancel`, { reason }),
  listNotes: (id: number) => apiClient.get<{ success: boolean; data: ClinicalNote[] }>(`/booking/${id}/note`),
  sendReminder: (id: number, templateName?: string) =>
    apiClient.post<{ success: boolean; message: string }>(`/booking/${id}/send-reminder`, { templateName }),
  getPaymentByBooking: (bookingId: number) =>
    apiClient.get<{ success: boolean; data: Payment }>(`/payment/booking/${bookingId}`).catch(() => null),
  recordPayment: (paymentId: number, paidAmount: number, paymentMethod?: string) =>
    apiClient.post<{ success: boolean; data: Payment }>(`/payment/${paymentId}/record`, { paidAmount, paymentMethod }),
  createPayment: (bookingId: number, totalAmount: number, dpAmount: number, taxAmount: number) =>
    apiClient.post<{ success: boolean; data: Payment }>('/payment', { bookingId, totalAmount, dpAmount, taxAmount }),
  sendReceipt: (paymentId: number) =>
    apiClient.post<{ success: boolean; message: string }>(`/payment/${paymentId}/send-receipt`),
};
