import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ dashboardKey: string }> },
) {
  const params = await context.params;
  return proxyToApi(request, 'GET', '/api/dashboard/custom-db/:dashboardKey', {
    params: { dashboardKey: params.dashboardKey },
  });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ dashboardKey: string }> },
) {
  const params = await context.params;
  return proxyToApi(request, 'PATCH', '/api/dashboard/custom-db/:dashboardKey', {
    params: { dashboardKey: params.dashboardKey },
  });
}
