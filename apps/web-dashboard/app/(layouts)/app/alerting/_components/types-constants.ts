export const moduleOptions = ['All Modules', 'Sales', 'Finance', 'Warehouse', 'Purchasing'] as const;
export const internalUserOptions = [
  'Finance Manager',
  'Warehouse Supervisor',
  'Sales Manager',
  'Procurement Analyst',
] as const;

export type ModuleOption = (typeof moduleOptions)[number];
export type InternalUserOption = (typeof internalUserOptions)[number];
