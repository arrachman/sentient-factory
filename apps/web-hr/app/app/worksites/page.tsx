import type { Metadata } from 'next';
import { WorksitesView } from '@/components/pages/worksites-view';

export const metadata: Metadata = { title: 'Lokasi & Geofence' };

export default function Page() {
  return <WorksitesView />;
}
