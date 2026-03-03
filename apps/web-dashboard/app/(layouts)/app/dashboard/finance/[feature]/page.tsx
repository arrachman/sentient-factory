'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toFinancePathByFeature } from '@/components/layouts/app/components/finance-route';

export default function LegacyFinanceDashboardRedirectPage() {
  const params = useParams<{ feature: string }>();
  const router = useRouter();

  useEffect(() => {
    const feature = String(params?.feature ?? 'm2_aj');
    router.replace(toFinancePathByFeature(feature));
  }, [params, router]);

  return null;
}
