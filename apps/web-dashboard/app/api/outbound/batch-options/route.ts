import { proxyToApi } from '@/shared/api/server-proxy';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return proxyToApi(request, 'GET', '/api/outbound/batch-options');
}
