/**
 * MetricCard sederhana untuk top-of-page KPI di HR module.
 * Mendukung 4 tone visual: default, warning, danger, success.
 */
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const TONE_CLASSES = {
  danger: {
    shell: 'border-rose-200 bg-rose-50/80',
    icon: 'text-rose-600',
    value: 'text-rose-900',
    subtext: 'text-rose-700/80',
  },
  warning: {
    shell: 'border-amber-200 bg-amber-50/80',
    icon: 'text-amber-600',
    value: 'text-amber-900',
    subtext: 'text-amber-700/80',
  },
  success: {
    shell: 'border-emerald-200 bg-emerald-50/80',
    icon: 'text-emerald-600',
    value: 'text-emerald-900',
    subtext: 'text-emerald-700/80',
  },
  default: {
    shell: 'border-slate-200 bg-white',
    icon: 'text-slate-500',
    value: 'text-slate-900',
    subtext: 'text-slate-500',
  },
} as const;

export function MetricCard({
  icon: Icon,
  label,
  value,
  subtext,
  tone = 'default',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  subtext?: string;
  tone?: 'default' | 'warning' | 'danger' | 'success';
}) {
  const toneClasses = TONE_CLASSES[tone];

  return (
    <div className={cn('rounded-xl border p-5 shadow-sm', toneClasses.shell)}>
      <div className={cn('flex items-center gap-2', toneClasses.icon)}>
        <Icon className="size-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p
        className={cn('mt-3 text-lg font-semibold sm:text-xl', toneClasses.value)}
      >
        {value}
      </p>
      {subtext ? (
        <p className={cn('mt-1 text-xs leading-5', toneClasses.subtext)}>
          {subtext}
        </p>
      ) : null}
    </div>
  );
}
