import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export function POST(request: NextRequest, context: { params: Promise<Record<string, string>> }) {
  return proxyToApi(request, 'POST', '/api/dashboard/alerting/channels/:channelId/test-send', {
    params: context.params,
  });
}
