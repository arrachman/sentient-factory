import type { Metadata } from 'next';
import { ProjectsView } from '@/components/pages/projects-view';

export const metadata: Metadata = { title: 'Proyek & Aktivitas' };

export default function Page() {
  return <ProjectsView />;
}
