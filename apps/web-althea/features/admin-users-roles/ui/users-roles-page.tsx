'use client';

import { Fragment, useMemo, useState } from 'react';
import { Bell, Download, MoreHorizontal, Pencil, Plus } from 'lucide-react';
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUserList,
} from '../hooks/use-users';
import {
  CLINIC_ROLES,
  ROLE_LABEL,
  type ClinicRoleName,
  type ClinicUser,
  type CreateUserInput,
} from '../model/types';

// ============================================================================
// Role config (color, access level, description) — mirror mockup AdminUsersRoles
// ============================================================================

type RoleInfo = {
  key: ClinicRoleName;
  label: string;
  color: string;
  access: string;
  desc: string;
};

const ROLE_INFO: RoleInfo[] = [
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
    desc: 'Input availability, lihat jadwal & klien sendiri saja (BR-04)',
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

const MODULES = [
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

type Perm = 'edit' | 'view' | '—';

const PERMS: Record<ClinicRoleName, Perm[]> = {
  'clinic-admin': ['edit', 'edit', '—', 'edit', 'edit', 'edit', 'edit', 'view', 'edit', 'edit'],
  'clinic-psikolog': ['view', '—', 'edit', 'view', 'view', 'view', '—', '—', '—', '—'],
  'clinic-owner': ['view', 'view', 'view', 'view', 'view', 'view', 'view', 'view', 'view', 'view'],
  'clinic-resepsionis': ['view', 'view', '—', 'view', 'view', '—', '—', '—', '—', '—'],
  'clinic-marketing': ['—', '—', '—', '—', '—', 'view', '—', '—', '—', '—'],
  'clinic-intern': ['view', '—', '—', 'view', '—', 'view', '—', '—', '—', '—'],
};

const PERM_STYLE: Record<Perm, { bg: string; fg: string; label: string }> = {
  edit: { bg: 'var(--sage-100)', fg: 'var(--sage-700)', label: '✓ edit' },
  view: { bg: 'var(--info-soft, #e6f0f7)', fg: '#2c4a60', label: '👁 view' },
  '—': { bg: 'var(--cream-100)', fg: 'var(--fg-muted)', label: '—' },
};

// ============================================================================
// Helpers
// ============================================================================

function pickPrimaryRole(u: ClinicUser): RoleInfo | null {
  for (const r of u.roles) {
    const info = ROLE_INFO.find((x) => x.key === (r.name as ClinicRoleName));
    if (info) return info;
  }
  return null;
}

function formatLastLogin(iso: string | null): string {
  if (!iso) return 'Belum pernah';
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 5) return 'Sekarang aktif';
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const day = Math.floor(hr / 24);
  if (day === 1) return 'Kemarin · ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  if (day < 7) return `${day} hari lalu`;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function userInitial(u: ClinicUser): string {
  return (u.fullName || u.username || u.email).slice(0, 2).toUpperCase();
}

// ============================================================================
// Sub-components
// ============================================================================

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div className="card-althea-flat" style={{ padding: 14 }}>
      <div className="caption" style={{ marginBottom: 6 }}>
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26,
            fontWeight: 500,
            color: 'var(--teal-800)',
          }}
        >
          {value}
        </span>
        <span className="caption">{sub}</span>
      </div>
    </div>
  );
}

function Avatar({ u, color, size = 36 }: { u: ClinicUser; color: string; size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: color,
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        fontSize: size <= 32 ? 11 : 13,
        fontWeight: 700,
        flexShrink: 0,
      }}
      aria-hidden
    >
      {userInitial(u)}
    </span>
  );
}

// ============================================================================
// Main
// ============================================================================

const EMPTY_FORM: CreateUserInput = {
  email: '',
  fullName: '',
  username: '',
  password: '',
  roles: ['clinic-intern'],
  isActive: true,
};

type Tab = 'users' | 'roles' | 'matrix';

