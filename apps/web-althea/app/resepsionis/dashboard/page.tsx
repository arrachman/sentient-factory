import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard Resepsionis' };

export default function ResepsionisDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="h1">Dashboard Resepsionis</h1>
      {/* TODO Slice 11: Real-time check-in status grid + walk-in booking */}
      <p className="caption">
        Real-time check-in akan diimplementasi di Slice 11.
      </p>
    </div>
  );
}
