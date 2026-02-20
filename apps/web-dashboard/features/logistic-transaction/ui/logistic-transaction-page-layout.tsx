'use client';

import { ArrowLeft, Plus, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { type DeliveryOrderForm } from '@/features/logistic-transaction/model/types';
import { LogisticTransactionItemDialog } from '@/features/logistic-transaction/ui/logistic-transaction-item-dialog';
import { LogisticTransactionItemListPanel } from '@/features/logistic-transaction/ui/logistic-transaction-item-list-panel';
import { LogisticTransactionListPanel } from '@/features/logistic-transaction/ui/logistic-transaction-list-panel';
import { LogisticTransactionOrderInfoPanel } from '@/features/logistic-transaction/ui/logistic-transaction-order-info-panel';
import { LogisticTransactionSummaryPanels } from '@/features/logistic-transaction/ui/logistic-transaction-summary-panels';
import { type useLogisticTransactionPageController } from '@/features/logistic-transaction/hooks/use-logistic-transaction-page-controller';

type Controller = ReturnType<typeof useLogisticTransactionPageController>;

interface LogisticTransactionPageLayoutProps {
  controller: Controller;
}

export function LogisticTransactionPageLayout({ controller }: LogisticTransactionPageLayoutProps) {
  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Logistic Outbound - Delivery Order</ToolbarPageTitle>
          <ToolbarDescription>
            Kelola proses logistic outbound: dokumen DO, pengiriman per batch, monitoring SLA kirim, dan pengembalian
            dokumen.
          </ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          {!controller.showForm ? (
            <>
              <Button
                onClick={() => {
                  if (controller.isOutboundRoute) {
                    controller.router.push('/app/logistic/outbound/add');
                    return;
                  }
                  controller.openCreateForm();
                }}
              >
                <Plus />
                Add DO
              </Button>
              <Button variant="outline" onClick={() => void controller.fetchList(controller.page)} disabled={controller.loading}>
                <RefreshCw />
                Refresh
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={controller.closeForm}>
              <ArrowLeft />
              Back to List
            </Button>
          )}
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!controller.showForm ? (
          <LogisticTransactionListPanel
            items={controller.items}
            loading={controller.loading}
            search={controller.search}
            statusFilter={controller.statusFilter}
            page={controller.page}
            limit={controller.limit}
            totalPages={controller.totalPages}
            totalItems={controller.totalItems}
            deliveryAction={controller.outboundStatusActions.deliveryAction}
            deliveredAction={controller.outboundStatusActions.deliveredAction}
            completedAction={controller.outboundStatusActions.completedAction}
            deliverySubmittingId={controller.outboundStatusActions.deliverySubmittingId}
            deliveredSubmittingId={controller.outboundStatusActions.deliveredSubmittingId}
            completedSubmittingId={controller.outboundStatusActions.completedSubmittingId}
            setDeliveryAction={controller.outboundStatusActions.setDeliveryAction}
            setDeliveredAction={controller.outboundStatusActions.setDeliveredAction}
            setCompletedAction={controller.outboundStatusActions.setCompletedAction}
            onSetToDelivery={() => {
              void controller.outboundStatusActions.setToDelivery();
            }}
            onSetToDelivered={() => {
              void controller.outboundStatusActions.setToDelivered();
            }}
            onSetToCompleted={() => {
              void controller.outboundStatusActions.setToCompleted();
            }}
            onSearchChange={controller.setSearch}
            onStatusFilterChange={controller.setStatusFilter}
            onSearchSubmit={() => {
              void controller.fetchList(1);
            }}
            onSearchReset={() => {
              controller.setSearch('');
              void controller.fetchList(1);
            }}
            onPageChange={(nextPage) => {
              void controller.fetchList(nextPage);
            }}
            onEditRow={(rowId, item) => {
              if (controller.isOutboundRoute) {
                const ref = controller.buildEntityRef(rowId, item.createdAt);
                controller.router.push(`/app/logistic/outbound/update?ref=${encodeURIComponent(ref)}`);
                return;
              }
              void controller.openEditForm(rowId);
            }}
            onDeleteRow={(rowId) => {
              void controller.remove(rowId);
            }}
          />
        ) : (
          <form
            onSubmit={(event) => {
              void controller.upsert(event);
            }}
            className="space-y-5"
          >
            <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
              <div className="space-y-5">
                <LogisticTransactionOrderInfoPanel
                  form={controller.form}
                  buOptions={controller.buOptions}
                  customers={controller.customers}
                  warehouses={controller.warehouses}
                  cities={controller.cities}
                  lockedWarehouseId={controller.lockedWarehouseId}
                  onDoNumberChange={(value) => controller.setForm((state) => ({ ...state, doNumber: value }))}
                  onBuChange={(value) => controller.setForm((state) => ({ ...state, bu: value }))}
                  onDoDateChange={(value) => controller.setForm((state) => ({ ...state, doDate: value }))}
                  onDoReceivedDateChange={(value) => controller.setForm((state) => ({ ...state, doReceivedDate: value }))}
                  onCustomerChange={(value) =>
                    controller.setForm((state) => {
                      const normalizedCustomerId = controller.toEntityId(value);
                      const nextState: DeliveryOrderForm = {
                        ...state,
                        customerId: normalizedCustomerId,
                      };
                      if (controller.editingUuid) {
                        return nextState;
                      }

                      const defaults = controller.resolveDefaultByCustomer(normalizedCustomerId);
                      if (!defaults) {
                        return nextState;
                      }

                      return {
                        ...nextState,
                        destinationCityId: defaults.destinationCityId,
                        stdLeadTimeDays: defaults.stdLeadTimeDays,
                        stdReturnDoDays: defaults.stdReturnDoDays,
                      };
                    })
                  }
                  onWarehouseChange={(value) =>
                    controller.setForm((state) => ({
                      ...state,
                      warehouseId: controller.lockedWarehouseId || controller.toEntityId(value),
                    }))
                  }
                  onDestinationCityChange={(value) =>
                    controller.setForm((state) => ({
                      ...state,
                      destinationCityId: controller.toEntityId(value),
                    }))
                  }
                  onNotesChange={(value) => controller.setForm((state) => ({ ...state, notes: value }))}
                />
              </div>

              <LogisticTransactionSummaryPanels form={controller.form} summary={controller.summary} />

              <LogisticTransactionItemListPanel
                details={controller.form.details}
                itemOptionMap={controller.itemOptionMap}
                getAutoQtyPcs={controller.getAutoQtyPcs}
                onAddItem={controller.openAddItemModal}
                onEditItem={(index) => {
                  void controller.openEditItemModal(index);
                }}
                onRemoveItem={controller.removeDetailRow}
              />
            </div>

            <LogisticTransactionItemDialog
              open={controller.isItemModalOpen}
              editingDetailIndex={controller.editingDetailIndex}
              draftDetail={controller.draftDetail}
              draftItemId={controller.draftItemId}
              draftItemTotalPcs={controller.draftItemTotalPcs}
              itemModalError={controller.itemModalError}
              itemOptions={controller.itemOptions}
              formDetails={controller.form.details}
              batchOptionsByItemId={controller.batchOptionsByItemId}
              onClose={controller.closeItemModal}
              onSave={controller.saveDraftItem}
              onSetDraftItemId={(value) => {
                void controller.setDraftItemId(value);
              }}
              onSetDraftField={controller.setDraftField}
              onSetDraftBatchNumbers={controller.setDraftBatchNumbers}
              onSetDraftBatchQty={controller.setDraftBatchQty}
              getBatchQtyPcs={controller.getBatchQtyPcs}
              getSelectedBatchQtyPcs={controller.getSelectedBatchQtyPcs}
            />

            {controller.error ? (
              <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">{controller.error}</p>
            ) : null}

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={controller.closeForm}>
                <ArrowLeft />
                Cancel
              </Button>
              <Button type="submit" disabled={controller.submitting || controller.loadingOptions}>
                <Save />
                {controller.submitting ? 'Saving...' : controller.editingUuid ? 'Update Delivery Order' : 'Create Delivery Order'}
              </Button>
            </div>
          </form>
        )}

        {controller.error && !controller.showForm ? (
          <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600">{controller.error}</p>
        ) : null}
      </div>
    </div>
  );
}
