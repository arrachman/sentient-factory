import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { LmsNav } from '@/components/molecules/lms-nav';
import { LmsEnrollmentsPage } from '@/components/pages/lms-enrollments-page';

export const metadata: Metadata = { title: 'Enrollments' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <LmsNav />
        <LmsEnrollmentsPage />
      </div>
    </AppShell>
  );
}
