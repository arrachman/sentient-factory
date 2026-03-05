import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type CompactInputProps = Omit<React.ComponentProps<typeof Input>, 'variant'>;

function CompactInput({ className, ...props }: CompactInputProps) {
  return <Input variant="sm" className={cn('text-xs', className)} {...props} />;
}

export { CompactInput };