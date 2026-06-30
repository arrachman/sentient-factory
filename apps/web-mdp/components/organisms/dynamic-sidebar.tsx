'use client';

// Role-filtered icon rail with submenu. Fetches /api/mdp/menus/nav (backend
// resolves the user's ERP roles → mdp_role_menus → visible menu tree). Falls
// back to the static module registry on error/empty so the shell is never blank.
//
// Honors the Setting → Tampilan appearance config applied to <html>:
//   data-sidebar='label'          → CSS shows the `.nav-label` text (icon + label)
//   data-sidebar-menu='accordion' → submenu expands inline below the module
//   data-sidebar-menu='flyout'    → submenu opens as a hover flyout

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { Layers, Square, ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react';
import { fetchNav, type NavNode } from '@/lib/api';
import { MDP_MODULES } from '@/lib/modules';
import { cn } from '@/lib/utils';

type SidebarMenuMode = 'flyout' | 'accordion';

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

interface SbItem {
  readonly key: string;
  readonly href: string;
  readonly title: string;
  readonly Icon: LucideIcon;
}
interface SbModule {
  readonly key: string;
  readonly href?: string;
  readonly title: string;
  readonly Icon: LucideIcon;
  readonly items: SbItem[];
}

/** Static fallback derived from the module registry (used until nav loads / on error). */
function fallbackModules(): SbModule[] {
  return MDP_MODULES.map((m) => ({
    key: m.id,
    href: m.route,
    title: m.name,
    Icon: m.icon,
    items: [],
  }));
}

/** Nav tree → sidebar modules (roots + their children as submenu items). */
function modulesFromNav(nodes: NavNode[]): SbModule[] {
  return nodes.map((n) => ({
    key: n.code,
    href: n.path ?? undefined,
    title: n.name,
    Icon: resolveIcon(n.icon),
    items: (n.children ?? [])
      .filter((c) => c.path)
      .map((c) => ({
        key: c.code,
        href: c.path as string,
        title: c.name,
        Icon: resolveIcon(c.icon),
      })),
  }));
}

/** Active when the current path is the route or a child of it. */
function isActive(pathname: string, href?: string): boolean {
  if (!href) return false;
  if (href === '/app') return pathname === '/app';
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Module is active when its route or any of its children match the path. */
function isModuleActive(pathname: string, m: SbModule): boolean {
  return isActive(pathname, m.href) || m.items.some((it) => isActive(pathname, it.href));
}

/** Reads the live `data-sidebar-menu` attribute on <html>, re-rendering on change. */
function useSidebarMenuMode(): SidebarMenuMode {
  const [mode, setMode] = useState<SidebarMenuMode>('accordion');
  useEffect(() => {
    const el = document.documentElement;
    const read = () =>
      setMode(el.getAttribute('data-sidebar-menu') === 'flyout' ? 'flyout' : 'accordion');
    read();
    const obs = new MutationObserver(read);
    obs.observe(el, { attributes: true, attributeFilter: ['data-sidebar-menu'] });
    return () => obs.disconnect();
  }, []);
  return mode;
}

export function DynamicSidebar({ initialNav }: { initialNav?: NavNode[] }) {
  const pathname = usePathname() ?? '';
  // Seed from the server-fetched nav so the first paint is already correct
  // (no static-fallback→fetch flicker on refresh). Fall back to the static
  // module registry only when the server provided nothing.
  const [modules, setModules] = useState<SbModule[]>(() =>
    initialNav?.length ? modulesFromNav(initialNav) : fallbackModules(),
  );
  const menuMode = useSidebarMenuMode();

  useEffect(() => {
    if (initialNav?.length) return; // server already resolved the nav
    let alive = true;
    fetchNav()
      .then((res) => {
        if (alive && res.data?.length) setModules(modulesFromNav(res.data));
      })
      .catch(() => {
        /* keep static fallback */
      });
    return () => {
      alive = false;
    };
  }, [initialNav]);

  // Accordion: which module is expanded. Defaults to the active module.
  const activeKey = modules.find((m) => isModuleActive(pathname, m))?.key ?? null;
  const [expandedKey, setExpandedKey] = useState<string | null>(activeKey);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync expanded module to active route
    if (menuMode === 'accordion' && activeKey) setExpandedKey(activeKey);
  }, [menuMode, activeKey]);

  // Flyout state (hover-driven).
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [openTop, setOpenTop] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enter = (e: React.MouseEvent<HTMLElement>, key: string) => {
    if (menuMode === 'accordion') return;
    if (timer.current) clearTimeout(timer.current);
    setOpenTop(e.currentTarget.getBoundingClientRect().top);
    setOpenKey(key);
  };
  const leave = () => {
    timer.current = setTimeout(() => setOpenKey(null), 120);
  };
  const keep = () => {
    if (timer.current) clearTimeout(timer.current);
  };
  const openModule = modules.find((m) => m.key === openKey);

  return (
    <>
      <aside className="sidebar" onMouseLeave={menuMode === 'flyout' ? leave : undefined}>
        <Link
          href="/app"
          title="Beranda"
          className={`nav-item${isActive(pathname, '/app') ? ' active' : ''}`}
        >
          <Layers size={16} strokeWidth={1.6} />
          <span className="nav-label">Beranda</span>
        </Link>

        {modules.map((m) => {
          const active = isModuleActive(pathname, m);
          const hasItems = m.items.length > 0;

          // Accordion mode: clickable header toggles inline submenu.
          if (menuMode === 'accordion' && hasItems) {
            const isExpanded = expandedKey === m.key;
            return (
              <div key={m.key} style={{ display: 'contents' }}>
                <button
                  type="button"
                  className={cn('nav-item', active && 'active')}
                  title={m.title}
                  data-tip={m.title}
                  onClick={() => setExpandedKey(isExpanded ? null : m.key)}
                >
                  <m.Icon size={16} strokeWidth={1.6} />
                  <span className="nav-label" style={{ flex: 1, textAlign: 'left' }}>
                    {m.title}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={12} strokeWidth={1.6} style={{ opacity: 0.5, flexShrink: 0 }} />
                  ) : (
                    <ChevronDown size={12} strokeWidth={1.6} style={{ opacity: 0.5, flexShrink: 0 }} />
                  )}
                </button>
                {isExpanded && (
                  <div className="accordion-submenu">
                    {m.items.map((it) => (
                      <Link
                        key={it.key}
                        href={it.href}
                        className={cn('accordion-item', isActive(pathname, it.href) && 'active')}
                      >
                        <it.Icon size={14} strokeWidth={1.6} />
                        <span>{it.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // Flyout mode with children: hover anchor opens the flyout panel.
          if (menuMode === 'flyout' && hasItems) {
            return (
              <Link
                key={m.key}
                href={m.href ?? m.items[0].href}
                title={m.title}
                data-tip={m.title}
                className={cn('nav-item', active && 'active')}
                onMouseEnter={(e) => enter(e, m.key)}
              >
                <m.Icon size={16} strokeWidth={1.6} />
                <span className="nav-label">{m.title}</span>
              </Link>
            );
          }

          // Leaf module (no children): plain link.
          return m.href ? (
            <Link
              key={m.key}
              href={m.href}
              title={m.title}
              data-tip={m.title}
              className={cn('nav-item', active && 'active')}
            >
              <m.Icon size={16} strokeWidth={1.6} />
              <span className="nav-label">{m.title}</span>
            </Link>
          ) : (
            <button key={m.key} type="button" title={m.title} className="nav-item" disabled>
              <m.Icon size={16} strokeWidth={1.6} />
              <span className="nav-label">{m.title}</span>
            </button>
          );
        })}
      </aside>

      {menuMode === 'flyout' && openModule && openModule.items.length > 0 && (
        <div
          className="flyout"
          style={{
            top: Math.max(8, openTop),
            maxHeight: `calc(100vh - ${Math.max(8, openTop)}px - 8px)`,
          }}
          onMouseEnter={keep}
          onMouseLeave={leave}
        >
          <div className="group-label">
            <span>{openModule.title}</span>
            <openModule.Icon size={12} />
          </div>
          {openModule.items.map((it) => (
            <Link
              key={it.key}
              href={it.href}
              className={cn('flyout-item', isActive(pathname, it.href) && 'active')}
              onClick={() => setOpenKey(null)}
            >
              <it.Icon size={14} strokeWidth={1.6} />
              <span>{it.title}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
