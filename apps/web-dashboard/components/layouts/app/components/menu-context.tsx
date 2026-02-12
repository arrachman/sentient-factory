'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { MENU_SIDEBAR } from '@/config/app.config';
import { MenuConfig, MenuItem } from '@/config/types';

type SidebarMenuApiItem = {
  title: string;
  path: string | null;
  icon: string | null;
  sortOrder: number;
  children: SidebarMenuApiItem[];
};

type SidebarMenuApiResponse = {
  success?: boolean;
  data?: SidebarMenuApiItem[];
};

type AppMenuContextValue = {
  menus: MenuConfig;
  loading: boolean;
};

const AppMenuContext = createContext<AppMenuContextValue | undefined>(undefined);

const iconMap = LucideIcons as unknown as Record<string, NonNullable<MenuItem['icon']>>;

function resolveIcon(iconName: string | null | undefined): MenuItem['icon'] {
  if (!iconName) {
    return undefined;
  }
  return iconMap[iconName];
}

function mapApiMenus(items: SidebarMenuApiItem[]): MenuConfig {
  return [...items]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => {
      const mapped: MenuItem = {
        title: item.title,
        path: item.path ?? undefined,
        icon: resolveIcon(item.icon),
      };

      if (Array.isArray(item.children) && item.children.length > 0) {
        mapped.children = mapApiMenus(item.children);
      }

      return mapped;
    });
}

export function AppMenuProvider({ children }: { children: ReactNode }) {
  const [menus, setMenus] = useState<MenuConfig>(MENU_SIDEBAR);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadMenus() {
      try {
        const response = await fetch('/api/menus/sidebar', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to load menus: ${response.status}`);
        }

        const payload = (await response.json()) as SidebarMenuApiResponse;
        if (!cancelled && payload.success && Array.isArray(payload.data)) {
          setMenus(mapApiMenus(payload.data));
        }
      } catch {
        if (!cancelled) {
          setMenus(MENU_SIDEBAR);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMenus();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ menus, loading }), [menus, loading]);

  return <AppMenuContext.Provider value={value}>{children}</AppMenuContext.Provider>;
}

export function useAppMenu() {
  const context = useContext(AppMenuContext);
  if (!context) {
    throw new Error('useAppMenu must be used within an AppMenuProvider');
  }
  return context;
}
