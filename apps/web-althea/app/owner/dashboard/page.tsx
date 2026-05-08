import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard Owner' };

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="h1">Dashboard Owner</h1>
      {/* TODO Slice 12: KPI cards (sessions/day, utilization %, revenue) */}
      <p className="caption">
        KPI dashboard akan diimplementasi di Slice 12.
      </p>
    </div>
  );
}
