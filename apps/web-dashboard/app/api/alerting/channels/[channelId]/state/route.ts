import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export function PATCH(request: NextRequest, context: { params: Promise<Record<string, string>> }) {
  return proxyToApi(request, 'PATCH', '/api/dashboard/alerting/channels/:channelId/state', {
    params: context.params,
  });
}
