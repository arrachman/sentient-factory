'use client';

import type { ReactNode } from 'react';
import type {
  AlertDeliveryStatusPayload,
  AlertDeliveryStatusRecord,
  PersistedAlertChannelRecord,
} from './types';
import { ChannelCard } from './channel-card';

export function ChannelCardList({
  items,
  icon,
  channelType,
  deliveryStatus,
  onEdit,
  onTestSend,
  testSendLoadingId,
  onToggleActive,
  channelToggleLoadingId,
  onDelete,
  channelDeleteLoadingId,
}: {
  items: PersistedAlertChannelRecord[];
  icon: ReactNode;
  channelType: AlertDeliveryStatusRecord['channel_type'];
  deliveryStatus: AlertDeliveryStatusPayload | null;
  onEdit: (item: PersistedAlertChannelRecord) => void;
  onTestSend: (channelId: number) => void;
  testSendLoadingId: number | null;
  onToggleActive: (item: PersistedAlertChannelRecord) => void;
  channelToggleLoadingId: number | null;
  onDelete: (item: PersistedAlertChannelRecord) => void;
  channelDeleteLoadingId: number | null;
}) {
  const deliveryState = deliveryStatus?.channels.find((channel) => channel.channel_type === channelType) || null;
  return (
    <>
      {items.map((item) => (
        <ChannelCard
          key={item.channel_id}
          icon={icon}
          deliveryState={deliveryState}
          label={item.label}
          target={item.target_value}
          status={item.status}
          ownership={item.ownership_type}
          ownerLabel={item.owner_label || undefined}
          onEdit={() => onEdit(item)}
          onTestSend={() => onTestSend(item.channel_id)}
          testSendLoading={testSendLoadingId === item.channel_id}
          isActive={item.is_active}
          onToggleActive={() => onToggleActive(item)}
          toggleLoading={channelToggleLoadingId === item.channel_id}
          onDelete={() => onDelete(item)}
          deleteLoading={channelDeleteLoadingId === item.channel_id}
        />
      ))}
    </>
  );
}
