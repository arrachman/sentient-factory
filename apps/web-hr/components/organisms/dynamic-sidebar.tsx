'use client';

// Icon-rail sidebar with hover flyout — ported from the web-erp shell to the HR
// chrome CSS (.sidebar / .nav-item / .flyout). Modules come from the role-
// filtered menu endpoint (useHrMyMenus); the static HR_NAV is the fallback so
// the rail is never blank while the request is in flight or on error.

import { useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Clock4, Users, BarChart3, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HR_NAV, resolveIcon, toAppPath } from '@/lib/nav';
import { useHrMyMenus } from '@/lib/api/hooks';
import type { HrMenuNode } from '@/lib/api/sys-menus';

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

export function DynamicSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useHrMyMenus();
  const modules = data && data.length > 0 ? modulesFromMenus(data) : modulesFromNav();

  const [openKey, setOpenKey] = useState<string | null>(null);
  const [openTop, setOpenTop] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = (e: React.MouseEvent<HTMLElement>, key: string) => {
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
      <nav className="sidebar" onMouseLeave={leave}>
        <a
          href={toAppPath('/dashboard')}
          className="nav-item"
          data-tip="Senti HR"
          onClick={(e) => go(e, toAppPath('/dashboard'))}
        >
          <Clock4 size={16} strokeWidth={1.6} />
        </a>
        <div className="nav-divider" />
        {modules.map((m) => {
          const active = m.items.some((it) => isItemActive(pathname, it.path));
          return (
            <div
              key={m.key}
              className={cn('nav-item', active && 'active')}
              data-tip={m.title}
              onMouseEnter={(e) => enter(e, m.key)}
            >
              <m.Icon size={16} strokeWidth={1.6} />
            </div>
          );
        })}
      </nav>

      {openModule && (
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
