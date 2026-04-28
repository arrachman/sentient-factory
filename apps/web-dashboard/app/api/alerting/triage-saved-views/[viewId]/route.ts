import { createEntityProxy } from '@/shared/api/server-proxy';

export const { PATCH, DELETE } = createEntityProxy('/api/dashboard/alerting/triage-saved-views/:viewId', 'viewId');
