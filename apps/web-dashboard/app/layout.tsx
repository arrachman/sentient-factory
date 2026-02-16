import { ReactNode, Suspense } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';

import '@/styles/globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Sentient Factory',
    default: 'Sentient Factory', // a default is required when creating a template
  },
  icons: {
    icon: [
      {
        url: '/media/app/favicon-16x13.png',
        sizes: '13x16',
        type: 'image/png',
      },
    ],
    shortcut: '/media/app/favicon-16x13.png',
    apple: '/media/app/favicon-16x13.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          'antialiased flex h-full text-base text-foreground bg-background',
          inter.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="nextjs-theme"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <TooltipProvider delayDuration={0}>
            <Suspense>{children}</Suspense>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>       
      </body>
    </html>
  );
}
