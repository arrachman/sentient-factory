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
import { useMasterDivisionPage } from '@/features/master-division/hooks/use-master-division-page';
import { MasterDivisionFormPanel } from '@/features/master-division/ui/master-division-form-panel';
import { MasterDivisionListPanel } from '@/features/master-division/ui/master-division-list-panel';

export default function MasterDataDivisionPage() {
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
    page,
    limit,
    totalPages,
    totalItems,
    fetchList,
    onSubmit,
    onDelete,
    openAddRoute,
    openEditRoute,
    backToList,
    applySearch,
    resetSearch,
  } = useMasterDivisionPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Master Data Division</ToolbarPageTitle>
          <ToolbarDescription>Manage division code, name, status, and description.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openAddRoute}>
            <Plus />
            Add Division
          </Button>
          <Button variant="outline" onClick={() => fetchList(page)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <MasterDivisionListPanel
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
            onEdit={openEditRoute}
            onDelete={(uuid) => {
              void onDelete(uuid);
            }}
            onPageChange={fetchList}
          />
        ) : (
          <MasterDivisionFormPanel
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
