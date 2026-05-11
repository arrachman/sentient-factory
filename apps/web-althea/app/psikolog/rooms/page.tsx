import type { Metadata } from 'next';
import { PsikologRoomsPage } from '@/features/psikolog-rooms/ui/psikolog-rooms-page';

export const metadata: Metadata = { title: 'Ruangan klinik' };

export default function PsikologRoomsRoute() {
  return <PsikologRoomsPage />;
}
