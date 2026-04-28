import { createCollectionProxy } from '@/shared/api/server-proxy';

export const { GET } = createCollectionProxy('/api/dashboard/alerting/events');
