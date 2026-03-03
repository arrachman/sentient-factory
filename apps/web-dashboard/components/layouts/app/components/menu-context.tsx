'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { MENU_SIDEBAR } from '@/config/app.config';
import { MenuConfig, MenuItem } from '@/config/types';
import { normalizeFinanceMenus, normalizeFinancePath } from './finance-route';

type SidebarMenuApiItem = {
  key: string;
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
  const iconCandidate = iconMap[iconName];
  if (!iconCandidate) {
    return undefined;
  }

  // Guard against invalid icon names or non-component exports from lucide-react.
  if (
    typeof iconCandidate === 'function' ||
    (typeof iconCandidate === 'object' &&
      iconCandidate !== null &&
      '$$typeof' in iconCandidate)
  ) {
    return iconCandidate;
  }

  return undefined;
}

function mapApiMenus(items: SidebarMenuApiItem[]): MenuConfig {
  return normalizeFinanceMenus(
    [...items]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => {
      const mapped: MenuItem = {
        key: item.key,
        title: item.title,
        path: normalizeFinancePath(item.path ?? undefined),
        icon: resolveIcon(item.icon),
      };

      if (Array.isArray(item.children) && item.children.length > 0) {
        mapped.children = mapApiMenus(item.children);
      }

      return mapped;
    }),
  );
}

function hasTokenCookie() {
  if (typeof document === 'undefined') {
    return false;
  }
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .some((part) => part.startsWith('sf_token='));
}

function getTokenFromCookie() {
  if (typeof document === 'undefined') {
    return '';
  }

  const tokenPart = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('sf_token='));

  if (!tokenPart) {
    return '';
  }

  const rawToken = tokenPart.substring('sf_token='.length);
  try {
    return decodeURIComponent(rawToken);
  } catch {
    return rawToken;
  }
}

export function AppMenuProvider({ children }: { children: ReactNode }) {
  const [menus, setMenus] = useState<MenuConfig>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadMenus() {
      const hasToken = hasTokenCookie();
      if (!hasToken) {
        if (!cancelled) {
          setMenus(MENU_SIDEBAR);
          setLoading(false);
        }
        return;
      }

      try {
        const token = getTokenFromCookie();
        const response = await fetch('/api/menus/sidebar', {
          method: 'GET',
          cache: 'no-store',
          credentials: 'include',
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        });

        if (!response.ok) {
          throw new Error(`Failed to load menus: ${response.status}`);
        }

        const payload = (await response.json()) as SidebarMenuApiResponse;
        if (!cancelled) {
          if (payload.success && Array.isArray(payload.data)) {
            setMenus(mapApiMenus(payload.data));
          } else {
            // Authenticated user must never get unrestricted static menu fallback.
            setMenus([]);
          }
        }
      } catch {
        if (!cancelled) {
          // Keep menu restricted when backend menu endpoint fails for logged-in users.
          setMenus([]);
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
