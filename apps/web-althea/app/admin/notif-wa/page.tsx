import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Notifikasi WhatsApp' };

export default function AdminNotifWaPage() {
  return (
    <div className="space-y-6">
      <h1 className="h1">Notifikasi WhatsApp</h1>
      {/* TODO: features/admin-notif-wa/ui — template + dispatch + log */}
    </div>
  );
}
