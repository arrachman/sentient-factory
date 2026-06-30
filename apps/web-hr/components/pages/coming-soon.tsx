import { Rocket } from "lucide-react";
import { PageHeader } from "@/components/molecules/page-header";

/** Placeholder for jibble-roadmap modules not yet backed by endpoints.
 *  See db-design/module-roadmap.md for the build order + DB plan. */
export function ComingSoon({
  title,
  description,
  bullets,
}: {
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <PageHeader title={title} description={description}>
      <div className="flex flex-col items-start gap-4 rounded-lg border bg-card p-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Rocket className="h-3.5 w-3.5" /> Segera hadir
        </span>
        <p className="max-w-xl text-sm text-muted-foreground">
          Modul ini ada di roadmap adaptasi jibble.io. Cakupan yang
          direncanakan:
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm text-foreground/80">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    </PageHeader>
  );
}
