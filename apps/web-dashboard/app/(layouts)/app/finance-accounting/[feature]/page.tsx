import { notFound } from 'next/navigation';

export default async function FinanceAccountingFeatureFallbackPage({
  params,
}: {
  params: Promise<{ feature: string }>;
}) {
  await params;
  notFound();
}
