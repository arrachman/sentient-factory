'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { Layers, Square, type LucideIcon } from 'lucide-react';
import { fetchNav, type NavNode } from '@/lib/api';
import { MDP_MODULES } from '@/lib/modules';

const ICON_CLS =
  'flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground';

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
export function DynamicSidebar() {
  const [items, setItems] = useState<RailItem[]>(fallbackItems);

  useEffect(() => {
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
  }, []);

  return (
    <aside className="flex w-[52px] shrink-0 flex-col items-center gap-1 border-r border-border bg-card py-2">
      <Link
        href="/app"
        title="Beranda"
        className="mb-2 flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"
      >
        <Layers className="size-5" />
      </Link>
      {items.map((it) =>
        it.href ? (
          <Link key={it.key} href={it.href} title={it.title} className={ICON_CLS}>
            <it.Icon className="size-4.5" />
          </Link>
        ) : (
          <button key={it.key} type="button" title={it.title} className={ICON_CLS} disabled>
            <it.Icon className="size-4.5" />
          </button>
        )
      )}
    </aside>
  );
}
