import type { Metadata } from 'next';
import { LeaveView } from '@/components/pages/leave-view';

export const metadata: Metadata = { title: 'Cuti' };

export default function Page() {
  return <LeaveView />;
}
