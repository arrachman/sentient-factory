'use client';

import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function LogisticInboundPage() {
  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Logistic Inbound</ToolbarPageTitle>
          <ToolbarDescription>Inbound module page is ready for implementation.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>
    </div>
  );
}
