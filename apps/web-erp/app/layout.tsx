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
    template: '%s | Sentient ERP',
    default: 'Sentient ERP',
  },
  description:
    'Sentient ERP — ERP modern: administrasi sistem, akses, dan master data.',
  applicationName: 'Sentient ERP',
  authors: [{ name: 'Sentient Factory' }],
  formatDetection: { telephone: false },
};

export const viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          'h-full antialiased text-sm text-foreground bg-background',
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          storageKey="erp-theme"
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
