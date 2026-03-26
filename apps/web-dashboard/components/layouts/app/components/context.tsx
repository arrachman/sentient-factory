'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

type SidebarTheme = 'dark' | 'light';

// Define the shape of the layout state
interface LayoutState {
  sidebarCollapse: boolean;
  setSidebarCollapse: (open: boolean) => void;
  sidebarHoverExpand: boolean;
  setSidebarHoverExpand: (open: boolean) => void;
  sidebarTheme: SidebarTheme;
  setSidebarTheme: (theme: SidebarTheme) => void;
}

// Create the context
const LayoutContext = createContext<LayoutState | undefined>(undefined);

// Provider component
interface LayoutProviderProps {
  children: ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const { resolvedTheme } = useTheme();
  const [sidebarCollapse, setSidebarCollapse] = useState(false);
  const [sidebarHoverExpand, setSidebarHoverExpand] = useState(false);
  const [sidebarTheme, setSidebarTheme] = useState<SidebarTheme>('light');

  useEffect(() => {
    setSidebarTheme(resolvedTheme === 'dark' ? 'dark' : 'light');
  }, [resolvedTheme]);

  return (
    <LayoutContext.Provider
      value={{
        sidebarCollapse,
        setSidebarCollapse,
        sidebarHoverExpand,
        setSidebarHoverExpand,
        sidebarTheme,
        setSidebarTheme,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

// Custom hook for consuming the context
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
