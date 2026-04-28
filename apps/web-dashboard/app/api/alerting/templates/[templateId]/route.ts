import { createEntityProxy } from '@/shared/api/server-proxy';

export const { GET, PATCH, DELETE } = createEntityProxy('/api/dashboard/alerting/templates/:templateId', 'templateId');
