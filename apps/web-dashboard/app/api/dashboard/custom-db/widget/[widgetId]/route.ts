import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ widgetId: string }> },
) {
  const params = await context.params;
  return proxyToApi(request, 'PATCH', '/api/dashboard/custom-db/widget/:widgetId', {
    params: { widgetId: params.widgetId },
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ widgetId: string }> },
) {
  const params = await context.params;
  return proxyToApi(request, 'POST', '/api/dashboard/custom-db/widget/:widgetId/duplicate', {
    params: { widgetId: params.widgetId },
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ widgetId: string }> },
) {
  const params = await context.params;
  return proxyToApi(request, 'DELETE', '/api/dashboard/custom-db/widget/:widgetId', {
    params: { widgetId: params.widgetId },
  });
}
