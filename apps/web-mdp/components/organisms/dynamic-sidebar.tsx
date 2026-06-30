'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { Layers, Square, type LucideIcon } from 'lucide-react';
import { fetchNav, type NavNode } from '@/lib/api';
import { MDP_MODULES } from '@/lib/modules';

/** Resolve a lucide icon name (from mdp_menus.icon) to a component, with fallback. */
function resolveIcon(name?: string | null): LucideIcon {
  if (name && name in Icons) {
    const candidate = (Icons as Record<string, unknown>)[name];
    if (typeof candidate === 'object' || typeof candidate === 'function') {
      return candidate as LucideIcon;
    }
  }
  return Square;
}

interface RailItem {
  readonly key: string;
  readonly href?: string;
  readonly title: string;
  readonly Icon: LucideIcon;
}

/** Static fallback derived from the module registry (used until nav loads / on error). */
function fallbackItems(): RailItem[] {
  return MDP_MODULES.map((m) => ({
    key: m.id,
    href: m.route,
    title: `${m.name} · ${m.system}`,
    Icon: m.icon,
  }));
}

/** Nav tree → top-level rail items (icon rail shows roots only). */
function navItems(nodes: NavNode[]): RailItem[] {
  return nodes.map((n) => ({
    key: n.code,
    href: n.path ?? undefined,
    title: n.name,
    Icon: resolveIcon(n.icon),
  }));
}

/**
 * Role-filtered icon rail. Fetches /api/mdp/menus/nav (backend resolves the
 * user's ERP roles → mdp_role_menus → visible menus). Falls back to the static
 * module registry on error or empty response so the shell is never blank.
 */
/** Active when the current path is the item's route or a child of it. */
function isActive(pathname: string, href?: string): boolean {
  if (!href) return false;
  if (href === '/app') return pathname === '/app';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DynamicSidebar({ initialNav }: { initialNav?: NavNode[] }) {
  const pathname = usePathname() ?? '';
  // Seed from the server-fetched nav so the first paint is already correct
  // (no static-fallback→fetch flicker on refresh). Fall back to the static
  // module registry only when the server provided nothing.
  const [items, setItems] = useState<RailItem[]>(() =>
    initialNav?.length ? navItems(initialNav) : fallbackItems(),
  );

  useEffect(() => {
    // Server already resolved the nav — no client refetch needed.
    if (initialNav?.length) return;
    let alive = true;
    fetchNav()
      .then((res) => {
        if (alive && res.data?.length) setItems(navItems(res.data));
      })
      .catch(() => {
        /* keep static fallback */
      });
    return () => {
      alive = false;
    };
  }, [initialNav]);

  return (
    <aside className="sidebar">
      <Link
        href="/app"
        title="Beranda"
        className={`nav-item${isActive(pathname, '/app') ? ' active' : ''}`}
      >
        <Layers size={16} strokeWidth={1.6} />
        <span className="nav-label">Beranda</span>
      </Link>
      {items.map((it) =>
        it.href ? (
          <Link
            key={it.key}
            href={it.href}
            title={it.title}
            className={`nav-item${isActive(pathname, it.href) ? ' active' : ''}`}
            data-tip={it.title}
          >
            <it.Icon size={16} strokeWidth={1.6} />
            <span className="nav-label">{it.title}</span>
          </Link>
        ) : (
          <button key={it.key} type="button" title={it.title} className="nav-item" disabled>
            <it.Icon size={16} strokeWidth={1.6} />
            <span className="nav-label">{it.title}</span>
          </button>
        )
      )}
    </aside>
  );
}
