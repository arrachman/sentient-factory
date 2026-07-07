import type { ReactNode } from 'react';
import Link from 'next/link';
import { DynamicSidebar } from '@/components/organisms/dynamic-sidebar';
import { ToastHost } from '@/components/molecules/toast-host';
import type { NavNode } from '@/lib/api';
import { Activity, Bell, Keyboard, Search, Settings } from 'lucide-react';

/**
 * App shell — role-filtered icon rail + topbar + content slot. The sidebar
 * (`DynamicSidebar`) consumes `/api/mdp/menus/nav` (mdp_menus SSOT filtered by
 * the user's ERP roles via mdp_role_menus), falling back to the static module
 * registry when nav is unavailable.
 */
export function AppShell({
  children,
  initialNav,
}: {
  children: ReactNode;
  initialNav?: NavNode[];
}) {
  return (
    <div className="app">
      <DynamicSidebar initialNav={initialNav} />

      <header className="topbar">
        <div className="brand">
          <div className="logo" />
          <span>Sentient</span>
          <span style={{ color: 'var(--fg-faint)', fontWeight: 400 }}>/ MDP</span>
        </div>
        <div style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 8px' }} />
        <nav className="breadcrumb" aria-label="breadcrumb">
          <span className="crumb active">Manufacturing Digitalization Platform</span>
          <span className="sep">/</span>
          <span className="crumb">ISA-95 Level 3</span>
        </nav>
        <div className="spacer" />
        <button className="cmd-trigger" type="button" title="Cari semua">
          <Search size={13} />
          <span>Cari semua...</span>
          <span className="kbd-row">
            <span className="kbd">⌘</span>
            <span className="kbd">K</span>
          </span>
        </button>
        <button className="iconbtn" type="button" title="Notifikasi">
          <Bell size={14} />
        </button>
        <button className="iconbtn" type="button" title="Aktivitas">
          <Activity size={14} />
        </button>
        <button className="iconbtn" type="button" title="Pintasan">
          <Keyboard size={14} />
        </button>
        <Link className="iconbtn" href="/app/settings/appearance" title="Tampilan">
          <Settings size={14} />
        </Link>
        <div className="user-chip">
          <span className="avatar">MD</span>
          <span style={{ fontSize: 'calc(12px * var(--font-scale, 1))' }}>MDP</span>
        </div>
      </header>

      <main className="main">{children}</main>
      <ToastHost />
    </div>
  );
}
