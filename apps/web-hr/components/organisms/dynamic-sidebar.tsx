'use client';

// Icon-rail sidebar with hover flyout — ported from the web-erp shell to the HR
// chrome CSS (.sidebar / .nav-item / .flyout). Modules come from the role-
// filtered menu endpoint (useHrMyMenus); the static HR_NAV is the fallback so
// the rail is never blank while the request is in flight or on error.
//
// Honors the Setting → Tampilan appearance config applied to <html>:
//   data-sidebar='label'        → CSS shows the `.nav-label` text (icon + label)
//   data-sidebar-menu='accordion' → submenu expands inline below the module
//   data-sidebar-menu='flyout'    → submenu opens as a hover flyout (default)

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Clock4, Users, BarChart3, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HR_NAV, resolveIcon, toAppPath } from '@/lib/nav';
import { useHrMyMenus } from '@/lib/api/hooks';
import type { HrMenuNode } from '@/lib/api/sys-menus';

type SidebarMenuMode = 'flyout' | 'accordion';

interface SbItem {
  path: string; // full /app/... path
  title: string;
  Icon: LucideIcon;
}
interface SbModule {
  key: string;
  title: string;
  Icon: LucideIcon;
  items: SbItem[];
}

/** Module icons for the static fallback (mirror the hr_menus MODULE seed). */
const NAV_MODULE_ICON: Record<string, LucideIcon> = {
  attendance: Clock4,
  workforce: Users,
  insight: BarChart3,
};

function modulesFromMenus(menus: HrMenuNode[]): SbModule[] {
  return menus
    .filter((m) => m.type === 'MODULE')
    .map((m) => ({
      key: m.code,
      title: m.title,
      Icon: resolveIcon(m.icon),
      items: m.children
        .filter((c) => c.type === 'ITEM' && c.path)
        .map((c) => ({
          path: toAppPath(c.path as string),
          title: c.title,
          Icon: resolveIcon(c.icon),
        })),
    }))
    .filter((m) => m.items.length > 0);
}

function modulesFromNav(): SbModule[] {
  return HR_NAV.map((g) => ({
    key: g.key,
    title: g.title,
    Icon: NAV_MODULE_ICON[g.key] ?? Square,
    items: g.items.map((i) => ({ path: i.path, title: i.title, Icon: i.icon })),
  }));
}

function isItemActive(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}

/** Reads the live `data-sidebar-menu` attribute on <html>, re-rendering on change. */
function useSidebarMenuMode(): SidebarMenuMode {
  const [mode, setMode] = useState<SidebarMenuMode>('flyout');
  useEffect(() => {
    const el = document.documentElement;
    const read = () =>
      setMode(el.getAttribute('data-sidebar-menu') === 'accordion' ? 'accordion' : 'flyout');
    read();
    const obs = new MutationObserver(read);
    obs.observe(el, { attributes: true, attributeFilter: ['data-sidebar-menu'] });
    return () => obs.disconnect();
  }, []);
  return mode;
}

export function DynamicSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useHrMyMenus();
  const modules = data && data.length > 0 ? modulesFromMenus(data) : modulesFromNav();
  const menuMode = useSidebarMenuMode();

  // Flyout state (hover-driven)
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [openTop, setOpenTop] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Accordion state — which module is expanded. Defaults to the active module.
  const activeKey =
    modules.find((m) => m.items.some((it) => isItemActive(pathname, it.path)))?.key ?? null;
  const [expandedKey, setExpandedKey] = useState<string | null>(activeKey);

  // When navigating to a different module, auto-expand it in accordion mode.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync expanded module to the active route
    if (menuMode === 'accordion' && activeKey) setExpandedKey(activeKey);
  }, [menuMode, activeKey]);

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

  const go = (e: React.MouseEvent, path: string) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setOpenKey(null);
    if (path !== pathname) router.push(path);
  };

  const openModule = modules.find((m) => m.key === openKey);

  return (
    <>
      <nav className="sidebar" onMouseLeave={menuMode === 'flyout' ? leave : undefined}>
        <a
          href={toAppPath('/dashboard')}
          className="nav-item"
          data-tip="Senti HR"
          onClick={(e) => go(e, toAppPath('/dashboard'))}
        >
          <Clock4 size={16} strokeWidth={1.6} />
          <span className="nav-label">Senti HR</span>
        </a>
        <div className="nav-divider" />
        {modules.map((m) => {
          const active = m.items.some((it) => isItemActive(pathname, it.path));

          if (menuMode === 'accordion') {
            const isExpanded = expandedKey === m.key;
            return (
              <div key={m.key} style={{ display: 'contents' }}>
                <div
                  className={cn('nav-item', active && 'active')}
                  data-tip={m.title}
                  onClick={() => setExpandedKey(isExpanded ? null : m.key)}
                >
                  <m.Icon size={16} strokeWidth={1.6} />
                  <span className="nav-label" style={{ flex: 1 }}>
                    {m.title}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={12} strokeWidth={1.6} style={{ opacity: 0.5, flexShrink: 0 }} />
                  ) : (
                    <ChevronDown size={12} strokeWidth={1.6} style={{ opacity: 0.5, flexShrink: 0 }} />
                  )}
                </div>
                {isExpanded && (
                  <div className="accordion-submenu">
                    {m.items.map((it) => (
                      <a
                        key={it.path}
                        href={it.path}
                        className={cn('accordion-item', isItemActive(pathname, it.path) && 'active')}
                        onClick={(e) => go(e, it.path)}
                      >
                        <it.Icon size={14} strokeWidth={1.6} />
                        <span>{it.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={m.key}
              className={cn('nav-item', active && 'active')}
              data-tip={m.title}
              onMouseEnter={(e) => enter(e, m.key)}
            >
              <m.Icon size={16} strokeWidth={1.6} />
              <span className="nav-label">{m.title}</span>
            </div>
          );
        })}
      </nav>

      {menuMode === 'flyout' && openModule && (
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
            <a
              key={it.path}
              href={it.path}
              className={cn('flyout-item', isItemActive(pathname, it.path) && 'active')}
              onClick={(e) => go(e, it.path)}
            >
              <it.Icon size={14} strokeWidth={1.6} />
              <span>{it.title}</span>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
