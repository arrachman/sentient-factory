import type { Metadata } from 'next';
import { KioskView } from '@/components/pages/kiosk-view';

export const metadata: Metadata = { title: 'Mode Kiosk' };

export default function Page() {
  return <KioskView />;
}
