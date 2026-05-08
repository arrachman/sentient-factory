import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard Intern' };

export default function InternDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="h1">Dashboard Intern</h1>
      {/* TODO: minimal access placeholder (definisi feature scope di slice tersendiri) */}
      <p className="caption">Welcome, intern.</p>
    </div>
  );
}
