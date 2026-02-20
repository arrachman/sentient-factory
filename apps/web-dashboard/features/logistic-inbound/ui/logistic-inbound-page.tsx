'use client';

import { ArrowLeft, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { useLogisticInboundPage } from '@/features/logistic-inbound/hooks/use-logistic-inbound-page';
import { LogisticInboundListPanel } from '@/features/logistic-inbound/ui/logistic-inbound-list-panel';
import { LogisticInboundForm } from '@/features/logistic-inbound/ui/logistic-inbound-form';

export default function LogisticInboundPage() {
  const {
    items,
    suppliers,
    warehouses,
    itemOptions,
    form,
    setForm,
    editingUuid,
    showForm,
    currentUserId,
    lockedWarehouseId,
    isAdminRole,
    search,
    setSearch,
    loading,
    loadingOptions,
    submitting,
    error,
    isItemModalOpen,
    editingDetailIndex,
    itemModalError,
    draftDetail,
    page,
    limit,
    totalPages,
    totalItems,
    itemOptionMap,
    detailSummary,
    draftItemTotalQty,
    fetchList,
    openAddRoute,
    openEditRoute,
    saveInbound,
    removeInbound,
    backToList,
    openAddItemModal,
    openEditItemModal,
    closeItemModal,
    setDraftField,
    setDraftBatchField,
    addDraftBatchRow,
    removeDraftBatchRow,
    saveDraftItem,
    removeDetailRow,
  } = useLogisticInboundPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Logistic Inbound</ToolbarPageTitle>
          <ToolbarDescription>Kelola inbound dari supplier dengan multi batch per item.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          {!showForm ? (
            <>
              <Button onClick={openAddRoute} disabled={loadingOptions}>
                <Plus />
                Add Inbound
              </Button>
              <Button variant="outline" onClick={() => fetchList(page)} disabled={loading}>
                <RefreshCw />
                Refresh
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={backToList}>
              <ArrowLeft />
              Back to List
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <LogisticInboundListPanel
            items={items}
            loading={loading}
            search={search}
            page={page}
            limit={limit}
            totalPages={totalPages}
            totalItems={totalItems}
            onSearchChange={setSearch}
            onSearchSubmit={() => fetchList(1)}
            onPageChange={fetchList}
            onEdit={openEditRoute}
            onDelete={(uuid) => {
              void removeInbound(uuid);
            }}
          />
        ) : (
          <LogisticInboundForm
            form={form}
            suppliers={suppliers}
            warehouses={warehouses}
            itemOptions={itemOptions}
            itemOptionMap={itemOptionMap}
            detailSummary={detailSummary}
            currentUserId={currentUserId}
            isAdminRole={isAdminRole}
            lockedWarehouseId={lockedWarehouseId}
            editingUuid={editingUuid}
            submitting={submitting}
            loadingOptions={loadingOptions}
            isItemModalOpen={isItemModalOpen}
            editingDetailIndex={editingDetailIndex}
            draftDetail={draftDetail}
            draftItemTotalQty={draftItemTotalQty}
            itemModalError={itemModalError}
            onFormChange={setForm}
            onSubmit={() => {
              void saveInbound();
            }}
            onBack={backToList}
            onOpenAddItemModal={openAddItemModal}
            onOpenEditItemModal={openEditItemModal}
            onRemoveDetailRow={removeDetailRow}
            onSetDraftField={setDraftField}
            onSetDraftBatchField={setDraftBatchField}
            onAddDraftBatchRow={addDraftBatchRow}
            onRemoveDraftBatchRow={removeDraftBatchRow}
            onCloseItemModal={closeItemModal}
            onSaveDraftItem={saveDraftItem}
          />
        )}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}
