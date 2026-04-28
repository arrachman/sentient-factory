import { NextRequest } from 'next/server';
import { proxyToApi } from '@/shared/api/server-proxy';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ deliveryId: string }> },
) {
  const { deliveryId } = await params;
  return proxyToApi(request, 'POST', '/api/dashboard/alerting/delivery-logs/:deliveryId/requeue', {
    params: { deliveryId },
  });
}
