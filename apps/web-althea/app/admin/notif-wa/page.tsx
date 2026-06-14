import type { Metadata } from 'next';
import { NotifWaPage } from '@/features/admin-notif-wa/ui/notif-wa-page';

export const metadata: Metadata = { title: 'Notifikasi WhatsApp' };

export default function AdminNotifWaPage() {
  return <NotifWaPage />;
}
