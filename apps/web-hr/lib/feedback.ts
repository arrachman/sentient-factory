// Lightweight feedback helpers for HR.
//
// `notify` routes to sonner's <Toaster> (mounted once in the root layout) so any
// module can surface toasts without prop-drilling. `confirmAction` mirrors the
// web-erp imperative API shape but resolves via the native confirm dialog (HR
// has no modal host yet; consistent with the existing native `confirm()` usage
// in worksites/roles/holidays views).
import { toast } from 'sonner';

export type NotifyType = 'success' | 'info' | 'danger' | 'warn';

export function notify(msg: string, type: NotifyType = 'info'): void {
  const message = (msg ?? '').trim() || 'Terjadi kesalahan tanpa pesan';
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'danger':
      toast.error(message);
      break;
    case 'warn':
      toast.warning(message);
      break;
    default:
      toast(message);
  }
}

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'danger' | 'warn' | 'success';
  icon?: string;
  confirmIcon?: string;
  onConfirm?: () => void;
}

/** Native confirm wrapper — runs `onConfirm` only when the user accepts. */
export function confirmAction(opts: ConfirmOptions): void {
  if (typeof window === 'undefined') return;
  const text = [opts.title, opts.message].filter(Boolean).join('\n\n');
  if (window.confirm(text)) opts.onConfirm?.();
}
