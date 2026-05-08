import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pengaturan' };

export default function AdminPengaturanPage() {
  return (
    <div className="space-y-6">
      <h1 className="h1">Pengaturan</h1>
      {/* TODO: features/admin-pengaturan/ui — global settings */}
    </div>
  );
}
