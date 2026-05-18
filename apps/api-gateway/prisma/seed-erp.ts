import { PrismaClient, ErpUserLevel, ErpMenuType, ErpNumberingReset } from '@prisma/client';
import { pbkdf2Sync, randomBytes } from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const iterations = 210000;
  const digest = 'sha512';
  const derived = pbkdf2Sync(password, salt, iterations, 64, digest);
  return `pbkdf2$v1$${digest}$${iterations}$${salt.toString('base64')}$${derived.toString('base64')}`;
}

async function seedLanguages() {
  await prisma.erpLanguage.upsert({
    where: { code: 'id' },
    create: { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', isDefault: true },
    update: {},
  });
  await prisma.erpLanguage.upsert({
    where: { code: 'en' },
    create: { code: 'en', name: 'English', nativeName: 'English', isDefault: false },
    update: {},
  });
  console.log('✓ sys_languages');
}

async function seedSettings() {
  const settings = [
    { module: 'system', group: 'company', key: 'name', name: 'Company Name', value: 'PT Sentient Factory', dataType: 'string' },
    { module: 'system', group: 'company', key: 'currency', name: 'Base Currency', value: 'IDR', dataType: 'string' },
    { module: 'system', group: 'general', key: 'timezone', name: 'Default Timezone', value: 'Asia/Jakarta', dataType: 'string' },
    { module: 'system', group: 'general', key: 'date_format', name: 'Date Format', value: 'DD/MM/YYYY', dataType: 'string' },
    { module: 'system', group: 'general', key: 'number_format', name: 'Number Format', value: '1.000,00', dataType: 'string' },
    { module: 'system', group: 'fiscal', key: 'year_start_month', name: 'Fiscal Year Start Month', value: '1', dataType: 'number' },
    { module: 'inventory', group: 'costing', key: 'method', name: 'Costing Method', value: 'AVG', dataType: 'string' },
  ];
  for (const s of settings) {
    await prisma.erpSetting.upsert({
      where: { module_group_key: { module: s.module, group: s.group, key: s.key } },
      create: s,
      update: {},
    });
  }
  console.log('✓ sys_settings');
}

async function seedCurrency() {
  await prisma.erpCurrency.upsert({
    where: { code: 'IDR' },
    create: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', isActive: true },
    update: {},
  });
  console.log('✓ md_currencies');
}

async function seedBranch() {
  await prisma.erpBranch.upsert({
    where: { code: 'HQ' },
    create: { code: 'HQ', name: 'Head Quarter', isActive: true },
    update: {},
  });
  console.log('✓ md_branches');
}

async function seedPasswordPolicy() {
  await prisma.erpPasswordPolicy.upsert({
    where: { code: 'DEFAULT' },
    create: {
      code: 'DEFAULT',
      name: 'Default Policy',
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSymbol: false,
      historyCount: 3,
      maxFailedAttempts: 5,
      lockoutDurationMin: 30,
      sessionTimeoutMin: 480,
      isDefault: true,
      isActive: true,
    },
    update: {},
  });
  console.log('✓ adm_password_policies');
}

async function seedMenus(): Promise<Map<string, bigint>> {
  const menuIds = new Map<string, bigint>();

  const m0 = await prisma.erpMenu.upsert({
    where: { code: 'M0' },
    create: { code: 'M0', title: 'Administrator', type: ErpMenuType.MODULE, sortOrder: 1, isActive: true },
    update: {},
  });
  menuIds.set('M0', m0.id);

  const admGrp = await prisma.erpMenu.upsert({
    where: { code: 'M0.ADM' },
    create: { code: 'M0.ADM', title: 'Administration', type: ErpMenuType.GROUP, parentId: m0.id, sortOrder: 1, isActive: true },
    update: {},
  });
  menuIds.set('M0.ADM', admGrp.id);

  const admItems = [
    { code: 'M0.ADM.USERS', title: 'User Management', path: '/admin/users', sortOrder: 1 },
    { code: 'M0.ADM.ROLES', title: 'Role Management', path: '/admin/roles', sortOrder: 2 },
    { code: 'M0.ADM.PERMISSIONS', title: 'Permissions', path: '/admin/permissions', sortOrder: 3 },
    { code: 'M0.ADM.MENUS', title: 'Menu Management', path: '/admin/menus', sortOrder: 4 },
  ];
  for (const item of admItems) {
    const m = await prisma.erpMenu.upsert({
      where: { code: item.code },
      create: { code: item.code, title: item.title, path: item.path, type: ErpMenuType.ITEM, parentId: admGrp.id, sortOrder: item.sortOrder, isActive: true },
      update: {},
    });
    menuIds.set(item.code, m.id);
  }

  const sysGrp = await prisma.erpMenu.upsert({
    where: { code: 'M0.SYS' },
    create: { code: 'M0.SYS', title: 'System', type: ErpMenuType.GROUP, parentId: m0.id, sortOrder: 2, isActive: true },
    update: {},
  });
  menuIds.set('M0.SYS', sysGrp.id);

  const sysItems = [
    { code: 'M0.SYS.SETTINGS', title: 'Settings', path: '/admin/settings', sortOrder: 1 },
    { code: 'M0.SYS.DOCNUM', title: 'Document Numbering', path: '/admin/document-numbering', sortOrder: 2 },
    { code: 'M0.SYS.FISCAL', title: 'Fiscal Periods', path: '/admin/fiscal-periods', sortOrder: 3 },
    { code: 'M0.SYS.AUDIT', title: 'Audit Log', path: '/admin/audit-logs', sortOrder: 4 },
  ];
  for (const item of sysItems) {
    const m = await prisma.erpMenu.upsert({
      where: { code: item.code },
      create: { code: item.code, title: item.title, path: item.path, type: ErpMenuType.ITEM, parentId: sysGrp.id, sortOrder: item.sortOrder, isActive: true },
      update: {},
    });
    menuIds.set(item.code, m.id);
  }

  const m1 = await prisma.erpMenu.upsert({
    where: { code: 'M1' },
    create: { code: 'M1', title: 'Master Data', type: ErpMenuType.MODULE, sortOrder: 2, isActive: true },
    update: {},
  });
  menuIds.set('M1', m1.id);

  const orgGrp = await prisma.erpMenu.upsert({
    where: { code: 'M1.ORG' },
    create: { code: 'M1.ORG', title: 'Organization', type: ErpMenuType.GROUP, parentId: m1.id, sortOrder: 1, isActive: true },
    update: {},
  });
  menuIds.set('M1.ORG', orgGrp.id);

  const orgItems = [
    { code: 'M1.ORG.BRANCH', title: 'Branch', path: '/master/branches', sortOrder: 1 },
    { code: 'M1.ORG.LOCATION', title: 'Location', path: '/master/locations', sortOrder: 2 },
    { code: 'M1.ORG.WAREHOUSE', title: 'Warehouse', path: '/master/warehouses', sortOrder: 3 },
  ];
  for (const item of orgItems) {
    const m = await prisma.erpMenu.upsert({
      where: { code: item.code },
      create: { code: item.code, title: item.title, path: item.path, type: ErpMenuType.ITEM, parentId: orgGrp.id, sortOrder: item.sortOrder, isActive: true },
      update: {},
    });
    menuIds.set(item.code, m.id);
  }

  const itemsGrp = await prisma.erpMenu.upsert({
    where: { code: 'M1.ITEM' },
    create: { code: 'M1.ITEM', title: 'Items', type: ErpMenuType.GROUP, parentId: m1.id, sortOrder: 2, isActive: true },
    update: {},
  });
  menuIds.set('M1.ITEM', itemsGrp.id);

  for (const item of [
    { code: 'M1.ITEM.UNITS', title: 'Units', path: '/master/units', sortOrder: 1 },
    { code: 'M1.ITEM.CATEGORIES', title: 'Item Categories', path: '/master/item-categories', sortOrder: 2 },
    { code: 'M1.ITEM.ITEMS', title: 'Items', path: '/master/items', sortOrder: 3 },
  ]) {
    const m = await prisma.erpMenu.upsert({
      where: { code: item.code },
      create: { code: item.code, title: item.title, path: item.path, type: ErpMenuType.ITEM, parentId: itemsGrp.id, sortOrder: item.sortOrder, isActive: true },
      update: {},
    });
    menuIds.set(item.code, m.id);
  }

  const partnerGrp = await prisma.erpMenu.upsert({
    where: { code: 'M1.PARTNER' },
    create: { code: 'M1.PARTNER', title: 'Partners', type: ErpMenuType.GROUP, parentId: m1.id, sortOrder: 3, isActive: true },
    update: {},
  });
  menuIds.set('M1.PARTNER', partnerGrp.id);

  for (const item of [
    { code: 'M1.PARTNER.PARTNERS', title: 'Partners', path: '/master/partners', sortOrder: 1 },
    { code: 'M1.PARTNER.CATEGORIES', title: 'Partner Categories', path: '/master/partner-categories', sortOrder: 2 },
  ]) {
    const m = await prisma.erpMenu.upsert({
      where: { code: item.code },
      create: { code: item.code, title: item.title, path: item.path, type: ErpMenuType.ITEM, parentId: partnerGrp.id, sortOrder: item.sortOrder, isActive: true },
      update: {},
    });
    menuIds.set(item.code, m.id);
  }

  const finGrp = await prisma.erpMenu.upsert({
    where: { code: 'M1.FIN' },
    create: { code: 'M1.FIN', title: 'Finance Masters', type: ErpMenuType.GROUP, parentId: m1.id, sortOrder: 4, isActive: true },
    update: {},
  });
  menuIds.set('M1.FIN', finGrp.id);

  for (const item of [
    { code: 'M1.FIN.ACCOUNTS', title: 'Chart of Accounts', path: '/master/accounts', sortOrder: 1 },
    { code: 'M1.FIN.CURRENCIES', title: 'Currencies', path: '/master/currencies', sortOrder: 2 },
    { code: 'M1.FIN.TAXES', title: 'Taxes', path: '/master/taxes', sortOrder: 3 },
    { code: 'M1.FIN.TERMS', title: 'Payment Terms', path: '/master/payment-terms', sortOrder: 4 },
  ]) {
    const m = await prisma.erpMenu.upsert({
      where: { code: item.code },
      create: { code: item.code, title: item.title, path: item.path, type: ErpMenuType.ITEM, parentId: finGrp.id, sortOrder: item.sortOrder, isActive: true },
      update: {},
    });
    menuIds.set(item.code, m.id);
  }

  console.log(`✓ sys_menus (${menuIds.size} entries)`);
  return menuIds;
}

async function seedDocumentNumberings() {
  for (const n of [
    { documentCode: 'GRN', name: 'Goods Receipt Note', prefix: 'GRN', digitCount: 6 },
    { documentCode: 'PO', name: 'Purchase Order', prefix: 'PO', digitCount: 6 },
    { documentCode: 'SO', name: 'Sales Order', prefix: 'SO', digitCount: 6 },
    { documentCode: 'INV', name: 'Sales Invoice', prefix: 'INV', digitCount: 6 },
    { documentCode: 'JV', name: 'Journal Voucher', prefix: 'JV', digitCount: 6 },
    { documentCode: 'RCP', name: 'Receipt', prefix: 'RCP', digitCount: 6 },
    { documentCode: 'PAY', name: 'Payment', prefix: 'PAY', digitCount: 6 },
  ]) {
    await prisma.erpDocumentNumbering.upsert({
      where: { documentCode: n.documentCode },
      create: { ...n, resetPolicy: ErpNumberingReset.YEARLY, nextNumber: 1 },
      update: {},
    });
  }
  console.log('✓ sys_document_numberings');
}

async function seedPermissions(): Promise<Map<string, bigint>> {
  const permIds = new Map<string, bigint>();
  for (const p of [
    { code: 'user.read', name: 'View Users', group: 'admin' },
    { code: 'user.create', name: 'Create Users', group: 'admin' },
    { code: 'user.edit', name: 'Edit Users', group: 'admin' },
    { code: 'user.delete', name: 'Delete Users', group: 'admin' },
    { code: 'role.read', name: 'View Roles', group: 'admin' },
    { code: 'role.create', name: 'Create Roles', group: 'admin' },
    { code: 'role.edit', name: 'Edit Roles', group: 'admin' },
    { code: 'role.delete', name: 'Delete Roles', group: 'admin' },
    { code: 'setting.read', name: 'View Settings', group: 'admin' },
    { code: 'setting.edit', name: 'Edit Settings', group: 'admin' },
    { code: 'fiscal.read', name: 'View Fiscal Periods', group: 'admin' },
    { code: 'fiscal.edit', name: 'Edit Fiscal Periods', group: 'admin' },
    { code: 'branch.read', name: 'View Branches', group: 'master' },
    { code: 'branch.create', name: 'Create Branches', group: 'master' },
    { code: 'branch.edit', name: 'Edit Branches', group: 'master' },
    { code: 'branch.delete', name: 'Delete Branches', group: 'master' },
    { code: 'item.read', name: 'View Items', group: 'master' },
    { code: 'item.create', name: 'Create Items', group: 'master' },
    { code: 'item.edit', name: 'Edit Items', group: 'master' },
    { code: 'item.delete', name: 'Delete Items', group: 'master' },
    { code: 'partner.read', name: 'View Partners', group: 'master' },
    { code: 'partner.create', name: 'Create Partners', group: 'master' },
    { code: 'partner.edit', name: 'Edit Partners', group: 'master' },
    { code: 'partner.delete', name: 'Delete Partners', group: 'master' },
    { code: 'account.read', name: 'View Accounts', group: 'finance' },
    { code: 'account.create', name: 'Create Accounts', group: 'finance' },
    { code: 'account.edit', name: 'Edit Accounts', group: 'finance' },
    { code: 'account.delete', name: 'Delete Accounts', group: 'finance' },
    { code: 'currency.read', name: 'View Currencies', group: 'finance' },
    { code: 'currency.edit', name: 'Edit Currencies', group: 'finance' },
    { code: 'tax.read', name: 'View Taxes', group: 'finance' },
    { code: 'tax.create', name: 'Create Taxes', group: 'finance' },
    { code: 'tax.edit', name: 'Edit Taxes', group: 'finance' },
    { code: 'tax.delete', name: 'Delete Taxes', group: 'finance' },
  ]) {
    const perm = await prisma.erpPermission.upsert({
      where: { code: p.code },
      create: p,
      update: {},
    });
    permIds.set(p.code, perm.id);
  }
  console.log(`✓ adm_permissions (${permIds.size} entries)`);
  return permIds;
}

async function seedRoleAndUser(menuIds: Map<string, bigint>, permIds: Map<string, bigint>) {
  const role = await prisma.erpRole.upsert({
    where: { code: 'SUPERADMIN' },
    create: { code: 'SUPERADMIN', name: 'Super Administrator', description: 'Full system access', isActive: true },
    update: {},
  });

  for (const [, permId] of permIds) {
    await prisma.erpRolePermission.upsert({
      where: { roleId_permissionId: { roleId: role.id, permissionId: permId } },
      create: { roleId: role.id, permissionId: permId },
      update: {},
    });
  }

  for (const [, menuId] of menuIds) {
    await prisma.erpRoleMenu.upsert({
      where: { roleId_menuId: { roleId: role.id, menuId } },
      create: {
        roleId: role.id, menuId,
        canView: true, canCreate: true, canEdit: true, canDelete: true,
        canApprove: true, canPrint: true, canExport: true, canImport: true, isFavorite: false,
      },
      update: {},
    });
  }

  const passwordHash = hashPassword('Admin123!');
  const user = await prisma.erpUser.upsert({
    where: { code: 'ADMIN' },
    create: {
      code: 'ADMIN', name: 'Administrator',
      email: 'admin@senti-erp.local',
      passwordHash, level: ErpUserLevel.CENTRAL, language: 'id', isActive: true,
    },
    update: {},
  });

  await prisma.erpUserRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    create: { userId: user.id, roleId: role.id },
    update: {},
  });

  console.log('✓ adm_roles, adm_users, adm_user_roles, adm_role_permissions, adm_role_menus');
}

async function main() {
  console.log('Seeding ERP MVP (m0 + m1)...\n');
  await seedLanguages();
  await seedSettings();
  await seedCurrency();
  await seedBranch();
  await seedPasswordPolicy();
  const menuIds = await seedMenus();
  await seedDocumentNumberings();
  const permIds = await seedPermissions();
  await seedRoleAndUser(menuIds, permIds);
  console.log('\n✅ ERP seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
