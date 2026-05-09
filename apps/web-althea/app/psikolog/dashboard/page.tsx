import type { Metadata } from 'next';
import { PsikologDashboard } from '@/features/psikolog-workflow/ui/dashboard';

export const metadata: Metadata = { title: 'Dashboard Psikolog' };

export default function PsychologistDashboardPage() {
  return <PsikologDashboard />;
}
