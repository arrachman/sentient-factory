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
import { MasterItemFormPanel } from '@/features/master-item/ui/master-item-form-panel';
import { MasterItemListPanel } from '@/features/master-item/ui/master-item-list-panel';
import { useMasterItemPage } from '@/features/master-item/hooks/use-master-item-page';

export default function MasterDataItemPage() {
  const {
    items,
    uomOptions,
    form,
    setForm,
    editingUuid,
    showForm,
    searchInput,
    setSearchInput,
    loading,
    loadingUom,
    submitting,
    error,
    page,
    limit,
    totalPages,
    totalItems,
    refreshList,
    applySearch,
    resetSearch,
    changePage,
    changeLimit,
    openAddRoute,
    openEditRoute,
    onSubmit,
    onDelete,
    backToList,
  } = useMasterItemPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Master Data Item</ToolbarPageTitle>
          <ToolbarDescription>Manage item code, category, UOM, type, and active status.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openAddRoute}>
            <Plus />
            Add Item
          </Button>
          <Button variant="outline" onClick={() => void refreshList()} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <MasterItemListPanel
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
            onPageChange={changePage}
            onLimitChange={changeLimit}
          />
        ) : (
          <MasterItemFormPanel
            form={form}
            editingUuid={editingUuid}
            uomOptions={uomOptions}
            loadingUom={loadingUom}
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
