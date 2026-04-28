import { createCollectionProxy } from '@/shared/api/server-proxy';

export const { GET, POST } = createCollectionProxy('/api/dashboard/alerting/triage-saved-views');
