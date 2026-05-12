'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { buildEntityRef, parseEntityRef } from '@/lib/entity-ref';
import {
  type AdministratorMenu,
  type AdministratorMenuFormState,
  initialAdministratorMenuForm,
} from '@/features/administrator-menu/model/types';
import { buildAuthHeader, getClientToken } from '@/shared/auth/token.client';
import {
  batchSortMenus,
  buildBatchSortDiff,
  deleteMenu,
  fetchMenuList,
  fetchParentMenus,
  saveMenu,
} from './use-administrator-menu-api';
import { useAdministratorMenuRouteSync } from './use-administrator-menu-route-sync';

type BatchEditDraft = Record<number, string>;

export function useAdministratorMenuPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAddRoute = pathname === '/app/administrator/menu/add';
  const isUpdateRoute = pathname === '/app/administrator/menu/update';
  const updateIdFromQuery = searchParams.get('id')?.trim() ?? '';
  const updateRef = searchParams.get('ref')?.trim() ?? '';
  const decodedRefId = parseEntityRef(updateRef);
  const updateId = updateIdFromQuery || decodedRefId;

  const [items, setItems] = useState<AdministratorMenu[]>([]);
  const [form, setForm] = useState<AdministratorMenuFormState>(initialAdministratorMenuForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [parentFilter, setParentFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [batchSorting, setBatchSorting] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [parentOptions, setParentOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [sortDrafts, setSortDrafts] = useState<BatchEditDraft>({});
  const [pathDrafts, setPathDrafts] = useState<BatchEditDraft>({});

  const token = useMemo(() => getClientToken(), []);
  const headers = useMemo(() => buildAuthHeader(token), [token]);

  const fetchList = useCallback(
    async (targetPage?: number, targetLimit?: number) => {
      const resolvedPage =
        typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0
          ? targetPage
          : page;
      const resolvedLimit =
        typeof targetLimit === 'number' && Number.isInteger(targetLimit) && targetLimit > 0
          ? targetLimit
          : limit;

      setLoading(true);
      setError('');
      try {
        const payload = await fetchMenuList({
          page: resolvedPage,
          limit: resolvedLimit,
          search,
          parentFilter,
          headers,
        });

        const data = Array.isArray(payload.data) ? payload.data : [];
        setItems(data);
        setSortDrafts(Object.fromEntries(data.map((item) => [item.id, String(item.sortOrder ?? 0)])));
        setPathDrafts(Object.fromEntries(data.map((item) => [item.id, item.path ?? ''])));
        setPage(typeof payload.meta?.page === 'number' ? payload.meta.page : resolvedPage);
        setTotalPages(typeof payload.meta?.totalPages === 'number' ? payload.meta.totalPages : 1);
        setTotalItems(typeof payload.meta?.total === 'number' ? payload.meta.total : 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load menu data');
      } finally {
        setLoading(false);
      }
    },
    [headers, limit, page, parentFilter, search],
  );

  const fetchParentOptions = useCallback(async () => {
    try {
      const payload = await fetchParentMenus(headers);
      if (!payload) {
        setParentOptions([]);
        return;
      }

      setParentOptions(
        (Array.isArray(payload.data) ? payload.data : [])
          .filter((item) => item.parentId === null)
          .map((item) => ({ value: String(item.id), label: `${item.title} (${item.key})` })),
      );
    } catch {
      setParentOptions([]);
    }
  }, [headers]);

  useEffect(() => {
    fetchList(1);
    fetchParentOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void fetchList(1, limit);
  }, [search, parentFilter, limit]);

  const openAddForm = useCallback(() => {
    setEditingId(null);
    setForm(initialAdministratorMenuForm);
    setShowForm(true);
    router.push('/app/administrator/menu/add');
  }, [router]);

  const backToList = useCallback(() => {
    setEditingId(null);
    setForm(initialAdministratorMenuForm);
    setShowForm(false);
    router.push('/app/administrator/menu');
  }, [router]);

  const onEdit = useCallback((item: AdministratorMenu) => {
    setEditingId(String(item.id));
    setShowForm(true);
    setForm({
      key: item.key ?? '',
      title: item.title ?? '',
      path: item.path ?? '',
      icon: item.icon ?? '',
      type: item.type ?? 'ITEM',
      parentId: item.parentId ? String(item.parentId) : '',
      sortOrder: String(item.sortOrder ?? 0),
      permissionName: item.permissionName ?? '',
      isVisible: item.isVisible,
      isActive: item.isActive,
    });
  }, []);

  const openEditRoute = useCallback(
    (item: AdministratorMenu) => {
      router.push(
        `/app/administrator/menu/update?ref=${encodeURIComponent(
          buildEntityRef(String(item.id), item.createdAt),
        )}`,
      );
    },
    [router],
  );

  useAdministratorMenuRouteSync({
    isAddRoute,
    isUpdateRoute,
    updateId,
    items,
    showForm,
    headers,
    setShowForm,
    setEditingId,
    setForm,
    setError,
    onEdit,
  });

  const submitForm = useCallback(async () => {
    setSubmitting(true);
    setError('');

    try {
      await saveMenu(form, editingId, headers);

      setForm(initialAdministratorMenuForm);
      setEditingId(null);
      setShowForm(false);
      if (isAddRoute || isUpdateRoute) {
        router.push('/app/administrator/menu');
      }

      await Promise.all([fetchList(page), fetchParentOptions()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save menu');
    } finally {
      setSubmitting(false);
    }
  }, [editingId, fetchList, fetchParentOptions, form, headers, isAddRoute, isUpdateRoute, page, router]);

  const onDelete = useCallback(
    async (id: number) => {
      const ok = window.confirm('Delete this menu?');
      if (!ok) {
        return;
      }

      setError('');
      try {
        await deleteMenu(id, headers);

        if (editingId === String(id)) {
          setEditingId(null);
          setForm(initialAdministratorMenuForm);
          setShowForm(false);
          if (isAddRoute || isUpdateRoute) {
            router.push('/app/administrator/menu');
          }
        }

        await Promise.all([fetchList(page), fetchParentOptions()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete menu');
      }
    },
    [editingId, fetchList, fetchParentOptions, headers, isAddRoute, isUpdateRoute, page, router],
  );

  const parentSelectOptions = useMemo(() => {
    const selectedId = editingId ? Number(editingId) : null;
    const filtered = parentOptions.filter((option) => Number(option.value) !== selectedId);
    return [{ value: '', label: 'No Parent' }, ...filtered];
  }, [editingId, parentOptions]);

  const parentFilterOptions = useMemo(
    () => [{ value: 'all', label: 'All Group' }, ...parentOptions],
    [parentOptions],
  );

  const changeSortDraft = useCallback((id: number, value: string) => {
    setSortDrafts((current) => ({ ...current, [id]: value }));
  }, []);

  const dirtySortCount = useMemo(
    () =>
      items.filter((item) => {
        const sortChanged = String(item.sortOrder ?? 0) !== (sortDrafts[item.id] ?? String(item.sortOrder ?? 0));
        const pathChanged = (item.path ?? '') !== (pathDrafts[item.id] ?? (item.path ?? ''));
        return sortChanged || pathChanged;
      }).length,
    [items, pathDrafts, sortDrafts],
  );

  const resetSortDrafts = useCallback(() => {
    setSortDrafts(Object.fromEntries(items.map((item) => [item.id, String(item.sortOrder ?? 0)])));
    setPathDrafts(Object.fromEntries(items.map((item) => [item.id, item.path ?? ''])));
  }, [items]);

  const changePathDraft = useCallback((id: number, value: string) => {
    setPathDrafts((current) => ({ ...current, [id]: value }));
  }, []);

  const submitBatchSort = useCallback(async () => {
    const changedItems = buildBatchSortDiff(items, sortDrafts, pathDrafts);

    if (changedItems.length === 0) {
      return;
    }

    setBatchSorting(true);
    setError('');
    try {
      await batchSortMenus(changedItems, headers);
      await fetchList(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update menu sort order');
    } finally {
      setBatchSorting(false);
    }
  }, [fetchList, headers, items, page, pathDrafts, sortDrafts]);

  const changeLimit = useCallback(
    (nextLimit: number) => {
      if (!PAGE_LIMIT_OPTIONS.includes(nextLimit as (typeof PAGE_LIMIT_OPTIONS)[number])) {
        return;
      }
      setLimit(nextLimit);
      setPage(1);
      void fetchList(1, nextLimit);
    },
    [fetchList],
  );

  return {
    items,
    form,
    setForm,
    editingId,
    showForm,
    search,
    setSearch,
    parentFilter,
    setParentFilter,
    loading,
    submitting,
    batchSorting,
    error,
    page,
    limit,
    changeLimit,
    totalPages,
    totalItems,
    parentSelectOptions,
    parentFilterOptions,
    pathDrafts,
    sortDrafts,
    dirtySortCount,
    fetchList,
    changePathDraft,
    changeSortDraft,
    openAddForm,
    backToList,
    openEditRoute,
    onDelete,
    resetSortDrafts,
    submitBatchSort,
    submitForm,
  };
}
