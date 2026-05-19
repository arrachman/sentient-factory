'use client';

import Link from 'next/link';
import {
  CalendarClock,
  ChevronRight,
  FileText,
  Bell,
  Settings,
  LifeBuoy,
  LogOut,
  Pencil,
} from 'lucide-react';
import { performLogout } from '@/components/layouts/admin-shell/lib';
import type { Psikolog } from '@/features/admin-psikolog/model/types';
import type { ProfileStats } from '../api/profile.api';

/**
 * Tampilan mobile "Profil saya" psikolog — mirror prototype 05:
 * avatar besar + nama + title + tags, statistik 30 hari, menu list, keluar.
 * Desktop pakai grid 1fr 2fr; `lg:hidden`.
 */
function initials(p: Psikolog): string {
  const n = (p.fullName || p.email || 'P').trim().split(/\s+/);
  if (n.length === 1) return n[0].slice(0, 2).toUpperCase();
  return (n[0][0] + n[n.length - 1][0]).toUpperCase();
}

export function ProfileMobile({
  p,
  stats,
  statsLoading,
  onEdit,
}: {
  p: Psikolog;
  stats: ProfileStats | undefined;
  statsLoading: boolean;
  onEdit: () => void;
}) {
  const statItems: Array<{ value: string | number; label: string }> = [
    { value: statsLoading ? '—' : (stats?.sesi30Hari ?? 0), label: 'Sesi' },
    { value: statsLoading ? '—' : (stats?.klienAktif ?? 0), label: 'Klien' },
    {
      value: statsLoading
        ? '—'
        : stats?.kehadiran != null
          ? `${stats.kehadiran}%`
          : '—',
      label: 'Hadir',
    },
    {
      value: statsLoading ? '—' : (stats?.ratingKlien ?? '—'),
      label: 'Rating',
    },
  ];

  return (
    <div className="lg:hidden">
      <div className="space-y-4 p-4">
        {/* Profile card */}
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-2xl font-semibold text-white"
            style={{ background: p.color ?? 'var(--sage-300, #b9d0bd)' }}
          >
            {p.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.avatarUrl}
                alt={p.fullName ?? 'Foto profil'}
                className="h-full w-full object-cover"
              />
            ) : (
              initials(p)
            )}
          </div>
          <h1 className="brand-mark mt-3 text-xl text-teal-800">
            {p.fullName ?? p.email}
          </h1>
          {p.title && (
            <p className="caption text-[12px]">{p.title}</p>
          )}
          {p.specialty?.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {p.specialty.map((s) => (
                <span
                  key={s}
                  className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                  style={{
                    background: 'var(--sage-100, #dde9d8)',
                    color: 'var(--sage-700, #3a5b3f)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div>
          <p className="caption mb-2 text-[11px] font-semibold uppercase tracking-wide">
            Statistik · 30 hari
          </p>
          <div className="grid grid-cols-4 gap-2">
            {statItems.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-card px-1 py-3 text-center"
              >
                <div className="brand-mark text-lg text-teal-800">
                  {s.value}
                </div>
                <div className="caption text-[10px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <MenuRow
            icon={<CalendarClock className="h-5 w-5" />}
            label="Atur availability"
            sub="pola mingguan kamu"
            href="/psikolog/schedule"
          />
          <MenuRow
            icon={<Pencil className="h-5 w-5" />}
            label="Edit profil"
            sub="foto, title, bio, spesialisasi"
            onClick={onEdit}
          />
          <MenuRow
            icon={<FileText className="h-5 w-5" />}
            label="SIPP & sertifikat"
          />
          <MenuRow
            icon={<Bell className="h-5 w-5" />}
            label="Notifikasi & jam tenang"
          />
          <MenuRow
            icon={<Settings className="h-5 w-5" />}
            label="Pengaturan akun"
          />
          <MenuRow
            icon={<LifeBuoy className="h-5 w-5" />}
            label="Bantuan & dukungan"
            last
          />
        </div>

        <button
          type="button"
          onClick={() => performLogout()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold"
          style={{ color: 'var(--danger, #b54141)' }}
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </div>
  );
}

function MenuRow({
  icon,
  label,
  sub,
  href,
  onClick,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  href?: string;
  onClick?: () => void;
  last?: boolean;
}) {
  const inner = (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${
        last ? '' : 'border-b border-border'
      }`}
    >
      <span className="text-sage-600">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-teal-800">{label}</p>
        {sub && <p className="caption text-[11px]">{sub}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className="block w-full text-left">
      {inner}
    </button>
  );
}
