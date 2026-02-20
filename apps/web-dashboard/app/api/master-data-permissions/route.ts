import { createCollectionProxy } from '@/shared/api/server-proxy';

export const { GET, POST } = createCollectionProxy('/api/master-data-permissions');
