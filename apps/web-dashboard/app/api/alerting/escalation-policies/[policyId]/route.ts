import { createEntityProxy } from '@/shared/api/server-proxy';

export const { PATCH, DELETE } = createEntityProxy('/api/dashboard/alerting/escalation-policies/:policyId', 'policyId');
