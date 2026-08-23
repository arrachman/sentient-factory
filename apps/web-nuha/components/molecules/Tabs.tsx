import Link from 'next/link';
import type { TabDef } from '@/components/utils/tabs';

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
