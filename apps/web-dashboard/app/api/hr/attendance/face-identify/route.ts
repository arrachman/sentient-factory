import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export function POST(request: NextRequest) {
  return proxyToApi(request, 'POST', '/api/hr/attendance/face-identify');
}
