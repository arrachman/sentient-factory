import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard Admin' };

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* TODO: stats overview (total pasien, sesi aktif, revenue, dll) */}
    </div>
  );
}
