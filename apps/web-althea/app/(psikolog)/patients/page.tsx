import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Pasien' };

export default function PsychologistPatientsPage() {
  return (
    <div className="space-y-6">
      <h1 className="h1">Pasien Saya</h1>
      {/* TODO: list pasien yang pernah/akan sesi dengan psikolog ini */}
    </div>
  );
}
