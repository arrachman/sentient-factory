'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

type AuditLog = {
  id: number;
  userId: number | null;
  userName: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  ipAddress: string | null;
  newData: unknown;
  createdAt: string;
};

type AuditResponse = {
  success: boolean;
  data: AuditLog[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

const ACTION_LABEL: Record<string, string> = {
  post: 'Tambah data',
  put: 'Ubah data',
  patch: 'Ubah data',
  delete: 'Hapus data',
  confirm: 'Konfirmasi',
  cancel: 'Batalkan',
  reschedule: 'Jadwal ulang',
  check_in: 'Check-in',
  start: 'Mulai sesi',
  complete: 'Selesai sesi',
  login_failed: 'Login gagal',
  access_denied: 'Akses ditolak',
  send: 'Kirim notif',
  sent: 'Notif terkirim',
};

const ENTITY_LABEL: Record<string, string> = {
  'clinic.booking': 'Jadwal Sesi',
  'clinic.client': 'Data Klien',
  'clinic.psikolog': 'Data Psikolog',
  'clinic.service': 'Layanan',
  'clinic.room': 'Ruangan',
  'clinic.users': 'Pengguna',
  'clinic.user': 'Pengguna',
  'clinic.setting': 'Pengaturan',
  'clinic.template': 'Template WA',
  'clinic.notif': 'Notifikasi WA',
  'clinic.availability': 'Ketersediaan Psikolog',
};

const ACTION_BADGE: Record<string, string> = {
  post: 'badge-sage',
  put: 'badge-sage',
  patch: 'badge-sage',
  delete: 'badge-rose',
  cancel: 'badge-rose',
  complete: 'badge-success',
  confirm: 'badge-success',
  check_in: 'badge-success',
  start: 'badge-success',
  sent: 'badge-success',
  send: 'badge-success',
  login_failed: 'badge-rose',
  access_denied: 'badge-rose',
};

const LIMIT_OPTIONS = [25, 50, 100, 200];

function labelEntity(raw: string): string {
  if (ENTITY_LABEL[raw]) return ENTITY_LABEL[raw];
  const t = raw.toLowerCase();
  if (t.includes('booking')) return 'Jadwal Sesi';
  if (t.includes('client')) return 'Data Klien';
  if (t.includes('psikolog')) return 'Data Psikolog';
  if (t.includes('service') || t.includes('layanan')) return 'Layanan';
  if (t.includes('room') || t.includes('ruangan')) return 'Ruangan';
  if (t.includes('user') || t.includes('role')) return 'Pengguna';
  if (t.includes('setting')) return 'Pengaturan';
  if (t.includes('template')) return 'Template WA';
  if (t.includes('notif') || t.includes('wa')) return 'Notifikasi WA';
  if (t.includes('availability') || t.includes('slot')) return 'Jadwal Psikolog';
  return raw.replace(/^clinic\./, '').replace(/_/g, ' ');
}

function labelAction(raw: string): string {
  return ACTION_LABEL[raw.toLowerCase()] ?? raw;
}

function labelIp(ip: string | null): string {
  if (!ip) return 'Tidak tersedia';
  if (ip === '127.0.0.1' || ip === '::1') return 'Server lokal';
  if (
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
  ) return 'LAN';
  return ip;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return 'Baru saja';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} mnt lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  return d.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }) + ' WIB';
}

function formatTimeExact(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }) + ' WIB';
}

export default function AdminAuditLogPage() {
  const [entityType, setEntityType] = useState('');
  const [action, setAction] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const { data, isLoading } = useQuery({
    queryKey: ['clinic', 'audit', { entityType, action, page, limit }],
    queryFn: () => {
      const params = new URLSearchParams({
        limit: String(limit),
        page: String(page),
      });
      if (entityType) params.set('entityType', entityType);
      if (action) params.set('action', action);
      return apiClient.get<AuditResponse>(`/audit?${params.toString()}`);
    },
  });

  const items = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  function handleFilterChange(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setter(e.target.value);
      setPage(1);
    };
  }

  function handleLimitChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLimit(Number(e.target.value));
    setPage(1);
  }

  return (
    <div className="space-y-4 p-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={entityType}
          onChange={handleFilterChange(setEntityType)}
          className="input-althea max-w-[200px]"
        >
          <option value="">Semua entitas</option>
          <option value="clinic.booking">Jadwal Sesi</option>
          <option value="clinic.client">Data Klien</option>
          <option value="clinic.psikolog">Psikolog</option>
          <option value="clinic.service">Layanan</option>
          <option value="clinic.room">Ruangan</option>
          <option value="clinic.users">Pengguna</option>
        </select>
        <select
          value={action}
          onChange={handleFilterChange(setAction)}
          className="input-althea max-w-[180px]"
        >
          <option value="">Semua aksi</option>
          <option value="post">Tambah data</option>
          <option value="patch">Ubah data</option>
          <option value="delete">Hapus data</option>
          <option value="confirm">Konfirmasi</option>
          <option value="cancel">Batalkan</option>
          <option value="reschedule">Jadwal ulang</option>
          <option value="check_in">Check-in</option>
          <option value="start">Mulai sesi</option>
          <option value="complete">Selesai sesi</option>
        </select>
      </div>

      {/* Table */}
      <div className="card-althea overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 border-b border-border text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Waktu</th>
              <th className="px-4 py-2 font-medium">Pengguna</th>
              <th className="px-4 py-2 font-medium">Aksi</th>
              <th className="px-4 py-2 font-medium">Entitas</th>
              <th className="px-4 py-2 font-medium">IP Akses</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-fg-muted">
                  Memuat…
                </td>
              </tr>
            )}
            {!isLoading && items.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-b-0 hover:bg-cream-50">
                <td className="px-4 py-2">
                  <span className="caption block" title={formatTimeExact(l.createdAt)}>
                    {formatTime(l.createdAt)}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs">
                  {l.userName ?? (l.userId ? `Pengguna #${l.userId}` : 'Sistem')}
                </td>
                <td className="px-4 py-2">
                  <span className={`badge ${ACTION_BADGE[l.action.toLowerCase()] ?? 'badge-sage'}`}>
                    {labelAction(l.action)}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs">{labelEntity(l.entityType)}</td>
                <td className="px-4 py-2 text-xs" title={l.ipAddress ?? ''}>
                  {labelIp(l.ipAddress)}
                </td>
              </tr>
            ))}
            {!isLoading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-fg-muted">
                  Belum ada audit log.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 caption">
          <span>Tampilkan</span>
          <select
            value={limit}
            onChange={handleLimitChange}
            className="input-althea py-1 text-xs"
            style={{ width: 72 }}
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>entri</span>
          {meta && (
            <span className="text-fg-muted ml-2">
              · {(page - 1) * limit + 1}–{Math.min(page * limit, meta.total)} dari {meta.total}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={14} />
          </button>
          <span className="caption px-2">
            Hal. {page} / {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
