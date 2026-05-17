'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icons';
import { Kbd } from '@/components/ui/kbd';
import type { Crumb } from '@/lib/nav';

export interface ShellUser {
  user: string;
  name: string;
  email: string;
  initials: string;
}

interface UserMenuProps {
  user: ShellUser;
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

function UserMenu({ user, onNavigate, onLogout }: UserMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const go = (route: string) => {
    setOpen(false);
    onNavigate(route);
  };

  return (
    <div
      className="user-chip"
      ref={ref}
      onClick={() => setOpen((o) => !o)}
      style={{ cursor: 'pointer' }}
    >
      <span className="avatar">{user.initials}</span>
      <span style={{ fontSize: 12 }}>{user.user}</span>
      <Icon name="chevdown" size={12} />
      {open && (
        <div className="user-menu fade-in" onClick={(e) => e.stopPropagation()}>
          <div className="user-menu-hd">
            <span className="avatar">{user.initials}</span>
            <div style={{ minWidth: 0 }}>
              <div className="nm">{user.name}</div>
              <div className="em">{user.email}</div>
            </div>
          </div>
          <button className="user-menu-item" onClick={() => go('set-prefs')}>
            <Icon name="user" size={13} /> Profil Saya
          </button>
          <button className="user-menu-item" onClick={() => go('set-prefs')}>
            <Icon name="gear" size={13} /> Preferensi{' '}
            <span className="mk">PR</span>
          </button>
          <button
            className="user-menu-item"
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(new CustomEvent('open-shortcuts'));
            }}
          >
            <Icon name="keyboard" size={13} /> Pintasan{' '}
            <span className="mk">?</span>
          </button>
          <div className="user-menu-sep" />
          <button
            className="user-menu-item danger"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <Icon name="arrowleft" size={13} /> Keluar
          </button>
        </div>
      )}
    </div>
  );
}

interface TopbarProps {
  crumbs: Crumb[];
  onOpenPalette: () => void;
  t: (key: string) => string;
  user: ShellUser;
  onNavigate: (route: string) => void;
  onLogout: () => void;
}

/** Brand + breadcrumb + command trigger + user chip — ported from `topbar.jsx`. */
export function Topbar({
  crumbs,
  onOpenPalette,
  t,
  user,
  onNavigate,
  onLogout,
}: TopbarProps) {
  const [notif, setNotif] = React.useState(3);

  React.useEffect(() => {
    const fn = (e: Event) =>
      setNotif((e as CustomEvent<number>).detail ?? 0);
    window.addEventListener('notif-count', fn);
    return () => window.removeEventListener('notif-count', fn);
  }, []);

  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo" />
        <span>Sentient</span>
        <span style={{ color: 'var(--fg-faint)', fontWeight: 400 }}>
          / ERP
        </span>
      </div>
      <div
        style={{
          width: 1,
          height: 18,
          background: 'var(--border)',
          margin: '0 8px',
        }}
      />
      <nav className="breadcrumb" aria-label="breadcrumb">
        {crumbs.map((c, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <button
              className={cn(
                'crumb crumb-btn',
                i === crumbs.length - 1 && 'active',
              )}
              onClick={c.onClick}
              disabled={!c.onClick}
            >
              {c.label}
            </button>
          </React.Fragment>
        ))}
      </nav>
      <div className="spacer" />
      <button
        className="cmd-trigger"
        onClick={onOpenPalette}
        title="Command palette"
      >
        <Icon name="search" size={13} />
        <span>{t('Cari semua...')}</span>
        <span className="kbd-row">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
      <button
        className={cn('iconbtn', notif > 0 && 'has-dot')}
        data-tip="Notifikasi"
      >
        <Icon name="bell" size={14} />
        {notif > 0 && (
          <span className="notif-badge">{notif > 9 ? '9+' : notif}</span>
        )}
      </button>
      <button className="iconbtn" data-tip="Aktivitas">
        <Icon name="activity" size={14} />
      </button>
      <button
        className="iconbtn"
        data-tip="Pintasan (?)"
        onClick={() =>
          window.dispatchEvent(new CustomEvent('open-shortcuts'))
        }
      >
        <Icon name="keyboard" size={14} />
      </button>
      <UserMenu user={user} onNavigate={onNavigate} onLogout={onLogout} />
    </header>
  );
}
