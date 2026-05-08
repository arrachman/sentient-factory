'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

type AuditLog = {
  id: number;
  userId: number | null;
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

export default function AdminAuditLogPage() {
  const [entityType, setEntityType] = useState<string>('');
  const [action, setAction] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['clinic', 'audit', { entityType, action }],
    queryFn: () => {
      const params = new URLSearchParams({ limit: '100' });
      if (entityType) params.set('entityType', entityType);
      if (action) params.set('action', action);
      return apiClient.get<AuditResponse>(`/audit?${params.toString()}`);
    },
  });

  const items = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="h1">Audit Log</h1>
        <p className="caption mt-1">Catatan otomatis semua mutasi di domain clinic.*. Read-only.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select value={entityType} onChange={(e) => setEntityType(e.target.value)} className="input-althea max-w-[240px]">
          <option value="">Semua entity</option>
          <option value="clinic.psikolog">clinic.psikolog</option>
          <option value="clinic.service">clinic.service</option>
          <option value="clinic.room">clinic.room</option>
          <option value="clinic.client">clinic.client</option>
          <option value="clinic.users">clinic.users</option>
          <option value="clinic.booking">clinic.booking</option>
        </select>
        <select value={action} onChange={(e) => setAction(e.target.value)} className="input-althea max-w-[200px]">
          <option value="">Semua aksi</option>
          <option value="post">post (create)</option>
          <option value="patch">patch (update)</option>
          <option value="delete">delete</option>
          <option value="confirm">confirm</option>
          <option value="cancel">cancel</option>
          <option value="reschedule">reschedule</option>
          <option value="check_in">check_in</option>
          <option value="start">start</option>
          <option value="complete">complete</option>
        </select>
      </div>

      <div className="card-althea overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 border-b border-border text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Waktu</th>
              <th className="px-4 py-2 font-medium">User ID</th>
              <th className="px-4 py-2 font-medium">Aksi</th>
              <th className="px-4 py-2 font-medium">Entity</th>
              <th className="px-4 py-2 font-medium">Entity ID</th>
              <th className="px-4 py-2 font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {items.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-b-0 hover:bg-cream-50">
                <td className="px-4 py-2 caption font-mono">{new Date(l.createdAt).toLocaleString('id-ID')}</td>
                <td className="px-4 py-2">{l.userId ?? '—'}</td>
                <td className="px-4 py-2"><span className="badge badge-sage">{l.action}</span></td>
                <td className="px-4 py-2 font-mono text-xs">{l.entityType}</td>
                <td className="px-4 py-2">{l.entityId ?? '—'}</td>
                <td className="px-4 py-2 font-mono text-xs">{l.ipAddress ?? '—'}</td>
              </tr>
            ))}
            {items.length === 0 && !isLoading && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-fg-muted">Belum ada audit log.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="caption text-right">Total: {data?.meta.total ?? 0} entries</div>
    </div>
  );
}
