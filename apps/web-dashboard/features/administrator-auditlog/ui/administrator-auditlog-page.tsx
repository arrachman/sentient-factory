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
import { useAdministratorAuditlogPage } from '@/features/administrator-auditlog/hooks/use-administrator-auditlog-page';
import { AdministratorAuditlogFormPanel } from '@/features/administrator-auditlog/ui/administrator-auditlog-form-panel';
import { AdministratorAuditlogListPanel } from '@/features/administrator-auditlog/ui/administrator-auditlog-list-panel';

export default function AdministratorAuditlogPage() {
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
    page,
    limit,
    totalPages,
    totalItems,
    onSubmit,
    onEdit,
    onDelete,
    openCreate,
    backToList,
    applySearch,
    resetSearch,
    changePage,
    changeLimit,
    refreshList,
  } = useAdministratorAuditlogPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Administrator Auditlog</ToolbarPageTitle>
          <ToolbarDescription>Manage audit logs for administrator activities.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openCreate}>
            <Plus />
            Add Auditlog
          </Button>
          <Button variant="outline" onClick={() => void refreshList()} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <AdministratorAuditlogListPanel
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
            onDelete={(auditLogId) => {
              void onDelete(auditLogId);
            }}
            onPageChange={changePage}
            onLimitChange={changeLimit}
            onError={setError}
          />
        ) : (
          <AdministratorAuditlogFormPanel
            form={form}
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
