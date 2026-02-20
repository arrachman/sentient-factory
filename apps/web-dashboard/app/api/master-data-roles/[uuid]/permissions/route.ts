import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export async function GET(request: NextRequest, context: { params: Promise<{ uuid: string }> }) {
  return proxyToApi(request, 'GET', '/api/master-data-roles/:uuid/permissions', {
    params: context.params,
  });
}

export async function PUT(request: NextRequest, context: { params: Promise<{ uuid: string }> }) {
  return proxyToApi(request, 'PUT', '/api/master-data-roles/:uuid/permissions', {
    params: context.params,
  });
}
