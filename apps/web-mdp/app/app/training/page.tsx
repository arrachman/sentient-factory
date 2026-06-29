import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { LmsNav } from '@/components/molecules/lms-nav';
import { LmsCoursesPage } from '@/components/pages/lms-courses-page';

export const metadata: Metadata = { title: 'Courses' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <LmsNav />
        <LmsCoursesPage />
      </div>
    </AppShell>
  );
}
