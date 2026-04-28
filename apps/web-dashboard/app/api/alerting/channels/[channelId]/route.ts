import { createEntityProxy } from '@/shared/api/server-proxy';

export const { PATCH, DELETE } = createEntityProxy('/api/dashboard/alerting/channels/:channelId', 'channelId');
