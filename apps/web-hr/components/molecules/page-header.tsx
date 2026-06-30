import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Canonical page shell (FRONTEND-DESIGN-SYSTEM §5.5): `.page` → `.page-header`
 * (pinned title + code-tag + actions) → `.page-body` (scrolling content).
 * Named `PageHeader` for import stability; it renders the whole page wrapper.
 * Pass screen content as `children`; optional `bodyClassName` tunes the body
 * (e.g. `mx-auto max-w-3xl` for narrow settings forms).
 */
export function PageHeader({
  title,
  code,
  description,
  actions,
  bodyClassName,
  children,
}: {
  title: string;
  code?: string;
  description?: string;
  actions?: ReactNode;
  bodyClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          {title}
          {code && <span className="code-tag">{code}</span>}
        </h1>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
      <div className={cn("page-body overflow-auto p-4", bodyClassName)}>
        {description && (
          <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}
