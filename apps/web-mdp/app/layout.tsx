import type { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Senti MDP',
    default: 'Senti MDP',
  },
  description:
    'Senti MDP — Manufacturing Digitalization Platform (ISA-95 Level 3 / MOM).',
  applicationName: 'Senti MDP',
  authors: [{ name: 'Sentient Factory' }],
  formatDetection: { telephone: false },
};

export const viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

// Runs before first paint so appearance data-attributes are never missing on
// the initial frame (prevents FOUC). Mirrors web-erp.
const APPEARANCE_INIT_SCRIPT = `(function(){try{var s=JSON.parse(localStorage.getItem('mdp-appearance')||localStorage.getItem('erp-appearance')||'{}');var e=document.documentElement;e.setAttribute('data-density',s.density||'compact');e.setAttribute('data-fontscale',s.fontScale||'base');e.setAttribute('data-sidebar',s.sidebar||'icon');e.setAttribute('data-primary',s.primary||'blue');}catch(x){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_INIT_SCRIPT }} />
      </head>
      <body className={cn('h-full antialiased text-sm text-foreground bg-background')}>
        <ThemeProvider>
          <Suspense>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
