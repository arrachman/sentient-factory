import type { Metadata } from 'next';
import { PsikologPage } from '@/features/admin-psikolog/ui/psikolog-page';

export const metadata: Metadata = { title: 'Psikolog' };

export default function AdminPsikologRoute() {
  return <PsikologPage />;
}
