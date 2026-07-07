// Lightweight feedback helpers for MDP.
//
// `notify` dispatches a `mdp-toast` CustomEvent consumed by <ToastHost>
// (mounted once in the app shell) — importable anywhere without prop-drilling.
// `confirmAction` mirrors the web-erp imperative API shape but resolves via the
// native confirm dialog (MDP has no modal host yet; consistent with the
// existing native `confirm()` usage in MasterCrudPage).

export type NotifyType = 'success' | 'info' | 'danger' | 'warn';

export interface ToastDetail {
  message: string;
  type: NotifyType;
}

export function notify(msg: string, type: NotifyType = 'info'): void {
  if (typeof window === 'undefined') return;
  const message = (msg ?? '').trim() || 'Terjadi kesalahan tanpa pesan';
  window.dispatchEvent(
    new CustomEvent<ToastDetail>('mdp-toast', { detail: { message, type } }),
  );
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
