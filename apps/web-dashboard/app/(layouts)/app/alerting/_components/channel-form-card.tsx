'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { NotificationChannel } from '../_lib/mock-data';
import { internalUserOptions, type InternalUserOption } from './types';

export function ChannelFormCard({
  editingChannelId,
  channelType,
  setChannelType,
  channelOwnership,
  setChannelOwnership,
  ownerLabel,
  setOwnerLabel,
  channelLabel,
  setChannelLabel,
  channelTeamKey,
  setChannelTeamKey,
  channelTarget,
  setChannelTarget,
  channelStatus,
  setChannelStatus,
  channelSaveLoading,
  onSave,
  onCancel,
}: {
  editingChannelId: number | null;
  channelType: NotificationChannel['type'];
  setChannelType: (value: NotificationChannel['type']) => void;
  channelOwnership: NotificationChannel['ownership'];
  setChannelOwnership: (value: NotificationChannel['ownership']) => void;
  ownerLabel: InternalUserOption;
  setOwnerLabel: (value: InternalUserOption) => void;
  channelLabel: string;
  setChannelLabel: (value: string) => void;
  channelTeamKey: string;
  setChannelTeamKey: (value: string) => void;
  channelTarget: string;
  setChannelTarget: (value: string) => void;
  channelStatus: NotificationChannel['status'];
  setChannelStatus: (value: NotificationChannel['status']) => void;
  channelSaveLoading: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <Card className="h-fit border-slate-200">
      <CardHeader>
        <CardTitle>{editingChannelId ? 'Edit User Notification Channel' : 'Create User Notification Channel'}</CardTitle>
        <CardDescription>
          Persisted flow for a recipient channel. It can stay standalone, or it can be bound to an internal user from the app.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Channel Type</div>
          <Select value={channelType} onValueChange={(value) => setChannelType(value as NotificationChannel['type'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="WhatsApp Personal">WhatsApp Personal</SelectItem>
              <SelectItem value="WhatsApp Group">WhatsApp Group</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Ownership</div>
          <Select value={channelOwnership} onValueChange={(value) => setChannelOwnership(value as NotificationChannel['ownership'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="standalone">Standalone Channel</SelectItem>
              <SelectItem value="internal_user">Bound To Internal User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {channelOwnership === 'internal_user' ? (
          <div className="space-y-2">
            <div className="text-sm font-medium">Internal User</div>
            <Select value={ownerLabel} onValueChange={(value) => setOwnerLabel(value as InternalUserOption)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {internalUserOptions.map((item) => (
                  <SelectItem key={item} value={item}>{item}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <div className="space-y-2">
          <div className="text-sm font-medium">Label</div>
          <Input value={channelLabel} onChange={(event) => setChannelLabel(event.target.value)} placeholder="Finance Lead / Ops Alert Group / Management Distribution" />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Team Key</div>
          <Input
            value={channelTeamKey}
            onChange={(event) => setChannelTeamKey(event.target.value)}
            placeholder="finance-core / ops-l2 / warehouse-night-shift"
          />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Target</div>
          <Input value={channelTarget} onChange={(event) => setChannelTarget(event.target.value)} placeholder={channelType === 'Email' ? 'name@company.com' : channelType === 'WhatsApp Group' ? 'ops-alert-group' : '+62812xxxxxxx'} />
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Initial Status</div>
          <Select value={channelStatus} onValueChange={(value) => setChannelStatus(value as NotificationChannel['status'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="connected">Connected</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
          Proper concept: store this as a standalone notification channel first. Add optional user binding for owner routing, and use `team key` only when this channel should be matched by team-based escalation policy.
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={onSave} disabled={channelSaveLoading || !channelLabel.trim() || !channelTarget.trim()}>
            {channelSaveLoading ? 'Saving...' : editingChannelId ? 'Save Channel' : 'Create Channel'}
          </Button>
          {editingChannelId ? (
            <Button variant="outline" onClick={onCancel} disabled={channelSaveLoading}>
              Cancel
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
