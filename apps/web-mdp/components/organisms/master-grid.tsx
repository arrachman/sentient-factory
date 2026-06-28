import Link from 'next/link';
import { MDP_MASTERS } from '@/lib/masters';

/** Landing grid of the MDP foundation masters (mdp/eam). */
export function MasterGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {MDP_MASTERS.map((m) => {
        const Icon = m.icon;
        return (
          <Link
            key={m.id}
            href={m.route}
            className="flex cursor-pointer flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/60 hover:shadow-sm"
          >
            <header className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Icon className="size-4.5" />
              </span>
              <div>
                <h3 className="font-semibold leading-tight text-foreground">{m.name}</h3>
                <code className="font-mono text-[10px] text-muted-foreground">{m.domain}_</code>
              </div>
            </header>
            <p className="text-xs leading-relaxed text-muted-foreground">{m.description}</p>
          </Link>
        );
      })}
    </div>
  );
}
