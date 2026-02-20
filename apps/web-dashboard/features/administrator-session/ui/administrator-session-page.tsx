'use client';

import { Plus, RefreshCw } from 'lucide-react';
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
import { AdministratorSessionFormPanel } from '@/features/administrator-session/ui/administrator-session-form-panel';

export default function AdministratorSessionPage() {
  const {
    items,
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    loading,
    submitting,
    error,
    setError,
    users,
    page,
    limit,
    totalPages,
    totalItems,
    refreshList,
    applySearch,
    resetSearch,
    changePage,
    openCreate,
    onSubmit,
    onEdit,
    onDelete,
    backToList,
  } = useAdministratorSessionPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Sessions</ToolbarPageTitle>
          <ToolbarDescription>Manage active and historical login sessions.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openCreate}>
            <Plus />
            Add Session
          </Button>
          <Button variant="outline" onClick={() => void refreshList()} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <AdministratorSessionListPanel
            items={items}
            loading={loading}
            searchInput={searchInput}
            page={page}
            limit={limit}
            totalPages={totalPages}
            totalItems={totalItems}
            onSearchInputChange={setSearchInput}
            onSearchSubmit={applySearch}
            onSearchReset={resetSearch}
            onEdit={onEdit}
            onDelete={(sessionId) => {
              void onDelete(sessionId);
            }}
            onPageChange={changePage}
            onError={setError}
          />
        ) : (
          <AdministratorSessionFormPanel
            form={form}
            users={users}
            editingUuid={editingUuid}
            submitting={submitting}
            error={error}
            onFormChange={setForm}
            onSubmit={() => {
              void onSubmit();
            }}
            onBack={backToList}
          />
        )}
      </div>
    </div>
  );
}
