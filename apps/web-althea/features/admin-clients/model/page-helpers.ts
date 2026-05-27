/**
 * Domain konstanta untuk halaman Klien.
 */
import type {
  ClientStatus,
  CreateClientInput,
} from './types';

export type Filter = 'semua' | ClientStatus;

export const EMPTY_CLIENT: CreateClientInput = {
  name: '',
  gender: 'L',
  age: undefined,
  category: undefined,
  phoneWa: '+62',
  medicalRecordNumber: '',
  serviceIds: [],
  email: '',
  address: '',
  notes: '',
  waOptedOut: false,
};

/**
 * Sanitize: backend reject empty string untuk field opsional yang punya
 * validation strict (mis. email harus valid email format atau absent).
 * Convert string-kosong → undefined supaya field optional benar-benar
 * tidak terkirim.
 */
export function sanitizeClientPayload(form: CreateClientInput): CreateClientInput {
  const trim = (v: string | undefined | null) =>
    v && v.trim() ? v.trim() : undefined;
  return {
    ...form,
    email: trim(form.email),
    medicalRecordNumber: trim(form.medicalRecordNumber),
    address: trim(form.address),
    notes: trim(form.notes),
  };
}
