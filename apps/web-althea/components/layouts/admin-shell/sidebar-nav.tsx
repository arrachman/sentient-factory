'use client';

import Link from 'next/link';
import type { NavGroup } from './nav-config';

/**
 * Sidebar nav — render groups + items dengan active state.
 * Item klik dari mobile auto-tutup mobile menu via callback.
 */
export function SidebarNav({
  nav,
  isActive,
  onItemClick,
}: {
  nav: NavGroup[];
  isActive: (href: string) => boolean;
  onItemClick: () => void;
}) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-3">
      {nav.map((group) => (
        <div key={group.category} className="mb-4">
          <div
            className="eyebrow"
            style={{
              padding: '6px 10px 4px',
              fontSize: 10.5,
              letterSpacing: '0.12em',
            }}
          >
            {group.category}
          </div>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onItemClick}
                  className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                  style={{ justifyContent: 'flex-start' }}
                >
                  {item.icon}
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge ? (
                    <span
                      className="badge badge-success"
                      style={{
                        fontSize: 9.5,
                        height: 16,
                        padding: '0 6px',
                      }}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
