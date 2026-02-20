'use client';

import { LogisticTransactionPageLayout } from '@/features/logistic-transaction/ui/logistic-transaction-page-layout';
import { useLogisticTransactionPageController } from '@/features/logistic-transaction/hooks/use-logistic-transaction-page-controller';

export function LogisticTransactionPageView() {
  const controller = useLogisticTransactionPageController();
  return <LogisticTransactionPageLayout controller={controller} />;
}

export default LogisticTransactionPageView;
