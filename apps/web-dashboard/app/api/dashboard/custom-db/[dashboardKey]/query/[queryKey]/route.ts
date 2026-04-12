import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ dashboardKey: string; queryKey: string }> },
) {
  const params = await context.params;
  return proxyToApi(
    request,
    'POST',
    '/api/dashboard/custom-db/:dashboardKey/query/:queryKey',
    {
      params: {
        dashboardKey: params.dashboardKey,
        queryKey: params.queryKey,
      },
    },
  );
}
