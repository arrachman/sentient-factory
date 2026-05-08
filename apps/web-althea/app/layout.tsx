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
    template: '%s | Althea Psychology',
    default: 'Althea Psychology',
  },
  description:
    'Booking sesi psikolog & terapi — konseling, terapi anak, tes psikologi.',
  applicationName: 'Althea Psychology',
  keywords: ['psikolog', 'klinik', 'terapi', 'konseling', 'tes psikologi'],
  authors: [{ name: 'Althea Psychology' }],
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Althea',
  },
};

export const viewport = {
  themeColor: '#5b8a66',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          'h-full antialiased text-base text-foreground bg-background',
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          storageKey="althea-theme"
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
