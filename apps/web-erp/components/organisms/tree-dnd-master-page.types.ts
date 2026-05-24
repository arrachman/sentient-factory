/**
 * Shared types for tree-dnd-master-page organism. Extracted to avoid
 * circular import between helpers and the main component module.
 */

import type * as React from 'react';
import type { FormErrors } from '@/lib/form-validation';
import type { TreeDndExtraColumn } from './tree-dnd-row';

export type TreeNodeType = 'MODULE' | 'GROUP' | 'ITEM';

export interface TreeRow {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  parentId: string | null;
  sortOrder: number;
  type: TreeNodeType;
}

export interface TreeDndMasterPageProps<T extends TreeRow, F> {
  title: string;
  entityLabel: string;
  auditEntityName: string;
  loadAll: () => Promise<T[]>;
  create: (payload: any) => Promise<T>;
  update: (id: string, payload: any) => Promise<T>;
  remove: (id: string) => Promise<void>;
  reorder: (
    items: { id: string; parentId: string | null; sortOrder: number }[],
  ) => Promise<{ affected: number }>;
  defaultForm: () => F;
  fromRecord: (row: T) => F;
  toPayload: (form: F) => any;
  FormFields: React.ComponentType<{
    data: F;
    onChange: (d: F) => void;
    errors?: FormErrors<F>;
  }>;
  validate?: (form: F) => FormErrors<F>;
  extraColumns?: TreeDndExtraColumn<T>[];
}
