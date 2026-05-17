'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icons';
import { pageMeta } from '@/lib/nav';

export interface ShellTab {
  id: string;
  route: string;
}

interface TabBarProps {
  tabs: ShellTab[];
  activeId: string;
  onActivate: (id: string) => void;
  onClose: (id: string) => void;
  onDuplicate: (id: string) => void;
  onNew: () => void;
  t: (key: string) => string;
}

/** Browser-style tab strip — ported from `tabs.jsx`. */
export function TabBar({
  tabs,
  activeId,
  onActivate,
  onClose,
  onDuplicate,
  onNew,
  t,
}: TabBarProps) {
  const stripRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-tab="${activeId}"]`);
    if (el) el.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }, [activeId, tabs.length]);

  return (
    <div className="tabstrip" ref={stripRef}>
      {tabs.map((tab) => {
        const meta = pageMeta(tab.route, t);
        const active = tab.id === activeId;
        return (
          <div
            key={tab.id}
            data-tab={tab.id}
            className={cn('tab-chip', active && 'active')}
            title={meta.crumbs.map((c) => c.label).join(' / ')}
            onClick={() => onActivate(tab.id)}
            onAuxClick={(e) => {
              if (e.button === 1) {
                e.preventDefault();
                onClose(tab.id);
              }
            }}
          >
            <Icon name={meta.icon} size={13} className="tab-ico" />
            <span className="tab-label">{meta.title}</span>
            {meta.code && <span className="tab-code">{meta.code}</span>}
            <span
              className="tab-x"
              title={t('Tutup tab')}
              onClick={(e) => {
                e.stopPropagation();
                onClose(tab.id);
              }}
              onAuxClick={(e) => e.stopPropagation()}
            >
              <Icon name="x" size={10} />
            </span>
          </div>
        );
      })}
      <button
        className="tab-new"
        title={`${t('Tab baru')} (Dashboard)`}
        onClick={onNew}
      >
        <Icon name="plus" size={13} />
      </button>
      <div style={{ flex: 1 }} />
      {tabs.length > 0 && (
        <button
          className="tab-new"
          title={t('Duplikat tab')}
          onClick={() => onDuplicate(activeId)}
        >
          <Icon name="boxes" size={12} />
        </button>
      )}
      <span className="tab-count">{tabs.length} tab</span>
    </div>
  );
}
