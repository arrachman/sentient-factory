import type { Metadata } from 'next';
import { EmployeesView } from '@/components/pages/employees-view';

export const metadata: Metadata = { title: 'Karyawan' };

export default function Page() {
  return <EmployeesView />;
}
