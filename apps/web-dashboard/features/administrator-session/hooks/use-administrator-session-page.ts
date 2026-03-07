import { useCallback, useEffect, useState } from 'react';
import { MIN_PAGE_LIMIT, PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import {
  deleteSession,
  fetchSessions,
} from '@/features/administrator-session/api/administrator-session.api';
import {
  type AdministratorSession,
  type SessionUser,
} from '@/features/administrator-session/model/types';
import { pickSessionId } from '@/features/administrator-session/model/utils';
import { requestJson } from '@/shared/api/http';

function extractMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useAdministratorSessionPage() {
  const [items, setItems] = useState<AdministratorSession[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(MIN_PAGE_LIMIT);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const currentUserId = currentUser?.id != null ? String(currentUser.id) : '';

  const fetchList = useCallback(
    async (targetPage = page, targetLimit = limit) => {
      const safePage = typeof targetPage === 'number' && Number.isInteger(targetPage) && targetPage > 0 ? targetPage : 1;

      setLoading(true);
      setError('');
      try {
        const result = await fetchSessions({
          page: safePage,
          limit: targetLimit,
          search,
          userId: currentUserId,
        });

        if (!result.success) {
          throw new Error(result.message || 'Failed to load sessions');
        }

        const normalizedItems = (Array.isArray(result.data) ? result.data : []).map((item) => ({
          ...item,
          id: item.id ?? item.uuid,
          uuid: item.uuid ?? item.id,
        }));

        setItems(normalizedItems);
        setPage(typeof result.meta?.page === 'number' ? result.meta.page : safePage);
        setTotalPages(typeof result.meta?.totalPages === 'number' ? result.meta.totalPages : 1);
        setTotalItems(typeof result.meta?.total === 'number' ? result.meta.total : 0);
      } catch (err) {
        setError(extractMessage(err, 'Failed to load sessions'));
      } finally {
        setLoading(false);
      }
    },
    [currentUserId, limit, page, search],
  );

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const result = await requestJson<{ id?: string | number; email?: string; username?: string; fullName?: string | null }>('/api/auth/me');
        if (!result.success || !result.data?.id) {
          throw new Error(result.message || 'Failed to load current user');
        }
        setCurrentUser({
          id: result.data.id,
          email: result.data.email,
          username: result.data.username,
          fullName: result.data.fullName ?? null,
        });
      } catch (err) {
        setError(extractMessage(err, 'Failed to load current user'));
      }
    };

    void fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }
    void fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, fetchList]);

  const onDelete = useCallback(
    async (sessionId: string) => {
      const ok = window.confirm('Delete this session?');
      if (!ok) {
        return;
      }

      setError('');
      try {
        const result = await deleteSession(sessionId);
        if (!result.success) {
          throw new Error(result.message || 'Failed to delete session');
        }

        await fetchList(page);
      } catch (err) {
        setError(extractMessage(err, 'Failed to delete session'));
      }
    },
    [fetchList, page],
  );

  const refreshList = useCallback(async () => {
    await fetchList(page);
  }, [fetchList, page]);

  const applySearch = useCallback(() => {
    setPage(1);
    setSearch(searchInput.trim());
  }, [searchInput]);

  const resetSearch = useCallback(() => {
    setSearchInput('');
    setPage(1);
    setSearch('');
  }, []);

  const changePage = useCallback(
    (nextPage: number) => {
      if (!Number.isInteger(nextPage) || nextPage < 1) {
        return;
      }
      void fetchList(nextPage);
    },
    [fetchList],
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
    currentUser,
    searchInput,
    setSearchInput,
    loading,
    error,
    setError,
    page,
    limit,
    changeLimit,
    totalPages,
    totalItems,
    refreshList,
    applySearch,
    resetSearch,
    changePage,
    onDelete,
  };
}
