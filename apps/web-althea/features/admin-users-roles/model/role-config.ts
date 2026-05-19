/**
 * Konfigurasi role + permission matrix untuk halaman User & Role.
 *
 * - ROLE_INFO: role staf aktif sesuai paket (standard = 4, premium = 6).
 * - MODULES: 10 modul yang bisa diakses (axis horizontal di matriks).
 * - PERMS: Tiap cell ∈ {edit, view, '—'}.
 * - PERM_STYLE: warna chip per kategori permission.
 *
 * Catatan privasi: psikolog tidak boleh akses "Klien (semua)" — hanya
 * "Klien (sendiri)". Ini di-enforce di backend juga.
 */
import { PLAN_FEATURES } from '@/shared/config/clinic-plan';
import type { ClinicRoleName, CreateUserInput } from './types';

export type RoleInfo = {
  key: ClinicRoleName;
  label: string;
  color: string;
  access: string;
  desc: string;
};

const ALL_ROLE_INFO: RoleInfo[] = [
  {
    key: 'clinic-admin',
    label: 'Admin',
    color: '#5b8a66',
    access: 'Full Access',
    desc: 'Mengatur seluruh penjadwalan klien & ruangan',
  },
  {
    key: 'clinic-psikolog',
    label: 'Psikolog',
    color: '#7a8556',
    access: 'Terbatas (data sendiri)',
    desc: 'Input availability, lihat jadwal & klien sendiri saja',
  },
  {
    key: 'clinic-owner',
    label: 'Owner',
    color: '#1f3a3a',
    access: 'View Only',
    desc: 'Memantau sistem secara keseluruhan',
  },
  {
    key: 'clinic-resepsionis',
    label: 'Resepsionis',
    color: '#4a7090',
    access: 'View Only',
    desc: 'Lihat jadwal harian untuk penerimaan klien',
  },
  {
    key: 'clinic-marketing',
    label: 'Marketing',
    color: '#8a6a3a',
    access: 'View Terbatas',
    desc: 'Lihat data layanan & kapasitas',
  },
  {
    key: 'clinic-intern',
    label: 'Intern',
    color: '#9a8c7a',
    access: 'View Terbatas',
    desc: 'Akses minimal sesuai kebutuhan',
  },
];

export const ROLE_INFO: RoleInfo[] = ALL_ROLE_INFO.filter((r) => {
  if (r.key === 'clinic-marketing') return PLAN_FEATURES.marketingRole;
  if (r.key === 'clinic-intern') return PLAN_FEATURES.internRole;
  return true;
});

export const MODULES = [
  'Penjadwalan',
  'Klien (semua)',
  'Klien (sendiri)',
  'Ruangan',
  'Psikolog',
  'Layanan',
  'Notif WA',
  'Audit Log',
  'Pengaturan',
  'User & Role',
] as const;

export type Perm = 'edit' | 'view' | '—';

export const PERMS: Record<ClinicRoleName, Perm[]> = {
  'clinic-admin': ['edit', 'edit', '—', 'edit', 'edit', 'edit', 'edit', 'view', 'edit', 'edit'],
  'clinic-psikolog': ['view', '—', 'edit', 'view', 'view', 'view', '—', '—', '—', '—'],
  'clinic-owner': ['view', 'view', 'view', 'view', 'view', 'view', 'view', 'view', 'view', 'view'],
  'clinic-resepsionis': ['view', 'view', '—', 'view', 'view', '—', '—', '—', '—', '—'],
  'clinic-marketing': ['—', '—', '—', '—', '—', 'view', '—', '—', '—', '—'],
  'clinic-intern': ['view', '—', '—', 'view', '—', 'view', '—', '—', '—', '—'],
};

export const PERM_STYLE: Record<Perm, { bg: string; fg: string; label: string }> = {
  edit: { bg: 'var(--sage-100)', fg: 'var(--sage-700)', label: '✓ edit' },
  view: { bg: 'var(--info-soft, #e6f0f7)', fg: '#2c4a60', label: '👁 view' },
  '—': { bg: 'var(--cream-100)', fg: 'var(--fg-muted)', label: '—' },
};

export const EMPTY_FORM: CreateUserInput = {
  email: '',
  fullName: '',
  username: '',
  password: '',
  roles: [PLAN_FEATURES.internRole ? 'clinic-intern' : 'clinic-resepsionis'],
  isActive: true,
};

export type Tab = 'users' | 'roles' | 'matrix';
