'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icons';
import {
  listWorkspaces,
  createWorkspace,
  deleteWorkspace,
  nextWorkspaceId,
  type WorkspaceMeta,
} from '@/lib/workspace';

interface WorkspaceSwitcherProps {
  workspaceId: string;
  workspaceName: string;
  /** Called after creating a new workspace so the parent can re-read state. */
  onWorkspaceChange?: () => void;
}

export function WorkspaceSwitcher({
  workspaceId,
  workspaceName,
  onWorkspaceChange,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [workspaces, setWorkspaces] = React.useState<WorkspaceMeta[]>([]);
  const ref = React.useRef<HTMLDivElement>(null);

  // Load workspace list when dropdown opens.
  React.useEffect(() => {
    if (open) setWorkspaces(listWorkspaces());
  }, [open]);

  // Close on outside click.
  React.useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const navigate = (id: string) => {
    setOpen(false);
    if (id !== workspaceId) router.push(`/${id}`);
  };

  const handleNew = () => {
    const id = nextWorkspaceId();
    createWorkspace(id);
    setOpen(false);
    onWorkspaceChange?.();
    router.push(`/${id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const remaining = workspaces.filter((w) => w.id !== id);
    if (remaining.length === 0) return; // jangan hapus satu-satunya workspace
    deleteWorkspace(id);
    setWorkspaces(remaining);
    if (id === workspaceId) {
      router.push(`/${remaining[0].id}`);
    }
  };

  return (
    <div className="ws-switcher" ref={ref}>
      <button
        className="ws-pill"
        onClick={() => setOpen((o) => !o)}
        title="Ganti workspace"
      >
        <Icon name="layers" size={12} />
        <span className="ws-name">{workspaceName}</span>
        <Icon name="chevdown" size={11} />
      </button>

      {open && (
        <div className="ws-dropdown fade-in">
          <div className="ws-dropdown-hd">Workspace</div>

          {workspaces.map((ws) => (
            <button
              key={ws.id}
              className={`ws-item${ws.id === workspaceId ? ' active' : ''}`}
              onClick={() => navigate(ws.id)}
            >
              <Icon name="layers" size={12} />
              <span className="ws-item-name">{ws.name}</span>
              {ws.id === workspaceId && (
                <span className="ws-item-badge">aktif</span>
              )}
              {workspaces.length > 1 && (
                <button
                  className="ws-item-del"
                  title="Hapus workspace"
                  onClick={(e) => handleDelete(e, ws.id)}
                >
                  <Icon name="x" size={11} />
                </button>
              )}
            </button>
          ))}

          <div className="ws-dropdown-sep" />

          <button className="ws-item ws-item-new" onClick={handleNew}>
            <Icon name="plus" size={12} />
            <span>Buat Workspace</span>
          </button>
        </div>
      )}
    </div>
  );
}
