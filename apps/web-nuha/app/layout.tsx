import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIMTERPADU | Nurul Huda Mergosono',
  description: 'Sistem Informasi Manajemen Terpadu Yayasan Pendidikan Islam Nurul Huda Mergosono.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
