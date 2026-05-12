/**
 * Audit log types & mapping helpers.
 *
 * Backend returns raw audit rows from `m0_auditlog` (entityType prefix
 * `clinic.*`). UI bucketizes them into 10 categories sesuai mockup
 * AdminAuditLog.jsx.
 *
 * Mapping rules:
 *   - entityType prefix (clinic.client → klien, clinic.booking → jadwal, …)
 *   - action keyword → severity (delete/cancel → warn; access_denied/login_failed → danger;
 *     check_in/complete/start/confirm → ok; default → info)
 *   - action keyword → human action label (Tambah / Ubah / Hapus / …)
 */
import {
  ClipboardList,
  Clock,
  DoorOpen,
  Eye,
  Layers,
  ListChecks,
  LogIn,
  MessageCircle,
  Settings,
  User,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// =====================================================================
// Backend payload
// =====================================================================

export type AuditLogRow = {
  id: number;
  userId: number | null;
  action: string;
  entityType: string;
  entityId: string | null;
  ipAddress: string | null;
  userAgent?: string | null;
  oldData?: unknown;
  newData?: unknown;
  createdAt: string;
};

export type AuditListResponse = {
  success: boolean;
  data: AuditLogRow[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

// =====================================================================
// UI categories (10) — match AdminAuditLog.jsx mockup AUDIT_CATS
// =====================================================================

export type AuditCategory =
  | 'all'
  | 'auth'
  | 'klien'
  | 'jadwal'
  | 'avail'
  | 'layanan'
  | 'ruangan'
  | 'user'
  | 'setting'
  | 'notif';

export const AUDIT_CATEGORIES: {
  k: AuditCategory;
  label: string;
  icon: LucideIcon | null;
}[] = [
  { k: 'all', label: 'Semua kategori', icon: null },
  { k: 'auth', label: 'Login & sesi', icon: LogIn },
  { k: 'klien', label: 'Data klien', icon: Users },
  { k: 'jadwal', label: 'Penjadwalan', icon: ClipboardList },
  { k: 'avail', label: 'Availability', icon: Clock },
  { k: 'layanan', label: 'Layanan & tarif', icon: ListChecks },
  { k: 'ruangan', label: 'Ruangan', icon: DoorOpen },
  { k: 'user', label: 'User & role', icon: User },
  { k: 'setting', label: 'Pengaturan', icon: Settings },
  { k: 'notif', label: 'Notifikasi WA', icon: MessageCircle },
];

export function categoryLabel(k: AuditCategory): string {
  return AUDIT_CATEGORIES.find((c) => c.k === k)?.label ?? k;
}

// =====================================================================
// Severity
// =====================================================================

export type AuditSeverity = 'info' | 'ok' | 'warn' | 'danger';

export const SEVERITY_META: Record<
  AuditSeverity,
  { label: string; badgeClass: string; iconBg: string; iconFg: string }
> = {
  info: {
    label: 'info',
    badgeClass: 'badge-sage',
    iconBg: 'var(--sage-100)',
    iconFg: 'var(--sage-700)',
  },
  ok: {
    label: 'sukses',
    badgeClass: 'badge-success',
    iconBg: 'var(--success-soft)',
    iconFg: 'var(--success)',
  },
  warn: {
    label: 'perhatian',
    badgeClass: 'badge-warn',
    iconBg: 'var(--warning-soft)',
    iconFg: '#8a4a00',
  },
  danger: {
    label: 'sensitif',
    badgeClass: 'badge-rose',
    iconBg: 'var(--danger-soft)',
    iconFg: 'var(--danger)',
  },
};

// =====================================================================
// Mapping: entityType → category
// =====================================================================

export function entityToCategory(entityType: string): AuditCategory {
  const t = entityType.toLowerCase();
  if (t.startsWith('auth') || t === 'login' || t === 'session') return 'auth';
  if (t.includes('client')) return 'klien';
  if (t.includes('booking') || t.includes('schedule') || t.includes('session')) return 'jadwal';
  if (t.includes('availability') || t.includes('slot')) return 'avail';
  if (t.includes('service') || t.includes('layanan')) return 'layanan';
  if (t.includes('room') || t.includes('ruangan')) return 'ruangan';
  if (t.includes('user') || t.includes('role') || t.includes('psikolog')) return 'user';
  if (t.includes('setting') || t.includes('pengaturan') || t.includes('clinic-info')) return 'setting';
  if (t.includes('wa') || t.includes('template') || t.includes('notif')) return 'notif';
  return 'all';
}

// =====================================================================
// Mapping: action → severity + label + lucide icon
// =====================================================================

const DANGER_ACTIONS = ['login_failed', 'access_denied', 'denied', 'forbidden', 'br04', 'unauthorized'];
const WARN_ACTIONS = ['delete', 'cancel', 'remove', 'lock', 'block', 'revoke'];
const OK_ACTIONS = ['confirm', 'check_in', 'checkin', 'start', 'complete', 'finish', 'send', 'sent'];

export function actionToSeverity(action: string, entityType?: string): AuditSeverity {
  const a = (action || '').toLowerCase();
  if (DANGER_ACTIONS.some((x) => a.includes(x))) return 'danger';
  // sensitive client mutation = danger when entity is client and action is patch
  if (entityType?.toLowerCase().includes('client') && (a === 'patch' || a === 'put')) return 'info';
  if (WARN_ACTIONS.some((x) => a.includes(x))) return 'warn';
  if (OK_ACTIONS.some((x) => a.includes(x))) return 'ok';
  return 'info';
}

const ACTION_LABELS: Record<string, string> = {
  post: 'Tambah data',
  put: 'Ubah data',
  patch: 'Ubah data',
  delete: 'Hapus data',
  confirm: 'Konfirmasi booking',
  cancel: 'Pembatalan',
  reschedule: 'Reschedule sesi',
  check_in: 'Check-in klien',
  start: 'Mulai sesi',
  complete: 'Selesai sesi',
  login_failed: 'Login gagal',
  access_denied: 'Akses ditolak',
  send: 'Kirim notifikasi',
  sent: 'Notifikasi terkirim',
};

export function actionLabel(action: string, entityType: string): string {
  const a = (action || '').toLowerCase();
  const generic = ACTION_LABELS[a] ?? action;
  // contextualize with entity (Tambah klien, Ubah layanan, …)
  const entityWord = entityWordFromType(entityType);
  if (a === 'post' && entityWord) return `Tambah ${entityWord}`;
  if ((a === 'patch' || a === 'put') && entityWord) return `Ubah ${entityWord}`;
  if (a === 'delete' && entityWord) return `Hapus ${entityWord}`;
  return generic;
}

function entityWordFromType(entityType: string): string | null {
  const t = (entityType || '').toLowerCase();
  if (t.includes('client')) return 'data klien';
  if (t.includes('booking')) return 'jadwal sesi';
  if (t.includes('availability')) return 'availability psikolog';
  if (t.includes('service') || t.includes('layanan')) return 'layanan';
  if (t.includes('room')) return 'ruangan';
  if (t.includes('user') || t.includes('role')) return 'user';
  if (t.includes('psikolog')) return 'data psikolog';
  if (t.includes('template')) return 'template WA';
  if (t.includes('setting')) return 'pengaturan';
  return null;
}

// =====================================================================
// View model — derived per row
// =====================================================================

export type AuditEvent = {
  id: number;
  raw: AuditLogRow;
  category: AuditCategory;
  severity: AuditSeverity;
  actionLabel: string;
  target: string; // entityType #entityId
  meta: string;
  time: string; // HH:mm
  date: string; // dd MMM YYYY
  iso: string;
  actor: string; // user label or "Sistem"
  actorRole: string;
  isAuto: boolean;
  ip: string;
  device: string;
};

const ROLE_FROM_ENTITY = (entityType: string): string => {
  // Best-effort: actor role isn't returned by API (only userId). Show a generic
  // marker until we join with users. For system events, mark "Sistem".
  return entityType.toLowerCase().includes('cron') ? 'Otomatis' : 'Pengguna';
};

export const ACTOR_COLOR_BY_ROLE: Record<string, string> = {
  Admin: '#5b8a66',
  Psikolog: '#7a8556',
  Owner: '#1f3a3a',
  Resepsionis: '#4a7090',
  Marketing: '#8a6a3a',
  Otomatis: '#9a8c7a',
  Pengguna: '#9a8c7a',
  '—': '#9a8c7a',
};

export function toEvent(row: AuditLogRow): AuditEvent {
  const dt = new Date(row.createdAt);
  const time = dt.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const date = dt.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const category = entityToCategory(row.entityType);
  const severity = actionToSeverity(row.action, row.entityType);
  const lbl = actionLabel(row.action, row.entityType);
  const target = row.entityId
    ? `${row.entityType} #${row.entityId}`
    : row.entityType;
  const isAuto = row.userId == null;

  return {
    id: row.id,
    raw: row,
    category,
    severity,
    actionLabel: lbl,
    target,
    meta: deriveMeta(row),
    time,
    date,
    iso: row.createdAt,
    actor: isAuto ? 'Sistem' : `User #${row.userId}`,
    actorRole: isAuto ? 'Otomatis' : ROLE_FROM_ENTITY(row.entityType),
    isAuto,
    ip: row.ipAddress ?? '—',
    device: row.userAgent ? shortenUA(row.userAgent) : '—',
  };
}

function shortenUA(ua: string): string {
  const lower = ua.toLowerCase();
  const browser = lower.includes('edg/')
    ? 'Edge'
    : lower.includes('chrome/')
    ? 'Chrome'
    : lower.includes('safari/') && !lower.includes('chrome/')
    ? 'Safari'
    : lower.includes('firefox/')
    ? 'Firefox'
    : 'Browser';
  const os = lower.includes('iphone')
    ? 'iPhone'
    : lower.includes('android')
    ? 'Android'
    : lower.includes('mac os')
    ? 'macOS'
    : lower.includes('windows')
    ? 'Windows'
    : lower.includes('linux')
    ? 'Linux'
    : '';
  return os ? `${browser} · ${os}` : browser;
}

function deriveMeta(row: AuditLogRow): string {
  // Best-effort summary from newData payload
  if (row.newData && typeof row.newData === 'object') {
    const obj = row.newData as Record<string, unknown>;
    const keys = Object.keys(obj).filter((k) => obj[k] !== null && obj[k] !== undefined);
    if (keys.length === 0) return '—';
    const sample = keys
      .slice(0, 3)
      .map((k) => {
        const v = obj[k];
        if (typeof v === 'string') return `${k}: ${truncate(v, 24)}`;
        if (typeof v === 'number' || typeof v === 'boolean') return `${k}: ${v}`;
        return `${k}: …`;
      })
      .join(' · ');
    const tail = keys.length > 3 ? ` · +${keys.length - 3} field` : '';
    return `${sample}${tail}`;
  }
  return '—';
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

// =====================================================================
// Diff helper for detail panel
// =====================================================================

export type FieldDiff = { key: string; before: unknown; after: unknown };

export function diff(oldData: unknown, newData: unknown): FieldDiff[] {
  if (
    !oldData ||
    !newData ||
    typeof oldData !== 'object' ||
    typeof newData !== 'object'
  ) {
    return [];
  }
  const a = oldData as Record<string, unknown>;
  const b = newData as Record<string, unknown>;
  const keys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));
  const out: FieldDiff[] = [];
  for (const k of keys) {
    if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) {
      out.push({ key: k, before: a[k], after: b[k] });
    }
  }
  return out;
}
