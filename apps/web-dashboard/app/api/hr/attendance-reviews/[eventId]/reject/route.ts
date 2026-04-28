import { createEntityProxy } from '@/shared/api/server-proxy';

export const { POST } = createEntityProxy('/api/hr/attendance-reviews/:eventId/reject', 'eventId');
