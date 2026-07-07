import type { Metadata } from 'next';
import { AppearanceView } from '@/components/pages/appearance-view';

export const metadata: Metadata = { title: 'Tampilan' };

export default function Page() {
  return <AppearanceView />;
}
