'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Mail, MessageCircleMore, MessageSquareMore } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { NotificationChannel } from '../_lib/mock-data';
import {
  internalUserOptions,
  type AlertDeliveryStatusPayload,
  type AlertDeliveryStatusRecord,
  type PersistedAlertChannelRecord,
} from './types';
import { statusBadgeClass } from './utils';
import { Shell } from './_shared';
import { ChannelCardList } from './channel-card-list';
import { ChannelFormCard } from './channel-form-card';

export function NotificationChannelsPageView() {
  const [channels, setChannels] = useState<PersistedAlertChannelRecord[]>([]);
  const [deliveryStatus, setDeliveryStatus] = useState<AlertDeliveryStatusPayload | null>(null);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [channelsError, setChannelsError] = useState('');
  const [channelActionMessage, setChannelActionMessage] = useState('');
  const [testSendLoadingId, setTestSendLoadingId] = useState<number | null>(null);
  const [channelDeleteLoadingId, setChannelDeleteLoadingId] = useState<number | null>(null);
  const [channelToggleLoadingId, setChannelToggleLoadingId] = useState<number | null>(null);
  const [channelPendingDelete, setChannelPendingDelete] = useState<PersistedAlertChannelRecord | null>(null);
  const [channelSaveLoading, setChannelSaveLoading] = useState(false);
  const [editingChannelId, setEditingChannelId] = useState<number | null>(null);
  const [showInactiveChannels, setShowInactiveChannels] = useState(false);
  const [channelType, setChannelType] = useState<NotificationChannel['type']>('WhatsApp Personal');
  const [channelLabel, setChannelLabel] = useState('');
  const [channelTarget, setChannelTarget] = useState('');
  const [channelStatus, setChannelStatus] = useState<NotificationChannel['status']>('draft');
  const [channelOwnership, setChannelOwnership] = useState<NotificationChannel['ownership']>('standalone');
  const [ownerLabel, setOwnerLabel] = useState<(typeof internalUserOptions)[number]>(internalUserOptions[0]);
  const [channelTeamKey, setChannelTeamKey] = useState('');

  const loadChannels = async () => {
    setChannelsLoading(true);
    setChannelsError('');
    try {
      const response = await fetch('/api/alerting/channels', { cache: 'no-store' });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to load notification channels.');
      }
      setChannels(payload.data as PersistedAlertChannelRecord[]);
    } catch (error) {
      setChannels([]);
      setChannelsError(error instanceof Error ? error.message : 'Failed to load notification channels.');
    } finally {
      setChannelsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch('/api/alerting/delivery-status', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.success || !payload?.data) {
          throw new Error(payload?.message || 'Failed to load delivery status.');
        }
        if (!cancelled) {
          setDeliveryStatus(payload.data as AlertDeliveryStatusPayload);
        }
      })
      .catch(() => {
        if (!cancelled) setDeliveryStatus(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    void loadChannels();
  }, []);

  const grouped = useMemo(
    () => ({
      personal: channels.filter((item) => item.channel_type === 'wa-personal' && (showInactiveChannels || item.is_active)),
      group: channels.filter((item) => item.channel_type === 'wa-group' && (showInactiveChannels || item.is_active)),
      email: channels.filter((item) => item.channel_type === 'email' && (showInactiveChannels || item.is_active)),
    }),
    [channels, showInactiveChannels],
  );

  async function handleSaveChannel() {
    const label = channelLabel.trim();
    const target = channelTarget.trim();
    if (!label || !target) {
      return;
    }
    setChannelsError('');
    setChannelSaveLoading(true);
    const normalizedChannelType =
      channelType === 'WhatsApp Personal' ? 'wa-personal'
      : channelType === 'WhatsApp Group' ? 'wa-group'
      : 'email';
    try {
      const response = await fetch(
        editingChannelId ? `/api/alerting/channels/${editingChannelId}` : '/api/alerting/channels',
        {
          method: editingChannelId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channelType: normalizedChannelType,
            label,
            targetValue: target,
            ownershipType: channelOwnership,
            ownerLabel: channelOwnership === 'internal_user' ? ownerLabel : '',
            teamKey: channelTeamKey.trim(),
            status: channelStatus,
          }),
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || `Failed to ${editingChannelId ? 'update' : 'create'} notification channel.`);
      }
      setChannels(payload.data as PersistedAlertChannelRecord[]);
      setEditingChannelId(null);
      setChannelLabel('');
      setChannelTarget('');
      setChannelStatus('draft');
      setChannelOwnership('standalone');
      setOwnerLabel(internalUserOptions[0]);
      setChannelTeamKey('');
    } catch (error) {
      setChannelsError(error instanceof Error ? error.message : `Failed to ${editingChannelId ? 'update' : 'create'} notification channel.`);
    } finally {
      setChannelSaveLoading(false);
    }
  }

  async function handleTestSend(channelId: number) {
    setChannelsError('');
    setChannelActionMessage('');
    setTestSendLoadingId(channelId);
    try {
      const response = await fetch(`/api/alerting/channels/${channelId}/test-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !payload?.data) {
        throw new Error(payload?.message || 'Failed to send test notification.');
      }
      setChannelActionMessage(
        `Test send queued and processed. Event #${payload.data.event_id}, delivery #${payload.data.delivery_id}.`,
      );
    } catch (error) {
      setChannelsError(error instanceof Error ? error.message : 'Failed to send test notification.');
    } finally {
      setTestSendLoadingId(null);
    }
  }

  async function handleDeleteChannel(channel: PersistedAlertChannelRecord) {
    setChannelsError('');
    setChannelActionMessage('');
    setChannelDeleteLoadingId(channel.channel_id);
    try {
      const response = await fetch(`/api/alerting/channels/${channel.channel_id}`, {
        method: 'DELETE',
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to delete notification channel.');
      }
      setChannels(payload.data as PersistedAlertChannelRecord[]);
      if (editingChannelId === channel.channel_id) {
        resetChannelForm();
      }
      setChannelActionMessage(`Channel "${channel.label}" deleted.`);
    } catch (error) {
      setChannelsError(error instanceof Error ? error.message : 'Failed to delete notification channel.');
    } finally {
      setChannelDeleteLoadingId(null);
    }
  }

  async function handleToggleChannelState(channel: PersistedAlertChannelRecord) {
    setChannelsError('');
    setChannelActionMessage('');
    setChannelToggleLoadingId(channel.channel_id);
    try {
      const response = await fetch(`/api/alerting/channels/${channel.channel_id}/state`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !channel.is_active }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success || !Array.isArray(payload?.data)) {
        throw new Error(payload?.message || 'Failed to update channel state.');
      }
      setChannels(payload.data as PersistedAlertChannelRecord[]);
      setChannelActionMessage(`Channel "${channel.label}" ${channel.is_active ? 'deactivated' : 'reactivated'}.`);
    } catch (error) {
      setChannelsError(error instanceof Error ? error.message : 'Failed to update channel state.');
    } finally {
      setChannelToggleLoadingId(null);
    }
  }

  function handleEditChannel(channel: PersistedAlertChannelRecord) {
    setEditingChannelId(channel.channel_id);
    setChannelType(
      channel.channel_type === 'wa-personal'
        ? 'WhatsApp Personal'
        : channel.channel_type === 'wa-group'
          ? 'WhatsApp Group'
          : 'Email',
    );
    setChannelLabel(channel.label);
    setChannelTarget(channel.target_value);
    setChannelStatus(channel.status);
    setChannelOwnership(channel.ownership_type);
    setOwnerLabel((channel.owner_label as (typeof internalUserOptions)[number]) || internalUserOptions[0]);
    setChannelTeamKey(typeof channel.metadata?.team === 'string' ? channel.metadata.team : '');
  }

  function resetChannelForm() {
    setEditingChannelId(null);
    setChannelType('WhatsApp Personal');
    setChannelLabel('');
    setChannelTarget('');
    setChannelStatus('draft');
    setChannelOwnership('standalone');
    setOwnerLabel(internalUserOptions[0]);
    setChannelTeamKey('');
  }

  return (
    <Shell title="Notification Channels" description="Manage destination channels for WhatsApp personal, WhatsApp group, and email.">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Tabs defaultValue="personal" className="space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800">
            <div>
              <div className="text-sm font-medium">Show Inactive Channels</div>
              <div className="text-xs text-muted-foreground">Inactive channels stay hidden by default, but can still be reactivated here.</div>
            </div>
            <Switch checked={showInactiveChannels} onCheckedChange={setShowInactiveChannels} />
          </div>
          <TabsList>
            <TabsTrigger value="personal">WhatsApp Personal</TabsTrigger>
            <TabsTrigger value="group">WhatsApp Group</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          {channelsError ? <div className="text-sm text-rose-600 dark:text-rose-400">{channelsError}</div> : null}
          {channelActionMessage ? <div className="text-sm text-muted-foreground">{channelActionMessage}</div> : null}
          <TabsContent value="personal" className="grid gap-4 md:grid-cols-2">
            <ChannelCardList
              items={grouped.personal}
              icon={<MessageCircleMore className="size-4" />}
              channelType="wa-personal"
              deliveryStatus={deliveryStatus}
              onEdit={handleEditChannel}
              onTestSend={handleTestSend}
              testSendLoadingId={testSendLoadingId}
              onToggleActive={handleToggleChannelState}
              channelToggleLoadingId={channelToggleLoadingId}
              onDelete={setChannelPendingDelete}
              channelDeleteLoadingId={channelDeleteLoadingId}
            />
          </TabsContent>
          <TabsContent value="group" className="grid gap-4 md:grid-cols-2">
            <ChannelCardList
              items={grouped.group}
              icon={<MessageSquareMore className="size-4" />}
              channelType="wa-group"
              deliveryStatus={deliveryStatus}
              onEdit={handleEditChannel}
              onTestSend={handleTestSend}
              testSendLoadingId={testSendLoadingId}
              onToggleActive={handleToggleChannelState}
              channelToggleLoadingId={channelToggleLoadingId}
              onDelete={setChannelPendingDelete}
              channelDeleteLoadingId={channelDeleteLoadingId}
            />
          </TabsContent>
          <TabsContent value="email" className="grid gap-4 md:grid-cols-2">
            <ChannelCardList
              items={grouped.email}
              icon={<Mail className="size-4" />}
              channelType="email"
              deliveryStatus={deliveryStatus}
              onEdit={handleEditChannel}
              onTestSend={handleTestSend}
              testSendLoadingId={testSendLoadingId}
              onToggleActive={handleToggleChannelState}
              channelToggleLoadingId={channelToggleLoadingId}
              onDelete={setChannelPendingDelete}
              channelDeleteLoadingId={channelDeleteLoadingId}
            />
          </TabsContent>
          {channelsLoading ? <div className="text-sm text-muted-foreground">Loading channels...</div> : null}
        </Tabs>

        <ChannelFormCard
          editingChannelId={editingChannelId}
          channelType={channelType}
          setChannelType={setChannelType}
          channelOwnership={channelOwnership}
          setChannelOwnership={setChannelOwnership}
          ownerLabel={ownerLabel}
          setOwnerLabel={setOwnerLabel}
          channelLabel={channelLabel}
          setChannelLabel={setChannelLabel}
          channelTeamKey={channelTeamKey}
          setChannelTeamKey={setChannelTeamKey}
          channelTarget={channelTarget}
          setChannelTarget={setChannelTarget}
          channelStatus={channelStatus}
          setChannelStatus={setChannelStatus}
          channelSaveLoading={channelSaveLoading}
          onSave={handleSaveChannel}
          onCancel={resetChannelForm}
        />
      </div>
      <AlertDialog open={Boolean(channelPendingDelete)} onOpenChange={(open) => { if (!open) setChannelPendingDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification Channel</AlertDialogTitle>
            <AlertDialogDescription>
              {channelPendingDelete
                ? `This will deactivate channel "${channelPendingDelete.label}" and remove it from the active channel list.`
                : 'This action will deactivate the selected notification channel.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={channelDeleteLoadingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={!channelPendingDelete || channelDeleteLoadingId !== null}
              onClick={(event) => {
                event.preventDefault();
                if (!channelPendingDelete) return;
                void handleDeleteChannel(channelPendingDelete).then(() => setChannelPendingDelete(null));
              }}
            >
              {channelDeleteLoadingId !== null ? 'Deleting...' : 'Delete Channel'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}

