import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard Marketing' };

export default function MarketingDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="h1">Dashboard Marketing</h1>
      {/* TODO Slice 12: read-only service catalog & capacity view */}
      <p className="caption">
        Service catalog read-only view akan diimplementasi di Slice 12.
      </p>
    </div>
  );
}
