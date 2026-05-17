'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

/**
 * Form label. Mirrors prototype `.field label` (muted, 12px). Set
 * `required` to render the danger asterisk (`.field label .req`).
 */
export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    required?: boolean;
  }
>(({ className, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-xs font-normal text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-45',
      className,
    )}
    {...props}
  >
    {required && <span className="mr-0.5 text-danger">*</span>}
    {children}
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;
