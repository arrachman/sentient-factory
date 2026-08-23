import Link from 'next/link';

export type TabDef = { key: string; label: string };

/** Tab bar server-side: state hidup di query ?tab= supaya bisa di-bookmark & di-render server. */
export function Tabs({ tabs, aktif, basePath }: { tabs: TabDef[]; aktif: string; basePath: string }) {
  return (
    <nav className="tabbar">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.key === tabs[0].key ? basePath : `${basePath}?tab=${t.key}`}
          className={`tab ${t.key === aktif ? 'active' : ''}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

/** Ambil tab aktif dari searchParams, jatuh ke tab pertama bila tidak dikenal. */
export function tabAktif(tabs: TabDef[], raw?: string | string[]): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return tabs.some((t) => t.key === value) ? (value as string) : tabs[0].key;
}
