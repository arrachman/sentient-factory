'use client';

import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { NotificationChannel } from '../_lib/mock-data';
import type { AlertDeliveryStatusRecord } from './types';
import { statusBadgeClass } from './utils';

export function ChannelCard({
  label,
  target,
  status,
  ownership,
  ownerLabel,
  icon,
  deliveryState,
  onEdit,
  onTestSend,
  testSendLoading = false,
  isActive = true,
  onToggleActive,
  toggleLoading = false,
  onDelete,
  deleteLoading = false,
}: {
  label: string;
  target: string;
  status: string;
  ownership: NotificationChannel['ownership'];
  ownerLabel?: string;
  icon: ReactNode;
  deliveryState?: AlertDeliveryStatusRecord | null;
  onEdit?: () => void;
  onTestSend?: () => void;
  testSendLoading?: boolean;
  isActive?: boolean;
  onToggleActive?: () => void;
  toggleLoading?: boolean;
  onDelete?: () => void;
  deleteLoading?: boolean;
}) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">{icon}{label}</CardTitle>
        <CardDescription>{target}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="outline" className={statusBadgeClass(status)}>{status}</Badge>
          <span className="text-xs text-muted-foreground">
            {deliveryState ? `${deliveryState.provider_mode} / ${deliveryState.provider_name}` : 'No provider status'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{ownership === 'internal_user' ? 'Bound to internal user' : 'Standalone channel'}</Badge>
          {ownerLabel ? <Badge variant="outline">{ownerLabel}</Badge> : null}
          <Badge variant="outline" className={isActive ? statusBadgeClass('connected') : statusBadgeClass('draft')}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
          {deliveryState ? (
            <Badge variant="outline" className={deliveryState.is_configured ? statusBadgeClass('connected') : statusBadgeClass('draft')}>
              {deliveryState.is_configured ? 'Configured' : 'Dry Run'}
            </Badge>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={onTestSend} disabled={!onTestSend || testSendLoading || !isActive}>
            {testSendLoading ? 'Sending...' : 'Test Send'}
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit} disabled={!onEdit}>Edit</Button>
          <Button size="sm" variant="outline" onClick={onToggleActive} disabled={!onToggleActive || toggleLoading}>
            {toggleLoading ? 'Saving...' : isActive ? 'Deactivate' : 'Reactivate'}
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete} disabled={!onDelete || deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
