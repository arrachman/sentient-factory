import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Althea Psychology',
    short_name: 'Althea',
    description: 'Sistem manajemen klinik psikologi — booking, jadwal, dan notifikasi WhatsApp.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfaf6', // cream-50
    theme_color: '#5b8a66', // sage-500
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['medical', 'productivity', 'business'],
    lang: 'id',
  };
}
