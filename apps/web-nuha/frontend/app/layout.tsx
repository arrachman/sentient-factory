import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIMTERPADU Nuha',
  description: 'Sistem Informasi Manajemen Terpadu Pesantren Nuha',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
