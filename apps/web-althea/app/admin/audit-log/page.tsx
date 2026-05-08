import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Audit Log' };

export default function AdminAuditLogPage() {
  return (
    <div className="space-y-6">
      <h1 className="h1">Audit Log</h1>
      {/* TODO: features/admin-audit-log/ui */}
    </div>
  );
}
