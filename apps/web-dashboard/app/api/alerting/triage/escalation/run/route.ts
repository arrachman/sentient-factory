import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export async function POST(request: NextRequest) {
  return proxyToApi(request, 'POST', '/api/dashboard/alerting/triage/escalation/run');
}
