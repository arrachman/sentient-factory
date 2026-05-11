import type { ReactNode } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';

export function Shell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="container space-y-7 pb-10">
      <Toolbar>
        <div>
          <ToolbarHeading>
            <ToolbarPageTitle>{title}</ToolbarPageTitle>
            <ToolbarDescription>{description}</ToolbarDescription>
          </ToolbarHeading>
        </div>
        {actions ? <ToolbarActions>{actions}</ToolbarActions> : null}
      </Toolbar>
      {children}
    </div>
  );
}

export function SettingRow({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-muted p-2">{icon}</div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border px-3 py-2">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium text-right">{value}</div>
    </div>
  );
}
