import { createEntityProxy } from '@/shared/api/server-proxy';

export const { PATCH } = createEntityProxy('/api/hr/settings/:settingKey', 'settingKey');
