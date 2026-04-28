import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export function GET(request: NextRequest) {
  return proxyToApi(request, 'GET', '/api/hr/attendance/history');
}
