'use client';

/**
 * Tab "User aktif":
 *   - Pills filter role
 *   - Tabel user (avatar + role badge + last login + 2FA + status + aksi)
 */
import { MoreHorizontal, Pencil } from 'lucide-react';
import type { ClinicRoleName, ClinicUser } from '../model/types';
import { ROLE_INFO } from '../model/role-config';
import { formatLastLogin, formatLoginTimestamp, pickPrimaryRole } from '../model/format';
import { UserAvatar } from './user-avatar';

export function UsersTable({
  items,
  isLoading,
  totalCount,
  roleCounts,
  roleFilter,
  onChangeRoleFilter,
  onEdit,
  onDelete,
}: {
  items: ClinicUser[];
  isLoading: boolean;
  totalCount: number;
  roleCounts: Record<string, number>;
  roleFilter: 'all' | ClinicRoleName;
  onChangeRoleFilter: (next: 'all' | ClinicRoleName) => void;
  onEdit: (u: ClinicUser) => void;
  onDelete: (u: ClinicUser) => void;
}) {
  return (
    <>
      <RoleFilterPills
        active={roleFilter}
        totalCount={totalCount}
        roleCounts={roleCounts}
        onChange={onChangeRoleFilter}
      />
      <UserTableCard
        items={items}
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}

function RoleFilterPills({
  active,
  totalCount,
  roleCounts,
  onChange,
}: {
  active: 'all' | ClinicRoleName;
  totalCount: number;
  roleCounts: Record<string, number>;
  onChange: (next: 'all' | ClinicRoleName) => void;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      style={{ marginBottom: 12 }}
    >
      <button
        type="button"
        onClick={() => onChange('all')}
        className="btn btn-sm"
        style={{
          height: 28,
          padding: '0 12px',
          background:
            active === 'all' ? 'var(--sage-500)' : 'var(--bg-elev, #fff)',
          color: active === 'all' ? '#fff' : 'var(--fg)',
          border:
            '1px solid ' +
            (active === 'all' ? 'var(--sage-500)' : 'var(--border)'),
        }}
      >
        Semua role{' '}
        <span style={{ marginLeft: 4, opacity: 0.8 }}>{totalCount}</span>
      </button>
      {ROLE_INFO.map((r) => {
        const sel = active === r.key;
        return (
          <button
            key={r.key}
            type="button"
            onClick={() => onChange(r.key)}
            className="btn btn-sm"
            style={{
              height: 28,
              padding: '0 12px',
              background: sel ? r.color : 'var(--bg-elev, #fff)',
              color: sel ? '#fff' : 'var(--fg)',
              border: '1px solid ' + (sel ? r.color : 'var(--border)'),
            }}
          >
            {r.label}{' '}
            <span style={{ marginLeft: 4, opacity: 0.8 }}>
              {roleCounts[r.key] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}

const COL_TPL = '2fr 1.4fr 1.8fr 100px';

function UserTableCard({
  items,
  isLoading,
  onEdit,
  onDelete,
}: {
  items: ClinicUser[];
  isLoading: boolean;
  onEdit: (u: ClinicUser) => void;
  onDelete: (u: ClinicUser) => void;
}) {
  return (
    <div className="card-althea" style={{ overflow: 'hidden' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: COL_TPL,
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
        <span />
      </div>
      {isLoading ? (
        <div
          className="caption"
          style={{ padding: 32, textAlign: 'center' }}
        >
          Memuat user...
        </div>
      ) : items.length === 0 ? (
        <div
          className="caption"
          style={{ padding: 32, textAlign: 'center' }}
        >
          Tidak ada user untuk filter ini.
        </div>
      ) : (
        items.map((u, i) => (
          <UserRow
            key={u.id}
            u={u}
            isFirst={i === 0}
            onEdit={() => onEdit(u)}
            onDelete={() => onDelete(u)}
          />
        ))
      )}
    </div>
  );
}

function UserRow({
  u,
  isFirst,
  onEdit,
  onDelete,
}: {
  u: ClinicUser;
  isFirst: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const role = pickPrimaryRole(u);
  const color = role?.color ?? 'var(--sage-500)';
  const lastLabel = formatLastLogin(u.lastLogin);
  const isLive = lastLabel === 'Sekarang aktif';
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: COL_TPL,
        padding: '12px 18px',
        borderTop: isFirst ? 'none' : '1px solid var(--border)',
        alignItems: 'center',
      }}
    >
      <div className="flex items-center gap-2">
        <UserAvatar u={u} color={color} />
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
          {formatLoginTimestamp(u.lastLogin)}
        </span>
      </div>
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="btn btn-icon btn-ghost btn-sm"
          aria-label={`Edit ${u.fullName ?? u.email}`}
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="btn btn-icon btn-ghost btn-sm"
          aria-label={`Hapus ${u.fullName ?? u.email}`}
          title="Hapus"
        >
          <MoreHorizontal size={13} />
        </button>
      </div>
    </div>
  );
}
