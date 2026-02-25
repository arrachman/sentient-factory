import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ domain: string }> },
) {
  const params = await context.params;
  return proxyToApi(request, 'GET', '/api/dashboard/:domain/table', {
    params: { domain: params.domain },
  });
}
