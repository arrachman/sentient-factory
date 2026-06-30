import type { Metadata } from 'next';
import { OvertimePolicyView } from '@/components/pages/overtime-policy-view';

export const metadata: Metadata = { title: 'Aturan Lembur' };

export default function Page() {
  return <OvertimePolicyView />;
}
