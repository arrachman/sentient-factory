import { createCollectionProxy } from '@/shared/api/server-proxy';

export const { POST } = createCollectionProxy('/api/hr/attendance/clock-in');
