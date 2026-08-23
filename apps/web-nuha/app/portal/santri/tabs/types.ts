import type { Santri, Unit, Kelas, Kamar, Asrama } from '@prisma/client';

/** Bentuk data santri yang dipakai lintas tab portal santri, hasil include page.tsx. */
export type SantriLengkap = Santri & {
  unit: Unit | null;
  kelas: Kelas | null;
  kamar: (Kamar & { asrama: Asrama }) | null;
};
