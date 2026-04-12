import { redirect } from 'next/navigation';

export default function LegacyManagerDashboardRedirectPage() {
  redirect('/app/senti-ai');
}
