import type { ClientStatus } from './dto/clinic-client.dto';

export type BookingSlim = {
  id: number;
  scheduledStart: Date;
  scheduledEnd: Date;
  sessionN: number;
  sessionTotal: number;
  packageGroupId: string | null;
  status: string;
  service: { id: number; name: string } | null;
  psikolog: { fullName: string | null; email: string } | null;
};

export type ClientServiceRef = {
  id: number;
  name: string;
  category: string;
};

export type ClientEnriched = {
  id: number;
  name: string;
  gender: string;
  age: number | null;
  category: string | null;
  phoneWa: string;
  medicalRecordNumber: string | null;
  preferredServiceType: string | null;
  services: ClientServiceRef[];
  serviceIds: number[];
  email: string | null;
  address: string | null;
  notes: string | null;
  waOptedOut: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Derived
  derivedStatus: ClientStatus;
  totalBookings: number;
  lastSession: { date: Date; serviceName: string | null; psikologName: string | null } | null;
  nextSession: { date: Date; serviceName: string | null; psikologName: string | null } | null;
  currentService: {
    name: string;
    psikologName: string | null;
    sessionN: number;
    sessionTotal: number;
  } | null;
};

export const SELESAI_THRESHOLD_DAYS = 30;

export function deriveCategoryFromAge(age?: number | null): string | null {
  if (age === undefined || age === null) return null;
  if (age < 12) return 'anak';
  if (age < 18) return 'remaja';
  return 'dewasa';
}

export async function resolvePrimaryServiceName(
  ids: number[],
  findUnique: (id: number) => Promise<{ name: string } | null>,
): Promise<string | null> {
  if (ids.length === 0) return null;
  const first = await findUnique(ids[0]);
  return first?.name ?? null;
}
