import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard Psikolog' };

export default function PsychologistDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="h1">Dashboard</h1>
      {/* TODO: ringkasan jadwal hari ini, sesi mendatang, stats */}
    </div>
  );
}
