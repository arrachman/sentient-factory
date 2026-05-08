import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sesi' };

export default function PsychologistSessionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="h1">Sesi</h1>
      {/* TODO: features/session/ui/psychologist-session-list */}
    </div>
  );
}
