import type { Metadata } from 'next';
import { ReactNode, Suspense } from 'react';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { AppQueryProvider } from '@/shared/providers/query-provider';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Senti HR',
    default: 'Senti HR',
  },
  description:
    'Senti HR — Time & Attendance: absensi, pengenalan wajah, geofence, dan manajemen tenaga kerja.',
  applicationName: 'Senti HR',
  authors: [{ name: 'Sentient Factory' }],
  formatDetection: { telephone: false },
};

export const viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
};

// web-hr screens are client + cookie-auth (data fetched at runtime from
// /api/hr/*). Static prerendering provides no value and the provider tree must
// run on the client, so render every route dynamically.
export const dynamic = 'force-dynamic';

// Blocking appearance init — sets data-theme attrs before first paint (no FOUC).
const APPEARANCE_INIT_SCRIPT = `(function(){try{var s=JSON.parse(localStorage.getItem('hr-appearance')||'{}');var e=document.documentElement;e.setAttribute('data-density',s.density||'comfortable');e.setAttribute('data-primary',s.primary||'teal');}catch(x){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_INIT_SCRIPT }} />
      </head>
      <body className={cn('h-full antialiased text-sm text-foreground bg-background')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          storageKey="hr-theme"
          enableSystem={false}
          disableTransitionOnChange
          enableColorScheme
        >
          <AppQueryProvider>
            <TooltipProvider delayDuration={0}>
              <Suspense>{children}</Suspense>
              <Toaster />
            </TooltipProvider>
          </AppQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
