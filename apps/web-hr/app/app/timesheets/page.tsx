import type { Metadata } from 'next';
import { TimesheetsView } from '@/components/pages/timesheets-view';

export const metadata: Metadata = { title: 'Timesheet' };

export default function Page() {
  return <TimesheetsView />;
}
