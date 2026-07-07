import type { Metadata } from 'next';
import { RolesView } from '@/components/pages/roles-view';

export const metadata: Metadata = { title: 'Akses & Peran' };

export default function Page() {
  return <RolesView />;
}
