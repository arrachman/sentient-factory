import { MDP_MODULES, type ModuleStatus } from '@/lib/modules';
import { cn } from '@/lib/utils';

const STATUS_LABEL: Record<ModuleStatus, string> = {
  planned: 'Direncanakan',
  'in-progress': 'Dikerjakan',
  live: 'Aktif',
};

const STATUS_CLASS: Record<ModuleStatus, string> = {
  planned: 'bg-muted text-muted-foreground',
  'in-progress': 'bg-warn-soft text-warn',
  live: 'bg-success-soft text-success',
};

/** Landing grid of the MOM modules (Phase 1 placeholder — no routes yet). */
export function ModuleGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {MDP_MODULES.map((mod) => {
        const Icon = mod.icon;
        return (
          <article
            key={mod.id}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <header className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="size-4.5" />
                </span>
                <div>
                  <h3 className="font-semibold leading-tight text-foreground">
                    {mod.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{mod.system}</p>
                </div>
              </div>
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-medium',
                  STATUS_CLASS[mod.status]
                )}
              >
                {STATUS_LABEL[mod.status]}
              </span>
            </header>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {mod.description}
            </p>
            <footer className="mt-auto flex flex-wrap gap-1 pt-1">
              {mod.domains.map((d) => (
                <code
                  key={d}
                  className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {d}_
                </code>
              ))}
            </footer>
          </article>
        );
      })}
    </div>
  );
}
