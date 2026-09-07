import { StatusCard } from '../molecules/StatusCard';

const SUMMARY_ITEMS = [
  { label: 'Backend API', value: 'NestJS + TypeScript', detail: 'Terhubung' },
  { label: 'Frontend', value: 'Next.js App Router', detail: 'Aktif' },
  { label: 'Design System', value: 'Atomic Design', detail: 'Siap' },
];

export function DashboardSummary() {
  return (
    <section
      aria-label="Ringkasan sistem"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}
    >
      {SUMMARY_ITEMS.map((item) => <StatusCard key={item.label} {...item} />)}
    </section>
  );
}
