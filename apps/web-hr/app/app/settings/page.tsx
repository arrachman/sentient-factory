import type { Metadata } from 'next';
import { SettingsView } from '@/components/pages/settings-view';

export const metadata: Metadata = { title: 'Pengaturan' };

export default function Page() {
  return <SettingsView />;
}
