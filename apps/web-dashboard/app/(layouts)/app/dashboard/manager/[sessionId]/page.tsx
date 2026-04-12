import { redirect } from 'next/navigation';

export default async function LegacyManagerDashboardSessionRedirectPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  redirect(`/app/senti-ai/${sessionId}`);
}
