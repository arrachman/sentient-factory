'use client';

import { Plus, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/components/layouts/app/components/toolbar';
import { useMasterUomPage } from '@/features/master-uom/hooks/use-master-uom-page';
import { MasterUomFormPanel } from '@/features/master-uom/ui/master-uom-form-panel';
import { MasterUomListPanel } from '@/features/master-uom/ui/master-uom-list-panel';

export default function MasterDataUomPage() {
  const router = useRouter();
  const {
    items,
    form,
    setForm,
    editingUuid,
    showForm,
    search,
    setSearch,
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
    openCreate,
    backToList,
    resetSearch,
  } = useMasterUomPage();

  return (
    <div className="container">
      <Toolbar>
        <ToolbarHeading>
          <ToolbarPageTitle>Master Data UOM</ToolbarPageTitle>
          <ToolbarDescription>Manage code, name, and type of UOM.</ToolbarDescription>
        </ToolbarHeading>
        <ToolbarActions>
          <Button onClick={openCreate}>
            <Plus />
            Add UOM
          </Button>
          <Button variant="outline" onClick={() => void fetchList(page)} disabled={loading}>
            <RefreshCw />
            Refresh
          </Button>
        </ToolbarActions>
      </Toolbar>

      <div className="space-y-5">
        {!showForm ? (
          <MasterUomListPanel
            items={items}
            loading={loading}
            search={search}
            page={page}
            limit={limit}
            totalPages={totalPages}
            totalItems={totalItems}
            onSearchChange={setSearch}
            onSearchSubmit={() => {
              void fetchList(1);
            }}
            onSearchReset={resetSearch}
            onEdit={(ref) => {
              router.push(`/app/master/uom/update?ref=${encodeURIComponent(ref)}`);
            }}
            onDelete={(uuid) => {
              void onDelete(uuid);
            }}
            onPageChange={(nextPage) => {
              void fetchList(nextPage);
            }}
          />
        ) : (
          <MasterUomFormPanel
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
