import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ruleId: string }> },
) {
  const { ruleId } = await params;
  return proxyToApi(request, 'POST', '/api/dashboard/alerting/rules/:ruleId/run', {
    params: { ruleId },
  });
}
