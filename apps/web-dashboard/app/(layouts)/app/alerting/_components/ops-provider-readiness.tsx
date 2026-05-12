'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { AlertDeliveryStatusPayload } from './types';

export function OpsProviderReadiness({ deliveryStatus }: { deliveryStatus: AlertDeliveryStatusPayload }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Readiness</CardTitle>
        <CardDescription>Backend delivery mode per channel.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        {deliveryStatus.channels.map((channel) => (
          <div key={channel.channel_type} className="rounded-xl border px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{channel.channel_type}</span>
              <Badge variant="outline" className={channel.is_configured ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-700'}>
                {channel.provider_mode}
              </Badge>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Provider: {channel.provider_name || '-'} · {channel.is_configured ? 'Configured' : 'Fallback / Dry Run'}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
