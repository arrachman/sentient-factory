import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ viewId: string }> },
) {
  const { viewId } = await context.params;
  return proxyToApi(request, 'PATCH', `/api/dashboard/alerting/triage-saved-views/${viewId}/state`);
}
