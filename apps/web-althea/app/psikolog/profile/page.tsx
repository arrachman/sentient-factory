import type { Metadata } from 'next';
import { ProfilePage } from '@/features/psikolog-profile/ui/profile-page';

export const metadata: Metadata = { title: 'Profil saya' };

export default function PsikologProfileRoute() {
  return <ProfilePage />;
}
