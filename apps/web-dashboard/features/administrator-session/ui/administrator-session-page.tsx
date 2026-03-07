'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { useAdministratorSessionPage } from '@/features/administrator-session/hooks/use-administrator-session-page';
import { AdministratorSessionListPanel } from '@/features/administrator-session/ui/administrator-session-list-panel';

export default function AdministratorSessionPage() {
  const {
    items,
    currentUser,
    searchInput,
    setSearchInput,
    loading,
    setError,
    page,
    limit,
    totalPages,
    totalItems,
    refreshList,
    resetSearch,
    changePage,
    changeLimit,
    onDelete,
  } = useAdministratorSessionPage();

  const currentUserLabel = currentUser?.fullName || currentUser?.username || currentUser?.email || 'Current login user';

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Sessions</ToolbarPageTitle>
          <ToolbarDescription>Monitor login sessions for the currently authenticated user.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button variant="outline" onClick={() => void refreshList()} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        <AdministratorSessionListPanel
          items={items}
          loading={loading}
          searchInput={searchInput}
          page={page}
          limit={limit}
          totalPages={totalPages}
          totalItems={totalItems}
          currentUserLabel={currentUserLabel}
          onSearchInputChange={setSearchInput}
          onSearchReset={resetSearch}
          onDelete={(sessionId) => {
            void onDelete(sessionId);
          }}
          onPageChange={changePage}
          onLimitChange={changeLimit}
          onError={setError}
        />
      </div>
    </div>
  );
}
