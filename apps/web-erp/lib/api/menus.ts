// Fetch ERP menus accessible to the current user (role-filtered, cookie-authed).
// Endpoint: GET /sys-menus/my-menus — returns a tree of ErpMenu nodes.

import { apiGet } from './client';
import type { ApiResponse } from './types';
import type { IconName } from '@/components/ui/icons';
import type { NavItem, NavLeaf } from '@/lib/nav';

// ─── API shape ────────────────────────────────────────────────────────────────

interface ApiMenuNode {
  id: string;
  code: string;
  title: string;
  path: string | null;
  icon: string | null;
  type: 'MODULE' | 'GROUP' | 'ITEM';
  parentId: string | null;
  sortOrder: number;
  children: ApiMenuNode[];
}

// ─── Mapping ──────────────────────────────────────────────────────────────────

function toLeaf(node: ApiMenuNode): NavLeaf {
  return {
    id: node.path ?? node.code,
    label: node.title,
    code: node.code,
  };
}

function toNavItem(node: ApiMenuNode): NavItem {
  if (node.children.length > 0) {
    return {
      id: node.code,
      icon: (node.icon as IconName) ?? undefined,
      label: node.title,
      children: node.children.map(toLeaf),
    };
  }
  // Top-level leaf (rare in MVP)
  return {
    id: node.path ?? node.code,
    icon: (node.icon as IconName) ?? undefined,
    label: node.title,
  };
}

export function apiMenuNodesToNavItems(nodes: ApiMenuNode[]): NavItem[] {
  return nodes.map(toNavItem);
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchMyMenus(): Promise<NavItem[]> {
  const response = await apiGet<ApiResponse<ApiMenuNode[]>>('/sys-menus/my-menus');
  return apiMenuNodesToNavItems(response.data);
}
