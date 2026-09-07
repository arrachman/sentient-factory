import type { ReactNode } from 'react';
import { Text } from '../atoms/Text';

export type DashboardTemplateProps = {
  children: ReactNode;
};

export function DashboardTemplate({ children }: DashboardTemplateProps) {
  return (
    <main style={{ width: 'min(1100px, calc(100% - 2rem))', margin: '0 auto', padding: '3rem 0' }}>
      <header style={{ marginBottom: '2rem', display: 'grid', gap: '0.4rem' }}>
        <Text as="span" variant="label" tone="accent">Pesantren Nuha Mergosono</Text>
        <Text as="h1" variant="title">SIMTERPADU</Text>
        <Text tone="muted">Fondasi aplikasi siap dikembangkan dari prototype ke sistem terintegrasi.</Text>
      </header>
      {children}
    </main>
  );
}
