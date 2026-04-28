import { createEntityProxy } from '@/shared/api/server-proxy';

export const { PATCH } = createEntityProxy('/api/dashboard/alerting/settings/:settingKey', 'settingKey');
