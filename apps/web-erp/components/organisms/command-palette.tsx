'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/icons';
import { Kbd } from '@/components/ui/kbd';
import type { NavGroup, NavItem, NavLeaf } from '@/lib/nav';

interface PaletteItem {
  id: string;
  icon: IconName;
  label: string;
  hint?: string;
}

interface PaletteGroup {
  group: string;
  items: PaletteItem[];
}

function isNavGroupArray(
  children: NavLeaf[] | NavGroup[] | undefined,
): children is NavGroup[] {
  return Array.isArray(children) && children.length > 0 && 'group' in children[0];
}

/**
 * Build palette groups from the role-filtered nav tree (sys_menus → my-menus).
 * Falls back to a minimal "Navigasi" group if nav is empty.
 */
function buildGroupsFromNav(nav: NavItem[]): PaletteGroup[] {
  const groups: PaletteGroup[] = [];
  const topLeaves: PaletteItem[] = [];

  for (const node of nav) {
    if (node.divider) continue;
    const moduleIcon: IconName = node.icon ?? 'file';

    if (!node.children || node.children.length === 0) {
      if (node.id && node.label) {
        topLeaves.push({ id: node.id, icon: moduleIcon, label: node.label });
      }
      continue;
    }

    if (isNavGroupArray(node.children)) {
      for (const sub of node.children) {
        groups.push({
          group: node.label ? `${node.label} · ${sub.group}` : sub.group,
          items: sub.items.map((leaf) => ({
            id: leaf.id,
            icon: moduleIcon,
            label: leaf.label,
            hint: leaf.code,
          })),
        });
      }
    } else {
      groups.push({
        group: node.label ?? '',
        items: node.children.map((leaf) => ({
          id: leaf.id,
          icon: moduleIcon,
          label: leaf.label,
          hint: leaf.code,
        })),
      });
    }
  }

  if (topLeaves.length > 0) {
    groups.unshift({ group: 'Navigasi', items: topLeaves });
  }
  return groups;
}

function actionGroup(t: (k: string) => string): PaletteGroup {
  return {
    group: t('Aksi'),
    items: [
      { id: 'toggle:theme', icon: 'moon', label: 'Toggle dark mode', hint: 'T' },
      { id: 'toggle:lang', icon: 'info', label: 'Switch language (ID/EN)' },
    ],
  };
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onAction: (id: string) => void;
  t: (key: string) => string;
  nav: NavItem[];
}

export function CommandPalette({
  open,
  onClose,
  onAction,
  t,
  nav,
}: CommandPaletteProps) {
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      const id = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [open]);

  const groups = React.useMemo(
    () => [...buildGroupsFromNav(nav), actionGroup(t)],
    [nav, t],
  );

  const flat = React.useMemo(() => {
    const list: (PaletteItem & { _group: string })[] = [];
    const needle = q.toLowerCase();
    groups.forEach((g) =>
      g.items.forEach((it) => {
        if (!q || it.label.toLowerCase().includes(needle)) {
          list.push({ ...it, _group: g.group });
        }
      }),
    );
    return list;
  }, [q, groups]);

  const groupedFiltered = React.useMemo(() => {
    const map: Record<string, (PaletteItem & { _group: string })[]> = {};
    flat.forEach((it) => {
      (map[it._group] = map[it._group] || []).push(it);
    });
    return Object.entries(map).map(([group, items]) => ({ group, items }));
  }, [flat]);

  if (!open) return null;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(flat.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flat[active]) {
        onAction(flat[active].id);
        onClose();
      }
    }
  };

  let idx = -1;

  return (
    <div
      className="cp-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="cp fade-in" onKeyDown={onKey}>
        <div className="cp-input-row">
          <Icon name="search" size={15} />
          <input
            ref={inputRef}
            placeholder="Ketik perintah atau cari..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
          />
          <Kbd>ESC</Kbd>
        </div>
        <div className="cp-list scrollbar">
          {groupedFiltered.length === 0 && (
            <div
              style={{
                padding: '24px 12px',
                color: 'var(--fg-muted)',
                fontSize: 12.5,
                textAlign: 'center',
              }}
            >
              Tidak ada hasil
            </div>
          )}
          {groupedFiltered.map((g) => (
            <div key={g.group}>
              <div className="cp-group">{g.group}</div>
              {g.items.map((it) => {
                idx += 1;
                const isActive = idx === active;
                const myIdx = idx;
                return (
                  <div
                    key={`${g.group}:${it.id}`}
                    className={cn('cp-item', isActive && 'active')}
                    onMouseEnter={() => setActive(myIdx)}
                    onClick={() => {
                      onAction(it.id);
                      onClose();
                    }}
                  >
                    <span className="icon">
                      <Icon name={it.icon} size={14} />
                    </span>
                    <span className="label">{it.label}</span>
                    {it.hint && <span className="hint">{it.hint}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cp-foot">
          <span>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> navigasi
          </span>
          <span>
            <Kbd>↵</Kbd> pilih
          </span>
          <span>
            <Kbd>ESC</Kbd> tutup
          </span>
          <span style={{ marginLeft: 'auto' }}>Sentient ERP</span>
        </div>
      </div>
    </div>
  );
}