export function UsersRolesPage() {
  const [tab, setTab] = useState<Tab>('users');
  const [roleFilter, setRoleFilter] = useState<'all' | ClinicRoleName>('all');
  const [editing, setEditing] = useState<ClinicUser | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CreateUserInput>(EMPTY_FORM);

  const list = useUserList({
    role: roleFilter === 'all' ? undefined : roleFilter,
    limit: 200,
  });
  const createMut = useCreateUser();
  const updateMut = useUpdateUser();
  const deleteMut = useDeleteUser();

  const items = list.data?.data ?? [];

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((u) => u.isActive).length;
    const inactive = total - active;
    const sedangLogin = items.filter((u) => formatLastLogin(u.lastLogin) === 'Sekarang aktif').length;
    return {
      total,
      active,
      inactive,
      sedangLogin,
    };
  }, [items]);

  const roleCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const u of items) {
      for (const r of u.roles) map[r.name] = (map[r.name] ?? 0) + 1;
    }
    return map;
  }, [items]);

  function close() {
    setOpen(false);
    setEditing(null);
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(u: ClinicUser) {
    setEditing(u);
    setForm({
      email: u.email,
      fullName: u.fullName ?? '',
      username: u.username,
      password: '',
      roles: u.roles.map((r) => r.name),
      isActive: u.isActive,
    });
    setOpen(true);
  }

  function toggleRole(roleName: string) {
    if (form.roles.includes(roleName)) {
      setForm({ ...form, roles: form.roles.filter((r) => r !== roleName) });
    } else {
      setForm({ ...form, roles: [...form.roles, roleName] });
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.roles.length === 0) {
      alert('Pilih minimal 1 role');
      return;
    }
    if (editing) {
      const { email: _e, username: _u, password, ...rest } = form;
      const input = password && password.length > 0 ? { ...rest, password } : rest;
      updateMut.mutate({ id: editing.id, input }, { onSuccess: close });
    } else {
      createMut.mutate(form, { onSuccess: close });
    }
  }

  function handleDelete(u: ClinicUser) {
    if (!confirm(`Hapus user "${u.fullName || u.email}"?`)) return;
    deleteMut.mutate(u.id);
    close();
  }

  const submitting = createMut.isPending || updateMut.isPending;

  const TABS: Array<{ key: Tab; label: string; count: string | number }> = [
    { key: 'users', label: 'User aktif', count: stats.total },
    { key: 'roles', label: 'Role & hak akses', count: ROLE_INFO.length },
    { key: 'matrix', label: 'Matriks permission', count: '—' },
  ];

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 100px)' }}>
      {/* Toolbar */}
      <div
        style={{
          padding: '18px 28px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div
          className="flex items-center"
          style={{
            background: 'var(--cream-100)',
            borderRadius: 8,
            padding: 3,
            gap: 2,
          }}
        >
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className="btn btn-sm"
                style={{
                  height: 30,
                  padding: '0 14px',
                  background: active ? 'var(--bg-elev, #fff)' : 'transparent',
                  boxShadow: active ? 'var(--shadow-xs, 0 1px 2px rgba(0,0,0,0.05))' : 'none',
                  color: active ? 'var(--teal-800)' : 'var(--fg-muted)',
                  fontWeight: active ? 600 : 500,
                }}
              >
                {t.label}
                {t.count !== '—' && (
                  <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>{t.count}</span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-outline btn-sm">
            <Download size={14} /> Ekspor
          </button>
          <button type="button" onClick={openCreate} className="btn btn-primary btn-sm">
            <Plus size={15} style={{ stroke: '#fff' }} /> Undang user baru
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          padding: '0 28px 16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
        }}
      >
        <StatCard
          label="Total user"
          value={stats.total}
          sub={`${stats.active} aktif · ${stats.inactive} nonaktif`}
        />
        <StatCard
          label="Sedang login"
          value={stats.sedangLogin}
          sub="sesi aktif sekarang"
        />
        <StatCard
          label="2FA aktif"
          value="—"
          sub="wajib untuk admin & psikolog"
        />
        <StatCard
          label="Role"
          value={ROLE_INFO.length}
          sub="6 level akses berbeda"
        />
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, minHeight: 0, padding: '0 28px 28px', overflow: 'auto' }}>
        {tab === 'users' && (
          <>
            {/* Role filter pills */}
            <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: 12 }}>
              <button
                type="button"
                onClick={() => setRoleFilter('all')}
                className="btn btn-sm"
                style={{
                  height: 28,
                  padding: '0 12px',
                  background: roleFilter === 'all' ? 'var(--sage-500)' : 'var(--bg-elev, #fff)',
                  color: roleFilter === 'all' ? '#fff' : 'var(--fg)',
                  border: '1px solid ' + (roleFilter === 'all' ? 'var(--sage-500)' : 'var(--border)'),
                }}
              >
                Semua role <span style={{ marginLeft: 4, opacity: 0.8 }}>{stats.total}</span>
              </button>
              {ROLE_INFO.map((r) => {
                const sel = roleFilter === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRoleFilter(r.key)}
                    className="btn btn-sm"
                    style={{
                      height: 28,
                      padding: '0 12px',
                      background: sel ? r.color : 'var(--bg-elev, #fff)',
                      color: sel ? '#fff' : 'var(--fg)',
                      border: '1px solid ' + (sel ? r.color : 'var(--border)'),
                    }}
                  >
                    {r.label} <span style={{ marginLeft: 4, opacity: 0.8 }}>{roleCounts[r.key] ?? 0}</span>
                  </button>
                );
              })}
            </div>

            {/* Users table */}
            <div className="card-althea" style={{ overflow: 'hidden' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.4fr 1.5fr 1fr 1.4fr 100px',
                  padding: '10px 18px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--cream-50)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--fg-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                <span>User</span>
                <span>Role</span>
                <span>Aktivitas terakhir</span>
                <span>2FA</span>
                <span>Status</span>
                <span />
              </div>
              {list.isLoading ? (
                <div className="caption" style={{ padding: 32, textAlign: 'center' }}>
                  Memuat user...
                </div>
              ) : items.length === 0 ? (
                <div className="caption" style={{ padding: 32, textAlign: 'center' }}>
                  Tidak ada user untuk filter ini.
                </div>
              ) : (
                items.map((u, i) => {
                  const role = pickPrimaryRole(u);
                  const color = role?.color ?? 'var(--sage-500)';
                  const lastLabel = formatLastLogin(u.lastLogin);
                  const isLive = lastLabel === 'Sekarang aktif';
                  return (
                    <div
                      key={u.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1.4fr 1.5fr 1fr 1.4fr 100px',
                        padding: '12px 18px',
                        borderTop: i ? '1px solid var(--border)' : 'none',
                        alignItems: 'center',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar u={u} color={color} />
                        <div className="flex flex-col" style={{ minWidth: 0 }}>
                          <span
                            style={{
                              fontSize: 13.5,
                              fontWeight: 600,
                              color: 'var(--teal-800)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {u.fullName || u.username}
                          </span>
                          <span className="caption" style={{ fontSize: 11 }}>
                            {u.email}
                          </span>
                        </div>
                      </div>
                      <span
                        className="badge"
                        style={{
                          background: color + '22',
                          color,
                          height: 20,
                          fontSize: 11,
                          width: 'fit-content',
                        }}
                      >
                        {role?.label ?? '—'}
                      </span>
                      <div className="flex flex-col">
                        <span
                          style={{
                            fontSize: 12.5,
                            color: isLive ? 'var(--sage-700)' : 'var(--fg)',
                            fontWeight: isLive ? 600 : 400,
                          }}
                        >
                          {lastLabel}
                        </span>
                        <span className="caption" style={{ fontSize: 10.5 }}>
                          —
                        </span>
                      </div>
                      <span
                        className="badge badge-neutral"
                        style={{ height: 18, fontSize: 10, width: 'fit-content' }}
                        title="2FA backend belum tersedia"
                      >
                        — belum
                      </span>
                      <span
                        className={'badge ' + (u.isActive ? 'badge-sage' : 'badge-neutral')}
                        style={{ height: 20, textTransform: 'capitalize', width: 'fit-content' }}
                      >
                        {u.isActive ? 'aktif' : 'nonaktif'}
                      </span>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          className="btn btn-icon btn-ghost btn-sm"
                          aria-label={`Edit ${u.fullName ?? u.email}`}
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(u)}
                          className="btn btn-icon btn-ghost btn-sm"
                          aria-label={`Hapus ${u.fullName ?? u.email}`}
                          title="Hapus"
                        >
                          <MoreHorizontal size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {tab === 'roles' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 14,
            }}
          >
            {ROLE_INFO.map((r) => {
              const moduleBadges = MODULES.map((m, mi) => ({ m, p: PERMS[r.key][mi] }))
                .filter((x) => x.p !== '—');
              return (
                <div
                  key={r.key}
                  className="card-althea"
                  style={{ padding: 18, borderLeft: `4px solid ${r.color}` }}
                >
                  <div className="flex items-start justify-between" style={{ marginBottom: 10 }}>
                    <div className="flex flex-col">
                      <span
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: 'var(--teal-800)',
                          fontFamily: 'var(--font-serif)',
                        }}
                      >
                        {r.label}
                      </span>
                      <span className="caption" style={{ marginTop: 2 }}>
                        {roleCounts[r.key] ?? 0} user · akses:{' '}
                        <strong style={{ color: r.color }}>{r.access}</strong>
                      </span>
                    </div>
                  </div>
                  <p
                    style={{
                      margin: '6px 0 12px',
                      color: 'var(--fg)',
                      lineHeight: 1.5,
                      fontSize: 13,
                    }}
                  >
                    {r.desc}
                  </p>
                  <div className="flex flex-col gap-1">
                    <span className="eyebrow" style={{ marginBottom: 4 }}>
                      Modul yang dapat diakses
                    </span>
                    <div className="flex flex-wrap" style={{ gap: 4 }}>
                      {moduleBadges.length === 0 && (
                        <span className="caption">Tidak ada akses modul.</span>
                      )}
                      {moduleBadges.map(({ m, p }) => {
                        const ps = PERM_STYLE[p];
                        return (
                          <span
                            key={m}
                            className="badge"
                            style={{
                              background: ps.bg,
                              color: ps.fg,
                              height: 20,
                              fontSize: 10.5,
                            }}
                          >
                            {m} · {p}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'matrix' && (
          <div className="card-althea" style={{ overflow: 'hidden' }}>
            <div
              className="flex items-center justify-between"
              style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)' }}
            >
              <h2 className="h2" style={{ margin: 0 }}>
                Matriks permission · role × modul
              </h2>
              <span className="caption">edit / view / — (tidak akses)</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `160px repeat(${ROLE_INFO.length}, minmax(110px, 1fr))`,
                  minWidth: 'fit-content',
                }}
              >
                <div
                  style={{
                    padding: '12px 14px',
                    background: 'var(--cream-50)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span className="eyebrow">Modul</span>
                </div>
                {ROLE_INFO.map((r) => (
                  <div
                    key={r.key}
                    style={{
                      padding: '12px 10px',
                      background: 'var(--cream-50)',
                      borderBottom: '1px solid var(--border)',
                      borderLeft: '1px solid var(--border)',
                      textAlign: 'center',
                    }}
                  >
                    <div className="flex flex-col items-center" style={{ gap: 4 }}>
                      <span
                        style={{ width: 8, height: 8, borderRadius: 999, background: r.color }}
                      />
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: 'var(--teal-800)',
                        }}
                      >
                        {r.label}
                      </span>
                    </div>
                  </div>
                ))}
                {MODULES.map((m, mi) => (
                  <Fragment key={m}>
                    <div
                      style={{
                        padding: '12px 14px',
                        borderBottom: mi === MODULES.length - 1 ? 'none' : '1px solid var(--border)',
                        background: mi % 2 ? 'transparent' : 'var(--cream-50)',
                      }}
                    >
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg)' }}>{m}</span>
                    </div>
                    {ROLE_INFO.map((r) => {
                      const p = PERMS[r.key][mi];
                      const ps = PERM_STYLE[p];
                      return (
                        <div
                          key={r.key + m}
                          style={{
                            padding: '12px 10px',
                            borderBottom:
                              mi === MODULES.length - 1 ? 'none' : '1px solid var(--border)',
                            borderLeft: '1px solid var(--border)',
                            background: mi % 2 ? 'transparent' : 'var(--cream-50)',
                            textAlign: 'center',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: 999,
                              background: ps.bg,
                              color: ps.fg,
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            {ps.label}
                          </span>
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
            <div
              className="flex items-start gap-2"
              style={{
                padding: 12,
                background: 'var(--info-soft, #e6f0f7)',
                borderTop: '1px solid var(--border)',
              }}
            >
              <Bell size={14} style={{ color: 'var(--info, #4a90c0)', flexShrink: 0, marginTop: 2 }} />
              <span className="caption" style={{ color: '#2c4a60', fontSize: 11.5 }}>
                <strong>BR-04:</strong> Psikolog hanya dapat edit data klien sendiri (&ldquo;Klien
                sendiri&rdquo;), tidak dapat melihat data klien psikolog lain (&ldquo;Klien
                (semua)&rdquo; = —).
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Form dialog */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="card-althea w-full max-w-xl bg-card max-h-[90vh] overflow-y-auto">
            <div className="border-b border-border px-6 py-4">
              <h2 className="h2 m-0">{editing ? 'Edit User' : 'Undang user baru'}</h2>
            </div>
            <form onSubmit={submit} className="space-y-3 px-6 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption mb-1 block">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={!!editing}
                    required
                    className="input-althea"
                  />
                </div>
                <div>
                  <label className="caption mb-1 block">Nama Lengkap *</label>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    required
                    className="input-althea"
                  />
                </div>
              </div>
              {!editing && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="caption mb-1 block">Username</label>
                    <input
                      value={form.username ?? ''}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="auto dari email"
                      className="input-althea"
                    />
                  </div>
                  <div>
                    <label className="caption mb-1 block">Password</label>
                    <input
                      type="password"
                      value={form.password ?? ''}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="default Test1234!"
                      className="input-althea"
                    />
                  </div>
                </div>
              )}
              {editing && (
                <div>
                  <label className="caption mb-1 block">
                    Reset Password (kosong = tidak diubah)
                  </label>
                  <input
                    type="password"
                    value={form.password ?? ''}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-althea"
                  />
                </div>
              )}
              <div>
                <label className="caption mb-1 block">Roles * (minimal 1)</label>
                <div className="flex flex-wrap gap-2">
                  {CLINIC_ROLES.map((r) => {
                    const active = form.roles.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => toggleRole(r)}
                        className={`badge cursor-pointer transition ${
                          active ? 'badge-sage' : 'badge-neutral'
                        }`}
                      >
                        {ROLE_LABEL[r]}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive ?? true}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                Aktif
              </label>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <button type="button" onClick={close} className="btn btn-outline">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
