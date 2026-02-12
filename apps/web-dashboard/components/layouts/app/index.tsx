'use client';

import { Metadata } from 'next';
import { LayoutProvider } from './components/context';
import { Main } from './components/main';
import { AppMenuProvider } from './components/menu-context';

// Generate metadata for the layout
export async function generateMetadata(): Promise<Metadata> {
  // You can access route params here if needed
  // const { params } = props;
  
  return {
    title: 'Dashboard | Metronic',
    description: 'Central Hub for Personal Customization',
  };
}

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
