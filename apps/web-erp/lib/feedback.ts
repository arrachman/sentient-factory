/**
 * Lightweight feedback helpers — scaffold replacement for the prototype's
 * `window.toast` / `window.bulkAction` / `window.confirmAction` globals.
 * Backed by `sonner` (Toaster mounted in the root layout).
 */
import { toast } from 'sonner';

export type NotifyType = 'success' | 'info' | 'danger' | 'warn';

/** Mirrors prototype `window.toast(msg, { type })`. */
export function notify(msg: string, type: NotifyType = 'info'): void {
  if (type === 'success') return void toast.success(msg);
  if (type === 'danger') return void toast.error(msg);
  if (type === 'warn') return void toast.warning(msg);
  toast(msg);
}

const BULK_LABEL: Record<string, string> = {
  approve: 'disetujui',
  reject: 'ditolak',
  post: 'diposting',
  export: 'diekspor',
  delete: 'dihapus',
};

/**
 * Mirrors prototype `window.bulkAction(kind, count, clearSel, items)` —
 * summarises the action as a toast then clears the selection.
 */
export function bulkAction(
  kind: string,
  count: number,
  clearSel: () => void,
): void {
  const verb = BULK_LABEL[kind] ?? kind;
  notify(`${count} baris ${verb}`, kind === 'delete' ? 'danger' : 'success');
  clearSel();
}
