import type { Metadata } from 'next';
import { AppShell } from '@/components/templates/app-shell';
import { LmsNav } from '@/components/molecules/lms-nav';
import { LmsCompetenciesPage } from '@/components/pages/lms-competencies-page';

export const metadata: Metadata = { title: 'Competencies' };

export default function Page() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <LmsNav />
        <LmsCompetenciesPage />
      </div>
    </AppShell>
  );
}
