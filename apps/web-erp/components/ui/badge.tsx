import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { statusBadgeVariant } from '@/lib/status';

/**
 * Status pill. Mirrors prototype `.pill` (+ soft tonal variants) and
 * the `StatusPill` helper. `dot` renders the leading status dot.
 */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-[10px] border px-[7px] py-px text-[11px] font-medium leading-normal',
  {
    variants: {
      variant: {
        default: 'border-border bg-secondary text-muted-foreground',
        primary:
          'border-primary/25 bg-[var(--primary-soft)] text-[var(--primary-soft-fg)]',
        success: 'border-success/25 bg-success-soft text-success',
        warn: 'border-warn/25 bg-warn-soft text-warn',
        danger: 'border-danger/25 bg-danger-soft text-danger',
        info: 'border-info/25 bg-info-soft text-info',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({
  className,
  variant,
  dot,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: string;
  label?: React.ReactNode;
  className?: string;
}) {
  return (
    <Badge variant={statusBadgeVariant(status)} dot className={className}>
      {label ?? status}
    </Badge>
  );
}

export { badgeVariants };
