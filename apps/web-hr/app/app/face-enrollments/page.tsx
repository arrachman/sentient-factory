import type { Metadata } from 'next';
import { FaceEnrollmentsView } from '@/components/pages/face-enrollments-view';

export const metadata: Metadata = { title: 'Pendaftaran Wajah' };

export default function Page() {
  return <FaceEnrollmentsView />;
}
