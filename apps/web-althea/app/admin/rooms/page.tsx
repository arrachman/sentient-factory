import type { Metadata } from 'next';
import { RoomsPage } from '@/features/admin-rooms/ui/rooms-page';

export const metadata: Metadata = { title: 'Ruang' };

export default function AdminRoomsRoute() {
  return <RoomsPage />;
}
