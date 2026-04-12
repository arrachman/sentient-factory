import { notFound } from 'next/navigation';
import SentiAiPage from '../senti-ai/page';

export default async function AppCatchAllNotFoundPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  const slug = resolved.slug ?? [];

  if (slug[0] === 'senti-ai') {
    return <SentiAiPage />;
  }

  if (slug[0] === 'dashboard' && slug[1] === 'manager') {
    return <SentiAiPage />;
  }

  notFound();
}
