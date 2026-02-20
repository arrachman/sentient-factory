import { createEntityProxy } from '@/shared/api/server-proxy';

export const { GET, PATCH, DELETE } = createEntityProxy('/api/audit-logs/:uuid');
