import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard Intern' };

export default function InternDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* TODO: minimal access placeholder (definisi feature scope di slice tersendiri) */}
      <p className="caption">Welcome, intern.</p>
    </div>
  );
}
