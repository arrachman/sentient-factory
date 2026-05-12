/**
 * Wrapper section untuk HR page-view: page title + container width responsif.
 * Dipakai oleh semua HR page-view supaya layout konsisten.
 */
import type { ReactNode } from 'react';
import {
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { cn } from '@/lib/utils';

export function SectionShell({
  title,
  description,
  children,
  wide = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        'mx-auto space-y-6 pb-6',
        wide
          ? 'w-full max-w-[1400px] px-4 sm:px-6 xl:px-8'
          : 'max-w-3xl px-4 sm:px-5',
      )}
    >
      {title.trim().length > 0 || description ? (
        <div className="pb-2">
          <ToolbarHeading>
            {title.trim().length > 0 ? (
              <ToolbarPageTitle>{title}</ToolbarPageTitle>
            ) : null}
            {description ? (
              <ToolbarDescription>{description}</ToolbarDescription>
            ) : null}
          </ToolbarHeading>
        </div>
      ) : null}
      {children}
    </div>
  );
}
