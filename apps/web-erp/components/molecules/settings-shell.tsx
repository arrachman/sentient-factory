'use client';

import * as React from 'react';
import { Icon, type IconName } from '@/components/ui/icons';

interface SettingsTab {
  route: string;
  aliases: string[];
  label: string;
  icon: IconName;
}

const TABS: SettingsTab[] = [
  {
    route: '/settings/appearance',
    aliases: ['set-appearance'],
    label: 'Tampilan',
    icon: 'moon',
  },
  {
    route: '/admin/preferences',
    aliases: ['set-prefs'],
    label: 'Preferensi',
    icon: 'gear',
  },
  {
    route: '/admin/settings',
    aliases: ['adm-settings'],
    label: 'System Settings',
    icon: 'layers',
  },
];

export function isSettingsRoute(route: string): boolean {
  return TABS.some((t) => t.route === route || t.aliases.includes(route));
}

function toCanonical(route: string): string {
  return TABS.find((t) => t.route === route || t.aliases.includes(route))?.route ?? route;
}

interface SettingsShellProps {
  activeRoute: string;
  /** routing: tab click → onNavigate (URL changes); tabs: internal state only */
  mode: 'routing' | 'tabs';
  onNavigate: (r: string) => void;
  renderContent: (route: string) => React.ReactNode;
}

export function SettingsShell({
  activeRoute,
  mode,
  onNavigate,
  renderContent,
}: SettingsShellProps) {
  const [activeTab, setActiveTab] = React.useState(() => toCanonical(activeRoute));

  React.useEffect(() => {
    setActiveTab(toCanonical(activeRoute));
  }, [activeRoute]);

  const handleTabClick = React.useCallback(
    (route: string) => {
      if (mode === 'routing') {
        onNavigate(route);
      } else {
        setActiveTab(route);
      }
    },
    [mode, onNavigate],
  );

  const displayRoute = mode === 'tabs' ? activeTab : activeRoute;

  return (
    <div className="settings-shell">
      <nav className="settings-tabs" role="tablist" aria-label="Settings">
        {TABS.map((tab) => {
          const active =
            mode === 'tabs'
              ? tab.route === activeTab
              : tab.route === activeRoute || tab.aliases.includes(activeRoute);
          return (
            <button
              key={tab.route}
              role="tab"
              aria-selected={active}
              className={`settings-tab${active ? ' active' : ''}`}
              onClick={() => handleTabClick(tab.route)}
            >
              <Icon name={tab.icon} size={13} />
              {tab.label}
            </button>
          );
        })}
      </nav>
      <div className="settings-content">{renderContent(displayRoute)}</div>
    </div>
  );
}
