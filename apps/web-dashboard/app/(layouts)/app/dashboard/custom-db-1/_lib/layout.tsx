import type { DashboardWidget } from '../_types';

export const LAYOUT_OPTIONS = [
  { value: 'xl:col-span-4', label: 'Three Charts Per Row' },
  { value: 'xl:col-span-6', label: 'Two Charts Per Row (50:50)' },
  { value: 'xl:col-span-3', label: 'Split Left Narrow (25:75)' },
  { value: 'xl:col-span-9', label: 'Split Right Wide (75:25)' },
  { value: 'xl:col-span-12', label: 'Full Width' },
] as const;

export type ResizePreset = '25' | '50' | '75' | '100';

export function resolveWidgetSpanClass(value?: string) {
  switch (value) {
    case 'xl:col-span-3':
      return 'xl:col-span-3';
    case 'xl:col-span-4':
    case 'lg:col-span-4':
      return 'xl:col-span-4';
    case 'xl:col-span-6':
    case 'lg:col-span-6':
      return 'xl:col-span-6';
    case 'xl:col-span-9':
      return 'xl:col-span-9';
    case 'xl:col-span-12':
    case 'lg:col-span-8':
    case 'lg:col-span-12':
      return 'xl:col-span-12';
    default:
      return 'xl:col-span-4';
  }
}

export function resolveWidgetSpanUnits(value?: string) {
  switch (resolveWidgetSpanClass(value)) {
    case 'xl:col-span-3':
      return 3;
    case 'xl:col-span-4':
      return 4;
    case 'xl:col-span-6':
      return 6;
    case 'xl:col-span-9':
      return 9;
    case 'xl:col-span-12':
      return 12;
    default:
      return 4;
  }
}

export function buildWidgetRows(widgets: DashboardWidget[]) {
  const rows: DashboardWidget[][] = [];
  let currentRow: DashboardWidget[] = [];
  let currentWidth = 0;

  widgets.forEach((widget) => {
    const spanUnits = resolveWidgetSpanUnits(widget.span_class_name);

    if (currentRow.length > 0 && currentWidth + spanUnits > 12) {
      rows.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }

    currentRow.push(widget);
    currentWidth += spanUnits;
  });

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

export function resolveResizeSpan(size: ResizePreset) {
  switch (size) {
    case '25':
      return 'xl:col-span-3';
    case '75':
      return 'xl:col-span-9';
    case '100':
      return 'xl:col-span-12';
    case '50':
    default:
      return 'xl:col-span-6';
  }
}

export function resolveResizePreset(value?: string): ResizePreset {
  switch (value) {
    case 'xl:col-span-3':
      return '25';
    case 'xl:col-span-9':
      return '75';
    case 'xl:col-span-12':
    case 'lg:col-span-12':
      return '100';
    default:
      return '50';
  }
}

export function resolveResizePresetFromDelta(current: ResizePreset, deltaX: number) {
  const presets: ResizePreset[] = ['25', '50', '75', '100'];
  const currentIndex = presets.indexOf(current);
  const stepOffset = Math.round(deltaX / 80);
  const nextIndex = Math.min(presets.length - 1, Math.max(0, currentIndex + stepOffset));

  return presets[nextIndex];
}

export function normalizeLayoutValue(value?: string) {
  switch (value) {
    case 'xl:col-span-3':
      return 'xl:col-span-3';
    case 'xl:col-span-4':
    case 'lg:col-span-4':
      return 'xl:col-span-4';
    case 'xl:col-span-6':
    case 'lg:col-span-6':
      return 'xl:col-span-6';
    case 'xl:col-span-9':
      return 'xl:col-span-9';
    case 'xl:col-span-12':
    case 'lg:col-span-8':
    case 'lg:col-span-12':
      return 'xl:col-span-12';
    default:
      return 'xl:col-span-4';
  }
}

export function LayoutPreview({ value }: { value: string }) {
  const normalizedValue = normalizeLayoutValue(value);
  const activeClass = 'ring-2 ring-[#009EF7] ring-offset-2 ring-offset-white dark:ring-offset-slate-950';
  const baseClass =
    'flex h-8 items-center justify-center rounded-lg bg-slate-300/80 text-[10px] font-semibold text-slate-700 dark:bg-slate-700/80 dark:text-slate-200';

  if (normalizedValue === 'xl:col-span-12') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <div className={`${baseClass} ${activeClass}`}>100%</div>
      </div>
    );
  }

  if (normalizedValue === 'xl:col-span-6') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="grid grid-cols-2 gap-2">
          <div className={`${baseClass} ${activeClass}`}>50%</div>
          <div className={baseClass}>50%</div>
        </div>
      </div>
    );
  }

  if (normalizedValue === 'xl:col-span-3') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="grid grid-cols-4 gap-2">
          <div className={`${baseClass} ${activeClass}`}>25%</div>
          <div className={`col-span-3 ${baseClass}`}>75%</div>
        </div>
      </div>
    );
  }

  if (normalizedValue === 'xl:col-span-9') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="grid grid-cols-4 gap-2">
          <div className={baseClass}>25%</div>
          <div className={`col-span-3 ${baseClass} ${activeClass}`}>75%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="grid grid-cols-3 gap-2">
        <div className={`${baseClass} ${activeClass}`}>33%</div>
        <div className={baseClass}>33%</div>
        <div className={baseClass}>33%</div>
      </div>
    </div>
  );
}
