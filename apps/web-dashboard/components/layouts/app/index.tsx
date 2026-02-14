'use client';

import { LayoutProvider } from './components/context';
import { Main } from './components/main';
import { AppMenuProvider } from './components/menu-context';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <AppMenuProvider>
        <Main>
          {children}
        </Main>
      </AppMenuProvider>
    </LayoutProvider>
  );
}
