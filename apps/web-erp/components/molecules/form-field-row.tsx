'use client';

/**
 * Shared header form-field row: left label (fixed width) + control. Used by the
 * dynamic transaction-form renderer for both structural and custom fields so the
 * label column stays aligned regardless of field kind.
 */

import * as React from 'react';

export function FormFieldRow({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-24 shrink-0 text-left">
        {label}
        {required && <span className="text-danger">&nbsp;*</span>}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </label>
  );
}
