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

type MenuListResponse = {
  success?: boolean;
  message?: string;
  data?: AdministratorMenu[];
  meta?: {
    page?: number;
    totalPages?: number;
    total?: number;
  };
};

type MenuMutationResponse = {
  success?: boolean;
  message?: string;
};

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
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [parentOptions, setParentOptions] = useState<Array<{ value: string; label: string }>>([]);

  const token = useMemo(() => getClientToken(), []);
  const headers = useMemo(() => buildAuthHeader(token), [token]);

  const fetchList = useCallback(
    async (targetPage = page, targetLimit = limit) => {
      const safePage = typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0 ? targetPage : 1;

      setLoading(true);
      setError('');
      try {
        const query = new URLSearchParams({
          page: String(safePage),
          limit: String(targetLimit),
          includeInactive: 'true',
        });

        if (search.trim()) {
          query.set('search', search.trim());
        }
        if (parentFilter !== 'all') {
          query.set('parentId', parentFilter);
        }

        const response = await fetch(`/api/menus?${query.toString()}`, {
          cache: 'no-store',
          headers,
        });
        const payload = (await response.json().catch(() => null)) as MenuListResponse | null;

        if (!response.ok || !payload?.success) {
          throw new Error(payload?.message || 'Failed to load menu data');
        }

        setItems(Array.isArray(payload.data) ? payload.data : []);
        setPage(typeof payload.meta?.page === 'number' ? payload.meta.page : safePage);
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
      const response = await fetch('/api/menus?page=1&limit=100&includeInactive=true', {
        cache: 'no-store',
        headers,
      });
      const payload = (await response.json().catch(() => null)) as MenuListResponse | null;
      if (!response.ok || !payload?.success) {
        setParentOptions([]);
        return;
      }

      const options = (Array.isArray(payload.data) ? payload.data : []).map((item) => ({
        value: String(item.id),
        label: `${item.title} (${item.key})`,
      }));
      setParentOptions(options);
    } catch {
      setParentOptions([]);
    }
  }, [headers]);

  useEffect(() => {
    fetchList(1);
    fetchParentOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    if (!isAddRoute || showForm) {
      return;
    }

    setEditingId(null);
    setForm(initialAdministratorMenuForm);
    setShowForm(true);
  }, [isAddRoute, showForm]);

  useEffect(() => {
    if (!isUpdateRoute || !updateId || showForm) {
      return;
    }

    const id = Number(updateId);
    if (!Number.isInteger(id)) {
      return;
    }

    const item = items.find((row) => row.id === id);
    if (!item) {
      return;
    }

    onEdit(item);
  }, [isUpdateRoute, items, onEdit, showForm, updateId]);

  const submitForm = useCallback(async () => {
    setSubmitting(true);
    setError('');

    try {
      const payload: Record<string, unknown> = {
        key: form.key.trim(),
        title: form.title.trim(),
        type: form.type.trim(),
        parentId: form.parentId ? Number(form.parentId) : null,
        sortOrder: Number(form.sortOrder || 0),
        isVisible: form.isVisible,
        isActive: form.isActive,
      };

      if (form.path.trim()) {
        payload.path = form.path.trim();
      } else if (editingId) {
        payload.path = null;
      }

      if (form.icon.trim()) {
        payload.icon = form.icon.trim();
      } else if (editingId) {
        payload.icon = null;
      }

      if (form.permissionName.trim()) {
        payload.permissionName = form.permissionName.trim();
      } else if (editingId) {
        payload.permissionName = null;
      }

      const endpoint = editingId ? `/api/menus/${editingId}` : '/api/menus';
      const method = editingId ? 'PATCH' : 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(headers ?? {}),
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as MenuMutationResponse | null;
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || 'Failed to save menu');
      }

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
        const response = await fetch(`/api/menus/${id}`, {
          method: 'DELETE',
          headers,
        });
        const result = (await response.json().catch(() => null)) as MenuMutationResponse | null;
        if (!response.ok || !result?.success) {
          throw new Error(result?.message || 'Failed to delete menu');
        }

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
    () => [
      { value: 'all', label: 'All Parent' },
      { value: 'null', label: 'No Parent' },
      ...parentOptions,
    ],
    [parentOptions],
  );


  const changeLimit = useCallback((nextLimit: number) => {
    if (!PAGE_LIMIT_OPTIONS.includes(nextLimit as (typeof PAGE_LIMIT_OPTIONS)[number])) {
      return;
    }
    setLimit(nextLimit);
    setPage(1);
    void fetchList(1, nextLimit);
  }, [fetchList]);

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
    error,
    page,
    limit,
    changeLimit,
    totalPages,
    totalItems,
    parentSelectOptions,
    parentFilterOptions,
    fetchList,
    openAddForm,
    backToList,
    openEditRoute,
    onDelete,
    submitForm,
  };
}
