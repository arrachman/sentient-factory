import { proxyToApi } from '@/shared/api/server-proxy';
import { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest) {
  return proxyToApi(request, 'PATCH', '/api/menus/sort-batch');
}
