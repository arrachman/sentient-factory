import { createEntityProxy } from '@/shared/api/server-proxy';

export const { GET, PATCH } = createEntityProxy('/api/dashboard/alerting/events/:eventId', 'eventId');
