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
  workspaceId?: string;
  sidebarMenuMode?: 'flyout' | 'accordion';
}

/** Builds a navigable href for a route id so browsers can offer right-click / Ctrl+click. */
function leafHref(id: string, workspaceId?: string): string {
  const base = workspaceId ? `/${workspaceId}` : '';
  return id.startsWith('/') ? `${base}${id}` : `${base}/${id}`;
}

/** Icon-only nav rail with a hover flyout submenu — ported from `sidebar.jsx`. */
export function Sidebar({ nav, current, onNavigate, t, workspaceId, sidebarMenuMode = 'flyout' }: SidebarProps) {
  const [open, setOpen] = React.useState<string | null>(null);
  const [openTop, setOpenTop] = React.useState(0);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Accordion state — tracks which module is expanded
  const currentTop = nav.find(
    (i) =>
      !i.divider &&
      (i.id === current ||
        (i.children &&
          (isNavGroupArray(i.children)
            ? i.children.some((g) => g.items.some((s) => s.id === current))
            : i.children.some((c) => c.id === current)))),
  );
  const [expandedId, setExpandedId] = React.useState<string | null>(
    () => currentTop?.id ?? null,
  );

  // When navigating to a different module, auto-expand that module in accordion mode
  React.useEffect(() => {
    if (sidebarMenuMode === 'accordion' && currentTop?.id) {
      setExpandedId(currentTop.id);
    }
  }, [currentTop?.id, sidebarMenuMode]);

  // Flyout handlers
  const handleEnter = (e: React.MouseEvent<HTMLElement>, item: NavItem) => {
    if (sidebarMenuMode === 'accordion' || !item.children) {
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

  const openItem = nav.find((i) => i.id === open);

  const renderLeaf = (sub: NavLeaf) => (
    <a
      key={sub.label}
      href={leafHref(sub.id, workspaceId)}
      className={cn('flyout-item', sub.id === current && 'active')}
      onClick={(e) => {
        if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
          e.preventDefault();
          onNavigate(sub.id);
          setOpen(null);
        }
      }}
    >
      <Icon name="dot" size={8} />
      <span>{t(sub.label)}</span>
    </a>
  );

  const renderAccordionLeaf = (sub: NavLeaf) => (
    <a
      key={sub.label}
      href={leafHref(sub.id, workspaceId)}
      className={cn('accordion-item', sub.id === current && 'active')}
      onClick={(e) => {
        if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
          e.preventDefault();
          onNavigate(sub.id);
        }
      }}
    >
      <Icon name="dot" size={8} />
      <span>{t(sub.label)}</span>
    </a>
  );

  const renderAccordionChildren = (item: NavItem) => {
    if (!item.children) return null;
    if (isNavGroupArray(item.children)) {
      return item.children.map((grp) => (
        <div key={grp.group} className="accordion-group">
          <div className="accordion-group-label">{t(grp.group)}</div>
          {grp.items.map(renderAccordionLeaf)}
        </div>
      ));
    }
    return item.children.map(renderAccordionLeaf);
  };

  return (
    <>
      <nav
        className="sidebar"
        onMouseLeave={sidebarMenuMode === 'flyout' ? handleLeaveAll : undefined}
        style={sidebarMenuMode === 'accordion' ? { overflowY: 'auto' } : undefined}
      >
        {nav.map((item, i) => {
          if (item.divider)
            // eslint-disable-next-line react/no-array-index-key
            return <div key={`div-${i}`} className="nav-divider" />;

          const isActive = !!currentTop && currentTop.id === item.id;

          // Leaf top-level items (no children) become real links.
          if (!item.children && item.id) {
            return (
              <a
                key={item.id}
                href={leafHref(item.id, workspaceId)}
                className={cn('nav-item', isActive && 'active')}
                data-tip={t(item.label ?? '')}
                onMouseEnter={(e) => handleEnter(e, item)}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate(item.id!);
                  }
                }}
              >
                {item.icon && <Icon name={item.icon} size={16} stroke={1.6} />}
                <span className="nav-label">{t(item.label ?? '')}</span>
              </a>
            );
          }

          // Accordion mode: click to expand/collapse inline
          if (sidebarMenuMode === 'accordion' && item.children) {
            const isExpanded = expandedId === item.id;
            return (
              <React.Fragment key={item.id}>
                <div
                  className={cn('nav-item', isActive && 'active')}
                  data-tip={t(item.label ?? '')}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setExpandedId(isExpanded ? null : (item.id ?? null))}
                >
                  {item.icon && <Icon name={item.icon} size={16} stroke={1.6} />}
                  <span className="nav-label" style={{ flex: 1 }}>{t(item.label ?? '')}</span>
                  <Icon name={isExpanded ? 'chevup' : 'chevdown'} size={12} stroke={1.6} style={{ opacity: 0.5, flexShrink: 0 }} />
                </div>
                {isExpanded && (
                  <div className="accordion-submenu">
                    {renderAccordionChildren(item)}
                  </div>
                )}
              </React.Fragment>
            );
          }

          // Flyout mode: items with children open a flyout on hover.
          return (
            <div
              key={item.id}
              className={cn('nav-item', isActive && 'active')}
              data-tip={t(item.label ?? '')}
              onMouseEnter={(e) => handleEnter(e, item)}
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
      {sidebarMenuMode === 'flyout' && openItem && openItem.children && (
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
