import { z } from 'zod';

export const WA_CATEGORIES = ['pengingat', 'jadwal', 'onboarding', 'bayar'] as const;
export type WaCategory = (typeof WA_CATEGORIES)[number];
export const CATEGORY_LABEL: Record<WaCategory, string> = {
  pengingat: 'Pengingat',
  jadwal: 'Jadwal',
  onboarding: 'Onboarding',
  bayar: 'Pembayaran',
};

export const WA_STATUSES = ['queued', 'terkirim', 'sampai', 'dibaca', 'gagal'] as const;
export const STATUS_BADGE: Record<string, string> = {
  queued: 'badge-warn',
  terkirim: 'badge-sage',
  sampai: 'badge-terapi',
  dibaca: 'badge-success',
  gagal: 'badge-neutral',
};

export type Template = {
  id: number;
  name: string;
  category: WaCategory;
  triggerEvent: string | null;
  body: string;
  recipients: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WaLog = {
  id: number;
  templateId: number | null;
  recipientType: string;
  recipientPhone: string;
  body: string;
  messageId: string | null;
  status: string;
  errorReason: string | null;
  retryCount: number;
  bookingId: number | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
  createdAt: string;
  template: { id: number; name: string; category: string } | null;
};

export const createTemplateSchema = z.object({
  name: z.string().min(2).max(120),
  category: z.enum(WA_CATEGORIES),
  triggerEvent: z.string().max(80).optional(),
  body: z.string().min(2).max(4000),
  recipients: z.array(z.string()).min(1),
  isActive: z.boolean().optional(),
});
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;

export type ListResponse<T> = {
  success: boolean;
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};
