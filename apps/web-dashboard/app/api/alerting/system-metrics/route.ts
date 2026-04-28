import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export async function GET(request: NextRequest) {
  return proxyToApi(request, 'GET', '/api/dashboard/alerting/system-metrics');
}
