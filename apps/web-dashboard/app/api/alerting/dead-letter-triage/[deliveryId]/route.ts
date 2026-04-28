import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export async function PATCH(request: NextRequest, context: { params: Promise<{ deliveryId: string }> }) {
  const { deliveryId } = await context.params;
  return proxyToApi(request, 'PATCH', `/api/dashboard/alerting/dead-letter-triage/${deliveryId}`);
}
