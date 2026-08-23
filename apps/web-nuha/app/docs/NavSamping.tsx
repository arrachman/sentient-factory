'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export type ItemNav = { id: string; judul: string };

/**
 * Sidebar navigasi dokumentasi. Klien karena butuh scroll-spy: item yang
 * bagiannya sedang terlihat diberi tanda aktif lewat IntersectionObserver.
 */
export function NavSamping({ items }: { items: ItemNav[] }) {
  const [aktif, setAktif] = useState(items[0]?.id ?? '');

  useEffect(() => {
    // Bagian teratas yang masuk pita 0–40% layar dianggap sedang dibaca.
    const observer = new IntersectionObserver(
      (entries) => {
        const terlihat = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (terlihat[0]) setAktif(terlihat[0].target.id);
      },
      { rootMargin: '0% 0% -60% 0%' },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="docs-samping" aria-label="Daftar isi dokumentasi">
      <p className="label">Isi</p>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={item.id === aktif ? 'aktif' : undefined}>
              {item.judul}
            </a>
          </li>
        ))}
      </ol>
      <Link href="/" className="btn btn-sekunder docs-samping-kembali">
        Kembali ke aplikasi
      </Link>
    </nav>
  );
}
