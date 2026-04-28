import { createEntityProxy } from '@/shared/api/server-proxy';

export const { GET } = createEntityProxy('/api/hr/attendance-reviews/:eventId', 'eventId');
