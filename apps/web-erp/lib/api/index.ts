// Senti ERP API client — public surface
// Re-exports from types, client, auth, and resource modules

export type {
  ApiError,
  ApiResponse,
  PaginatedMeta,
  PaginatedResponse,
  PaginationParams,
} from './types';

export { ErpApiError, apiGet, apiPost, apiPatch, apiDelete } from './client';

export type { ErpAuthUser } from './auth';
export { login, logout, getMe } from './auth';

// F2 Admin resources
export type {
  ErpUser,
  ErpUserLevel,
  CreateUserPayload,
  UpdateUserPayload,
} from './users';
export { listUsers, createUser, updateUser, deleteUser } from './users';

export type {
  ErpRole,
  CreateRolePayload,
  UpdateRolePayload,
} from './roles';
export { listRoles, createRole, updateRole, deleteRole } from './roles';

export type {
  ErpBranch,
  CreateBranchPayload,
  UpdateBranchPayload,
} from './branches';
export {
  listBranches,
  createBranch,
  updateBranch,
  deleteBranch,
} from './branches';

export type { ErpSetting } from './settings';
export { getSettings, updateSetting } from './settings';

// F3 Master Data resources
export type {
  ErpItem,
  ErpItemType,
  CreateItemPayload,
  UpdateItemPayload,
} from './items';
export { listItems, createItem, updateItem, deleteItem } from './items';

export type {
  ErpUnit,
  CreateUnitPayload,
  UpdateUnitPayload,
} from './units';
export { listUnits, createUnit, updateUnit, deleteUnit } from './units';

export type {
  ErpPartner,
  CreatePartnerPayload,
  UpdatePartnerPayload,
} from './partners';
export {
  listPartners,
  createPartner,
  updatePartner,
  deletePartner,
} from './partners';

export type {
  ErpItemCategory,
  CreateItemCategoryPayload,
  UpdateItemCategoryPayload,
} from './item-categories';
export {
  listItemCategories,
  createItemCategory,
  updateItemCategory,
  deleteItemCategory,
} from './item-categories';
