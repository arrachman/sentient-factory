'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icons';
import {
  isNavGroupArray,
  type NavItem,
  type NavLeaf,
} from '@/lib/nav';

interface SidebarProps {
  nav: NavItem[];
  current: string;
  onNavigate: (id: string) => void;
  t: (key: string) => string;
}

/** Icon-only nav rail with a hover flyout submenu — ported from `sidebar.jsx`. */
export function Sidebar({ nav, current, onNavigate, t }: SidebarProps) {
  const [open, setOpen] = React.useState<string | null>(null);
  const [openTop, setOpenTop] = React.useState(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    item: NavItem,
  ) => {
    if (!item.children) {
      setOpen(null);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setOpenTop(rect.top);
    setOpen(item.id ?? null);
  };
  const handleLeaveAll = () => {
    timer.current = setTimeout(() => setOpen(null), 120);
  };
  const keepOpen = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  const currentTop = nav.find(
    (i) =>
      !i.divider &&
      (i.id === current ||
        (i.children &&
          (isNavGroupArray(i.children)
            ? i.children.some((g) => g.items.some((s) => s.id === current))
            : i.children.some((c) => c.id === current)))),
  );

  const openItem = nav.find((i) => i.id === open);

  const renderLeaf = (sub: NavLeaf) => (
    <div
      key={sub.label}
      className={cn('flyout-item', sub.id === current && 'active')}
      onClick={() => {
        if (sub.id) {
          onNavigate(sub.id);
          setOpen(null);
        }
      }}
    >
      <Icon name="dot" size={8} />
      <span>{t(sub.label)}</span>
    </div>
  );

  return (
    <>
      <nav className="sidebar" onMouseLeave={handleLeaveAll}>
        {nav.map((item, i) => {
          if (item.divider)
            // eslint-disable-next-line react/no-array-index-key
            return <div key={`div-${i}`} className="nav-divider" />;
          const isActive = !!currentTop && currentTop.id === item.id;
          return (
            <div
              key={item.id}
              className={cn('nav-item', isActive && 'active')}
              data-tip={t(item.label ?? '')}
              onMouseEnter={(e) => handleEnter(e, item)}
              onClick={() => {
                if (!item.children && item.id) onNavigate(item.id);
              }}
            >
              {item.icon && <Icon name={item.icon} size={16} stroke={1.6} />}
              <span className="nav-label">{t(item.label ?? '')}</span>
            </div>
          );
        })}
        <div style={{ flex: 1 }} />
        <div
          className="nav-item"
          data-tip={t('Pintasan')}
          onClick={() =>
            window.dispatchEvent(new CustomEvent('open-shortcuts'))
          }
        >
          <Icon name="keyboard" size={16} />
          <span className="nav-label">{t('Pintasan')}</span>
        </div>
      </nav>
      {openItem && openItem.children && (
        <div
          className="flyout fade-in"
          style={{
            top: Math.max(8, openTop),
            maxHeight: `calc(100vh - ${Math.max(8, openTop)}px - 8px)`,
          }}
          onMouseEnter={keepOpen}
          onMouseLeave={handleLeaveAll}
        >
          <div className="group-label">
            <span>{t(openItem.label ?? '')}</span>
            {openItem.icon && <Icon name={openItem.icon} size={12} />}
          </div>
          {isNavGroupArray(openItem.children)
            ? openItem.children.map((grp) => (
                <div key={grp.group}>
                  <div className="group-label">
                    <span>{t(grp.group)}</span>
                  </div>
                  {grp.items.map(renderLeaf)}
                </div>
              ))
            : openItem.children.map(renderLeaf)}
        </div>
      )}
    </>
  );
}
