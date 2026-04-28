import { createEntityProxy } from '@/shared/api/server-proxy';

export const { GET, PUT } = createEntityProxy('/api/hr/users/:appUserId/worksites', 'appUserId');
