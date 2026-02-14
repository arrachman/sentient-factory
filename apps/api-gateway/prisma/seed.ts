// Task B0002: Database Setup & Migration
// This script seeds the database with initial roles, permissions, and a default admin user.

import { PrismaClient } from '@prisma/client';
import { pbkdf2Sync, randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const iterations = 210000;
  const digest = 'sha512';
  const derived = pbkdf2Sync(password, salt, iterations, 64, digest);

  return `pbkdf2$v1$${digest}$${iterations}$${salt.toString('base64')}$${derived.toString('base64')}`;
}

async function main() {
  console.log('Seeding database...');

  // 1. Create permissions
  const permissions = [
    { name: 'user:create', module: 'user', action: 'create', description: 'Create users' },
    { name: 'user:read', module: 'user', action: 'read', description: 'Read users' },
    { name: 'user:update', module: 'user', action: 'update', description: 'Update users' },
    { name: 'user:delete', module: 'user', action: 'delete', description: 'Delete users' },
    { name: 'role:manage', module: 'role', action: 'manage', description: 'Manage roles' },
    {
      name: 'department:manage',
      module: 'department',
      action: 'manage',
      description: 'Manage departments',
    },
    { name: 'audit:view', module: 'audit', action: 'view', description: 'View audit logs' },
  ];

  for (const permData of permissions) {
    await prisma.permission.upsert({
      where: { name: permData.name },
      update: {},
      create: permData,
    });
  }

  // 2. Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'System Administrator', isSystem: true },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: { name: 'manager', description: 'Department Manager', isSystem: false },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user', description: 'Regular User', isSystem: true },
  });

  // 3. Assign Permissions (Admin gets all)
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.uuid, permissionId: permission.uuid } },
      update: {},
      create: { roleId: adminRole.uuid, permissionId: permission.uuid },
    });
  }

  // Manager gets read/update user & dept manage
  const managerPermissions = allPermissions.filter((p) =>
    ['user:read', 'user:update', 'department:manage'].includes(p.name),
  );
  for (const permission of managerPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: managerRole.uuid, permissionId: permission.uuid } },
      update: {},
      create: { roleId: managerRole.uuid, permissionId: permission.uuid },
    });
  }

  // 4. Create Departments
  const rootDepartment = await prisma.department.upsert({
    where: { code: 'root' },
    update: {},
    create: { name: 'Headquarters', code: 'root', description: 'Global HQ' },
  });

  const engineeringDept = await prisma.department.upsert({
    where: { code: 'eng' },
    update: {},
    create: {
      name: 'Engineering',
      code: 'eng',
      description: 'Engineering & Tech',
      parentId: rootDepartment.uuid,
    },
  });

  const hrDept = await prisma.department.upsert({
    where: { code: 'hr' },
    update: {},
    create: {
      name: 'Human Resources',
      code: 'hr',
      description: 'HR & People',
      parentId: rootDepartment.uuid,
    },
  });

  // 5. Create Users
  const passwordHash = await hashPassword('Password123!');

  // Super Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash },
    create: {
      email: 'admin@example.com',
      username: 'admin',
      passwordHash,
      fullName: 'System Administrator',
      isActive: true,
    },
  });

  // Manager Engineering
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager.eng@example.com' },
    update: { passwordHash },
    create: {
      email: 'manager.eng@example.com',
      username: 'manager_eng',
      passwordHash,
      fullName: 'Engineering Manager',
      isActive: true,
    },
  });

  // Staff Engineering
  const staffEng = await prisma.user.upsert({
    where: { email: 'staff.eng@example.com' },
    update: { passwordHash },
    create: {
      email: 'staff.eng@example.com',
      username: 'staff_eng',
      passwordHash,
      fullName: 'Engineering Staff',
      isActive: true,
    },
  });

  // Staff HR
  const staffHr = await prisma.user.upsert({
    where: { email: 'staff.hr@example.com' },
    update: { passwordHash },
    create: {
      email: 'staff.hr@example.com',
      username: 'staff_hr',
      passwordHash,
      fullName: 'HR Staff',
      isActive: true,
    },
  });

  // 6. Assign Roles to Users
  const assignRole = async (userUuid: string, roleUuid: string) => {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: userUuid, roleId: roleUuid } },
      update: {},
      create: { userId: userUuid, roleId: roleUuid },
    });
  };

  await assignRole(adminUser.uuid, adminRole.uuid);
  await assignRole(managerUser.uuid, managerRole.uuid);
  await assignRole(staffEng.uuid, userRole.uuid);
  await assignRole(staffHr.uuid, userRole.uuid);

  // 7. Create Sidebar Menu
  const dashboardMenu = await prisma.menu.upsert({
    where: { key: 'dashboard' },
    update: {
      title: 'Dashboard',
      path: '/app',
      icon: 'LayoutGrid',
      type: 'ITEM',
      sortOrder: 1,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'dashboard',
      title: 'Dashboard',
      path: '/app',
      icon: 'LayoutGrid',
      type: 'ITEM',
      sortOrder: 1,
      isVisible: true,
      isActive: true,
    },
  });

  const administratorMenu = await prisma.menu.upsert({
    where: { key: 'administrator' },
    update: {
      title: 'Administrator',
      path: null,
      icon: 'Shield',
      type: 'GROUP',
      parentId: null,
      sortOrder: 2,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'administrator',
      title: 'Administrator',
      path: null,
      icon: 'Shield',
      type: 'GROUP',
      parentId: null,
      sortOrder: 2,
      isVisible: true,
      isActive: true,
    },
  });

  const administratorUsersMenu = await prisma.menu.upsert({
    where: { key: 'administrator-users' },
    update: {
      title: 'Users',
      path: '/app/administrator/users',
      icon: 'Users',
      type: 'ITEM',
      parentId: administratorMenu.uuid,
      sortOrder: 1,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'administrator-users',
      title: 'Users',
      path: '/app/administrator/users',
      icon: 'Users',
      type: 'ITEM',
      parentId: administratorMenu.uuid,
      sortOrder: 1,
      isVisible: true,
      isActive: true,
    },
  });

  const administratorDepartmentMenu = await prisma.menu.upsert({
    where: { key: 'administrator-department' },
    update: {
      title: 'Department',
      path: '/app/administrator/department',
      icon: 'Building',
      type: 'ITEM',
      parentId: administratorMenu.uuid,
      sortOrder: 2,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'administrator-department',
      title: 'Department',
      path: '/app/administrator/department',
      icon: 'Building',
      type: 'ITEM',
      parentId: administratorMenu.uuid,
      sortOrder: 2,
      isVisible: true,
      isActive: true,
    },
  });

  const administratorPermissionMenu = await prisma.menu.upsert({
    where: { key: 'administrator-permission' },
    update: {
      title: 'Permission',
      path: '/app/administrator/permission',
      icon: 'Key',
      type: 'ITEM',
      parentId: administratorMenu.uuid,
      sortOrder: 3,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'administrator-permission',
      title: 'Permission',
      path: '/app/administrator/permission',
      icon: 'Key',
      type: 'ITEM',
      parentId: administratorMenu.uuid,
      sortOrder: 3,
      isVisible: true,
      isActive: true,
    },
  });

  const administratorSubmenuMenu = await prisma.menu.upsert({
    where: { key: 'administrator-menu' },
    update: {
      title: 'Menu',
      path: '/app/administrator/menu',
      icon: 'LayoutGrid',
      type: 'ITEM',
      parentId: administratorMenu.uuid,
      sortOrder: 4,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'administrator-menu',
      title: 'Menu',
      path: '/app/administrator/menu',
      icon: 'LayoutGrid',
      type: 'ITEM',
      parentId: administratorMenu.uuid,
      sortOrder: 4,
      isVisible: true,
      isActive: true,
    },
  });

  const administratorSessionMenu = await prisma.menu.upsert({
    where: { key: 'administrator-session' },
    update: {
      title: 'Session',
      path: '/app/administrator/session',
      icon: 'Clock',
      type: 'ITEM',
      parentId: administratorMenu.uuid,
      sortOrder: 5,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'administrator-session',
      title: 'Session',
      path: '/app/administrator/session',
      icon: 'Clock',
      type: 'ITEM',
      parentId: administratorMenu.uuid,
      sortOrder: 5,
      isVisible: true,
      isActive: true,
    },
  });

  const administratorAuditlogMenu = await prisma.menu.upsert({
    where: { key: 'administrator-auditlog' },
    update: {
      title: 'Auditlog',
      path: '/app/administrator/auditlog',
      icon: 'FileText',
      type: 'ITEM',
      parentId: administratorMenu.uuid,
      sortOrder: 6,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'administrator-auditlog',
      title: 'Auditlog',
      path: '/app/administrator/auditlog',
      icon: 'FileText',
      type: 'ITEM',
      parentId: administratorMenu.uuid,
      sortOrder: 6,
      isVisible: true,
      isActive: true,
    },
  });

  const masterDataMenu = await prisma.menu.upsert({
    where: { key: 'master-data' },
    update: {
      title: 'Master Data',
      path: null,
      icon: 'Database',
      type: 'GROUP',
      parentId: null,
      sortOrder: 3,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'master-data',
      title: 'Master Data',
      path: null,
      icon: 'Database',
      type: 'GROUP',
      parentId: null,
      sortOrder: 3,
      isVisible: true,
      isActive: true,
    },
  });

  const masterDataContactMenu = await prisma.menu.upsert({
    where: { key: 'master-data-contact' },
    update: {
      title: 'Contact',
      path: '/app/master/contact',
      icon: 'ContactRound',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 1,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'master-data-contact',
      title: 'Contact',
      path: '/app/master/contact',
      icon: 'ContactRound',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 1,
      isVisible: true,
      isActive: true,
    },
  });

  const masterDataDivisionMenu = await prisma.menu.upsert({
    where: { key: 'master-data-division' },
    update: {
      title: 'Division',
      path: '/app/master/division',
      icon: 'Building2',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 2,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'master-data-division',
      title: 'Division',
      path: '/app/master/division',
      icon: 'Building2',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 2,
      isVisible: true,
      isActive: true,
    },
  });

  const masterDataItemMenu = await prisma.menu.upsert({
    where: { key: 'master-data-item' },
    update: {
      title: 'Item',
      path: '/app/master/item',
      icon: 'Package',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 4,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'master-data-item',
      title: 'Item',
      path: '/app/master/item',
      icon: 'Package',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 4,
      isVisible: true,
      isActive: true,
    },
  });

  const masterDataProvinceMenu = await prisma.menu.upsert({
    where: { key: 'master-data-province' },
    update: {
      title: 'Province',
      path: '/app/master/province',
      icon: 'Map',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 5,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'master-data-province',
      title: 'Province',
      path: '/app/master/province',
      icon: 'Map',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 5,
      isVisible: true,
      isActive: true,
    },
  });

  const masterDataCityMenu = await prisma.menu.upsert({
    where: { key: 'master-data-city' },
    update: {
      title: 'City',
      path: '/app/master/city',
      icon: 'MapPin',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 6,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'master-data-city',
      title: 'City',
      path: '/app/master/city',
      icon: 'MapPin',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 6,
      isVisible: true,
      isActive: true,
    },
  });

  const masterDataCitySlaMenu = await prisma.menu.upsert({
    where: { key: 'master-data-city-sla' },
    update: {
      title: 'City SLA',
      path: '/app/master/city-sla',
      icon: 'Clock',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 7,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'master-data-city-sla',
      title: 'City SLA',
      path: '/app/master/city-sla',
      icon: 'Clock',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 7,
      isVisible: true,
      isActive: true,
    },
  });

  const masterDataUomMenu = await prisma.menu.upsert({
    where: { key: 'master-data-uom' },
    update: {
      title: 'UOM',
      path: '/app/master/uom',
      icon: 'Ruler',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 8,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'master-data-uom',
      title: 'UOM',
      path: '/app/master/uom',
      icon: 'Ruler',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 8,
      isVisible: true,
      isActive: true,
    },
  });

  const masterDataWarehouseMenu = await prisma.menu.upsert({
    where: { key: 'master-data-warehouse' },
    update: {
      title: 'Warehouse',
      path: '/app/master/warehouse',
      icon: 'Warehouse',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 9,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'master-data-warehouse',
      title: 'Warehouse',
      path: '/app/master/warehouse',
      icon: 'Warehouse',
      type: 'ITEM',
      parentId: masterDataMenu.uuid,
      sortOrder: 9,
      isVisible: true,
      isActive: true,
    },
  });

  await prisma.menu.updateMany({
    where: {
      key: { in: ['master-data-customer', 'master-data-supplier', 'master-data-company'] },
    },
    data: {
      isVisible: false,
      isActive: false,
      updatedBy: 'seed',
    },
  });

  const logisticMenu = await prisma.menu.upsert({
    where: { key: 'logistic' },
    update: {
      title: 'Logistic',
      path: null,
      icon: 'Truck',
      type: 'GROUP',
      parentId: null,
      sortOrder: 4,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'logistic',
      title: 'Logistic',
      path: null,
      icon: 'Truck',
      type: 'GROUP',
      parentId: null,
      sortOrder: 4,
      isVisible: true,
      isActive: true,
    },
  });

  const logisticOutboundMenu = await prisma.menu.upsert({
    where: { key: 'logistic-outbound' },
    update: {
      title: 'Outbound',
      path: '/app/logistic/outbound',
      icon: 'ArrowRightLeft',
      type: 'ITEM',
      parentId: logisticMenu.uuid,
      sortOrder: 1,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'logistic-outbound',
      title: 'Outbound',
      path: '/app/logistic/outbound',
      icon: 'ArrowRightLeft',
      type: 'ITEM',
      parentId: logisticMenu.uuid,
      sortOrder: 1,
      isVisible: true,
      isActive: true,
    },
  });

  const logisticInboundMenu = await prisma.menu.upsert({
    where: { key: 'logistic-inbound' },
    update: {
      title: 'Inbound',
      path: '/app/logistic/inbound',
      icon: 'ArrowDownToLine',
      type: 'ITEM',
      parentId: logisticMenu.uuid,
      sortOrder: 2,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'logistic-inbound',
      title: 'Inbound',
      path: '/app/logistic/inbound',
      icon: 'ArrowDownToLine',
      type: 'ITEM',
      parentId: logisticMenu.uuid,
      sortOrder: 2,
      isVisible: true,
      isActive: true,
    },
  });

  await prisma.menu.updateMany({
    where: { key: 'logistic-transaction' },
    data: {
      isVisible: false,
      isActive: false,
      updatedBy: 'seed',
    },
  });

  const logisticReportMonitoringDoMenu = await prisma.menu.upsert({
    where: { key: 'logistic-report-monitoring-do' },
    update: {
      title: 'Report Monitoring DO',
      path: '/app/logistic/report-monitoring-do',
      icon: 'ClipboardList',
      type: 'ITEM',
      parentId: logisticMenu.uuid,
      sortOrder: 3,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'logistic-report-monitoring-do',
      title: 'Report Monitoring DO',
      path: '/app/logistic/report-monitoring-do',
      icon: 'ClipboardList',
      type: 'ITEM',
      parentId: logisticMenu.uuid,
      sortOrder: 3,
      isVisible: true,
      isActive: true,
    },
  });

  const logisticReportStockBatchMenu = await prisma.menu.upsert({
    where: { key: 'logistic-report-stock-batch' },
    update: {
      title: 'Report Stock Batch',
      path: '/app/logistic/report-stock-batch',
      icon: 'Boxes',
      type: 'ITEM',
      parentId: logisticMenu.uuid,
      sortOrder: 4,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'logistic-report-stock-batch',
      title: 'Report Stock Batch',
      path: '/app/logistic/report-stock-batch',
      icon: 'Boxes',
      type: 'ITEM',
      parentId: logisticMenu.uuid,
      sortOrder: 4,
      isVisible: true,
      isActive: true,
    },
  });

  const logisticReportStockMutationMenu = await prisma.menu.upsert({
    where: { key: 'logistic-report-stock-mutation' },
    update: {
      title: 'Report Stock Mutation',
      path: '/app/logistic/report-stock-mutation',
      icon: 'Repeat',
      type: 'ITEM',
      parentId: logisticMenu.uuid,
      sortOrder: 5,
      isVisible: true,
      isActive: true,
    },
    create: {
      key: 'logistic-report-stock-mutation',
      title: 'Report Stock Mutation',
      path: '/app/logistic/report-stock-mutation',
      icon: 'Repeat',
      type: 'ITEM',
      parentId: logisticMenu.uuid,
      sortOrder: 5,
      isVisible: true,
      isActive: true,
    },
  });

  const divisions = [
    {
      uuid: 'division-fb',
      code: 'F&B',
      name: 'Food & Beverage',
      description: 'Divisi penjualan makanan dan minuman retail',
      isActive: true,
    },
    {
      uuid: 'division-insti',
      code: 'INSTI',
      name: 'Institution',
      description: 'Divisi penjualan ke institusi/B2B/Horeca',
      isActive: true,
    },
  ] as const;

  for (const division of divisions) {
    await prisma.$executeRaw`
      INSERT INTO public."m1_division" (uuid, code, name, description, is_active, created_by, updated_by, deleted_at, deleted_by)
      VALUES (${division.uuid}, ${division.code}, ${division.name}, ${division.description}, ${division.isActive}, ${'seed'}, ${'seed'}, NULL, NULL)
      ON CONFLICT (code)
      DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        is_active = EXCLUDED.is_active,
        updated_by = EXCLUDED.updated_by,
        deleted_at = NULL,
        deleted_by = NULL;
    `;
  }

  // 7b. Seed Master Data Province & City (Indonesia)
  const indonesiaProvinces = [
    { uuid: 'prov-id-ac', name: 'Aceh', isoCode: 'ID-AC' },
    { uuid: 'prov-id-su', name: 'Sumatera Utara', isoCode: 'ID-SU' },
    { uuid: 'prov-id-sb', name: 'Sumatera Barat', isoCode: 'ID-SB' },
    { uuid: 'prov-id-ri', name: 'Riau', isoCode: 'ID-RI' },
    { uuid: 'prov-id-kr', name: 'Kepulauan Riau', isoCode: 'ID-KR' },
    { uuid: 'prov-id-ja', name: 'Jambi', isoCode: 'ID-JA' },
    { uuid: 'prov-id-ss', name: 'Sumatera Selatan', isoCode: 'ID-SS' },
    { uuid: 'prov-id-bb', name: 'Kepulauan Bangka Belitung', isoCode: 'ID-BB' },
    { uuid: 'prov-id-be', name: 'Bengkulu', isoCode: 'ID-BE' },
    { uuid: 'prov-id-la', name: 'Lampung', isoCode: 'ID-LA' },
    { uuid: 'prov-id-jk', name: 'DKI Jakarta', isoCode: 'ID-JK' },
    { uuid: 'prov-id-jb', name: 'Jawa Barat', isoCode: 'ID-JB' },
    { uuid: 'prov-id-bt', name: 'Banten', isoCode: 'ID-BT' },
    { uuid: 'prov-id-jt', name: 'Jawa Tengah', isoCode: 'ID-JT' },
    { uuid: 'prov-id-yo', name: 'DI Yogyakarta', isoCode: 'ID-YO' },
    { uuid: 'prov-id-ji', name: 'Jawa Timur', isoCode: 'ID-JI' },
    { uuid: 'prov-id-ba', name: 'Bali', isoCode: 'ID-BA' },
    { uuid: 'prov-id-nb', name: 'Nusa Tenggara Barat', isoCode: 'ID-NB' },
    { uuid: 'prov-id-nt', name: 'Nusa Tenggara Timur', isoCode: 'ID-NT' },
    { uuid: 'prov-id-kb', name: 'Kalimantan Barat', isoCode: 'ID-KB' },
    { uuid: 'prov-id-kt', name: 'Kalimantan Tengah', isoCode: 'ID-KT' },
    { uuid: 'prov-id-ks', name: 'Kalimantan Selatan', isoCode: 'ID-KS' },
    { uuid: 'prov-id-ki', name: 'Kalimantan Timur', isoCode: 'ID-KI' },
    { uuid: 'prov-id-ku', name: 'Kalimantan Utara', isoCode: 'ID-KU' },
    { uuid: 'prov-id-sa', name: 'Sulawesi Utara', isoCode: 'ID-SA' },
    { uuid: 'prov-id-go', name: 'Gorontalo', isoCode: 'ID-GO' },
    { uuid: 'prov-id-st', name: 'Sulawesi Tengah', isoCode: 'ID-ST' },
    { uuid: 'prov-id-sr', name: 'Sulawesi Barat', isoCode: 'ID-SR' },
    { uuid: 'prov-id-sn', name: 'Sulawesi Selatan', isoCode: 'ID-SN' },
    { uuid: 'prov-id-sg', name: 'Sulawesi Tenggara', isoCode: 'ID-SG' },
    { uuid: 'prov-id-ma', name: 'Maluku', isoCode: 'ID-MA' },
    { uuid: 'prov-id-mu', name: 'Maluku Utara', isoCode: 'ID-MU' },
    { uuid: 'prov-id-pa', name: 'Papua', isoCode: 'ID-PA' },
    { uuid: 'prov-id-pb', name: 'Papua Barat', isoCode: 'ID-PB' },
    { uuid: 'prov-id-pd', name: 'Papua Barat Daya', isoCode: 'ID-PD' },
    { uuid: 'prov-id-ps', name: 'Papua Selatan', isoCode: 'ID-PS' },
    { uuid: 'prov-id-pt', name: 'Papua Tengah', isoCode: 'ID-PT' },
    { uuid: 'prov-id-pe', name: 'Papua Pegunungan', isoCode: 'ID-PE' },
  ] as const;

  const provinceUuidByIsoCode = new Map<string, string>();
  for (const province of indonesiaProvinces) {
    const rows = await prisma.$queryRaw<{ uuid: string }[]>`
      INSERT INTO public."m1_province" (uuid, name, iso_code, created_by, updated_by, deleted_at, deleted_by)
      VALUES (${province.uuid}, ${province.name}, ${province.isoCode}, ${'seed'}, ${'seed'}, NULL, NULL)
      ON CONFLICT (iso_code)
      DO UPDATE SET
        name = EXCLUDED.name,
        updated_by = EXCLUDED.updated_by,
        deleted_at = NULL,
        deleted_by = NULL
      RETURNING uuid;
    `;
    provinceUuidByIsoCode.set(province.isoCode, rows[0]?.uuid ?? province.uuid);
  }

  const indonesiaCities = [
    { uuid: 'city-id-ac-banda-aceh', provinceIsoCode: 'ID-AC', name: 'Banda Aceh', postalCode: '23111' },
    { uuid: 'city-id-su-medan', provinceIsoCode: 'ID-SU', name: 'Medan', postalCode: '20111' },
    { uuid: 'city-id-sb-padang', provinceIsoCode: 'ID-SB', name: 'Padang', postalCode: '25111' },
    { uuid: 'city-id-ri-pekanbaru', provinceIsoCode: 'ID-RI', name: 'Pekanbaru', postalCode: '28111' },
    { uuid: 'city-id-kr-tanjung-pinang', provinceIsoCode: 'ID-KR', name: 'Tanjung Pinang', postalCode: '29111' },
    { uuid: 'city-id-ja-jambi', provinceIsoCode: 'ID-JA', name: 'Jambi', postalCode: '36111' },
    { uuid: 'city-id-ss-palembang', provinceIsoCode: 'ID-SS', name: 'Palembang', postalCode: '30111' },
    { uuid: 'city-id-bb-pangkalpinang', provinceIsoCode: 'ID-BB', name: 'Pangkalpinang', postalCode: '33111' },
    { uuid: 'city-id-be-bengkulu', provinceIsoCode: 'ID-BE', name: 'Bengkulu', postalCode: '38111' },
    { uuid: 'city-id-la-bandar-lampung', provinceIsoCode: 'ID-LA', name: 'Bandar Lampung', postalCode: '35111' },
    { uuid: 'city-id-jk-jakarta-pusat', provinceIsoCode: 'ID-JK', name: 'Jakarta Pusat', postalCode: '10110' },
    { uuid: 'city-id-jb-bandung', provinceIsoCode: 'ID-JB', name: 'Bandung', postalCode: '40111' },
    { uuid: 'city-id-bt-serang', provinceIsoCode: 'ID-BT', name: 'Serang', postalCode: '42111' },
    { uuid: 'city-id-jt-semarang', provinceIsoCode: 'ID-JT', name: 'Semarang', postalCode: '50111' },
    { uuid: 'city-id-yo-yogyakarta', provinceIsoCode: 'ID-YO', name: 'Yogyakarta', postalCode: '55111' },
    { uuid: 'city-id-ji-surabaya', provinceIsoCode: 'ID-JI', name: 'Surabaya', postalCode: '60111' },
    { uuid: 'city-id-ba-denpasar', provinceIsoCode: 'ID-BA', name: 'Denpasar', postalCode: '80111' },
    { uuid: 'city-id-nb-mataram', provinceIsoCode: 'ID-NB', name: 'Mataram', postalCode: '83111' },
    { uuid: 'city-id-nt-kupang', provinceIsoCode: 'ID-NT', name: 'Kupang', postalCode: '85111' },
    { uuid: 'city-id-kb-pontianak', provinceIsoCode: 'ID-KB', name: 'Pontianak', postalCode: '78111' },
    { uuid: 'city-id-kt-palangka-raya', provinceIsoCode: 'ID-KT', name: 'Palangka Raya', postalCode: '73111' },
    { uuid: 'city-id-ks-banjarmasin', provinceIsoCode: 'ID-KS', name: 'Banjarmasin', postalCode: '70111' },
    { uuid: 'city-id-ki-samarinda', provinceIsoCode: 'ID-KI', name: 'Samarinda', postalCode: '75111' },
    { uuid: 'city-id-ku-tarakan', provinceIsoCode: 'ID-KU', name: 'Tarakan', postalCode: '77111' },
    { uuid: 'city-id-sa-manado', provinceIsoCode: 'ID-SA', name: 'Manado', postalCode: '95111' },
    { uuid: 'city-id-go-gorontalo', provinceIsoCode: 'ID-GO', name: 'Gorontalo', postalCode: '96111' },
    { uuid: 'city-id-st-palu', provinceIsoCode: 'ID-ST', name: 'Palu', postalCode: '94111' },
    { uuid: 'city-id-sr-mamuju', provinceIsoCode: 'ID-SR', name: 'Mamuju', postalCode: '91511' },
    { uuid: 'city-id-sr-polman', provinceIsoCode: 'ID-SR', name: 'Polman', postalCode: '91311' },
    { uuid: 'city-id-sn-makassar', provinceIsoCode: 'ID-SN', name: 'Makassar', postalCode: '90111' },
    { uuid: 'city-id-sn-gowa', provinceIsoCode: 'ID-SN', name: 'Gowa', postalCode: '92111' },
    { uuid: 'city-id-sn-malino', provinceIsoCode: 'ID-SN', name: 'Malino', postalCode: '92174' },
    { uuid: 'city-id-sn-takalar', provinceIsoCode: 'ID-SN', name: 'Takalar', postalCode: '92211' },
    { uuid: 'city-id-sa-airmadidi', provinceIsoCode: 'ID-SA', name: 'Airmadidi', postalCode: '95371' },
    { uuid: 'city-id-sa-amurang', provinceIsoCode: 'ID-SA', name: 'Amurang', postalCode: '95954' },
    { uuid: 'city-id-sg-kendari', provinceIsoCode: 'ID-SG', name: 'Kendari', postalCode: '93111' },
    { uuid: 'city-id-ma-ambon', provinceIsoCode: 'ID-MA', name: 'Ambon', postalCode: '97111' },
    { uuid: 'city-id-mu-ternate', provinceIsoCode: 'ID-MU', name: 'Ternate', postalCode: '97711' },
    { uuid: 'city-id-pa-jayapura', provinceIsoCode: 'ID-PA', name: 'Jayapura', postalCode: '99111' },
    { uuid: 'city-id-pb-manokwari', provinceIsoCode: 'ID-PB', name: 'Manokwari', postalCode: '98311' },
    { uuid: 'city-id-pd-sorong', provinceIsoCode: 'ID-PD', name: 'Sorong', postalCode: '98411' },
    { uuid: 'city-id-ps-merauke', provinceIsoCode: 'ID-PS', name: 'Merauke', postalCode: '99611' },
    { uuid: 'city-id-pt-nabire', provinceIsoCode: 'ID-PT', name: 'Nabire', postalCode: '98811' },
    { uuid: 'city-id-pe-wamena', provinceIsoCode: 'ID-PE', name: 'Wamena', postalCode: '99511' },
  ] as const;

  for (const city of indonesiaCities) {
    const provinceUuid = provinceUuidByIsoCode.get(city.provinceIsoCode);
    if (!provinceUuid) {
      throw new Error(`Province ISO code ${city.provinceIsoCode} was not found while seeding city ${city.name}`);
    }

    await prisma.$executeRaw`
      INSERT INTO public."m1_city" (uuid, province_id, name, postal_code, created_by, updated_by, deleted_at, deleted_by)
      VALUES (${city.uuid}, ${provinceUuid}, ${city.name}, ${city.postalCode}, ${'seed'}, ${'seed'}, NULL, NULL)
      ON CONFLICT (uuid)
      DO UPDATE SET
        province_id = EXCLUDED.province_id,
        name = EXCLUDED.name,
        postal_code = EXCLUDED.postal_code,
        updated_by = EXCLUDED.updated_by,
        deleted_at = NULL,
        deleted_by = NULL;
    `;
  }

  const citySlaSeeds = [
    { cityName: 'Makassar', stdLeadTimeDays: 7, stdReturnDoDays: 1 },
    { cityName: 'Manado', stdLeadTimeDays: 7, stdReturnDoDays: 12 },
  ] as const;

  for (const sla of citySlaSeeds) {
    const city = await prisma.masterDataCity.findFirst({
      where: { name: sla.cityName, deletedAt: null },
      select: { uuid: true },
    });

    if (!city) {
      continue;
    }

    const existingSla = await prisma.$queryRaw<{ uuid: string; deleted_at: Date | null }[]>`
      SELECT uuid, deleted_at
      FROM public."m1_city_sla"
      WHERE city_id = ${city.uuid}
      ORDER BY updated_at DESC
      LIMIT 1
    `;

    if (existingSla.length > 0) {
      await prisma.$executeRaw`
        UPDATE public."m1_city_sla"
        SET std_lead_time_days = ${sla.stdLeadTimeDays},
            std_return_do_days = ${sla.stdReturnDoDays},
            deleted_at = NULL,
            deleted_by = NULL,
            updated_at = CURRENT_TIMESTAMP,
            updated_by = ${'seed'}
        WHERE uuid = ${existingSla[0].uuid}
      `;
      continue;
    }

    await prisma.$executeRaw`
      INSERT INTO public."m1_city_sla" (
        uuid, city_id, std_lead_time_days, std_return_do_days, created_by, updated_by, deleted_at, deleted_by
      )
      VALUES (${`city-sla-${city.uuid}`}, ${city.uuid}, ${sla.stdLeadTimeDays}, ${sla.stdReturnDoDays}, ${'seed'}, ${'seed'}, NULL, NULL)
    `;
  }

  const assignMenuToRole = async (roleUuid: string, menuUuid: string) => {
    await prisma.roleMenu.upsert({
      where: { roleId_menuId: { roleId: roleUuid, menuId: menuUuid } },
      update: { canView: true, deletedAt: null, deletedBy: null },
      create: { roleId: roleUuid, menuId: menuUuid, canView: true },
    });
  };

  await assignMenuToRole(adminRole.uuid, dashboardMenu.uuid);
  await assignMenuToRole(managerRole.uuid, dashboardMenu.uuid);
  await assignMenuToRole(userRole.uuid, dashboardMenu.uuid);
  await assignMenuToRole(adminRole.uuid, administratorMenu.uuid);
  await assignMenuToRole(adminRole.uuid, administratorUsersMenu.uuid);
  await assignMenuToRole(adminRole.uuid, administratorDepartmentMenu.uuid);
  await assignMenuToRole(adminRole.uuid, administratorPermissionMenu.uuid);
  await assignMenuToRole(adminRole.uuid, administratorSubmenuMenu.uuid);
  await assignMenuToRole(adminRole.uuid, administratorSessionMenu.uuid);
  await assignMenuToRole(adminRole.uuid, administratorAuditlogMenu.uuid);
  await assignMenuToRole(adminRole.uuid, masterDataMenu.uuid);
  await assignMenuToRole(adminRole.uuid, masterDataContactMenu.uuid);
  await assignMenuToRole(adminRole.uuid, masterDataDivisionMenu.uuid);
  await assignMenuToRole(adminRole.uuid, masterDataItemMenu.uuid);
  await assignMenuToRole(adminRole.uuid, masterDataProvinceMenu.uuid);
  await assignMenuToRole(adminRole.uuid, masterDataCityMenu.uuid);
  await assignMenuToRole(adminRole.uuid, masterDataCitySlaMenu.uuid);
  await assignMenuToRole(adminRole.uuid, masterDataUomMenu.uuid);
  await assignMenuToRole(adminRole.uuid, masterDataWarehouseMenu.uuid);
  await assignMenuToRole(adminRole.uuid, logisticMenu.uuid);
  await assignMenuToRole(adminRole.uuid, logisticOutboundMenu.uuid);
  await assignMenuToRole(adminRole.uuid, logisticInboundMenu.uuid);
  await assignMenuToRole(adminRole.uuid, logisticReportMonitoringDoMenu.uuid);
  await assignMenuToRole(adminRole.uuid, logisticReportStockBatchMenu.uuid);
  await assignMenuToRole(adminRole.uuid, logisticReportStockMutationMenu.uuid);

  // 8. Assign Departments
  const assignDept = async (userUuid: string, deptUuid: string) => {
    await prisma.userDepartment.upsert({
      where: { userId_departmentId: { userId: userUuid, departmentId: deptUuid } },
      update: {},
      create: { userId: userUuid, departmentId: deptUuid },
    });
  };

  await assignDept(adminUser.uuid, rootDepartment.uuid);
  await assignDept(managerUser.uuid, engineeringDept.uuid);
  await assignDept(staffEng.uuid, engineeringDept.uuid);
  await assignDept(staffHr.uuid, hrDept.uuid);

  // 9. Create Dummy Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: adminUser.uuid,
      action: 'USER_LOGIN',
      entityType: 'AUTH',
      entityId: adminUser.uuid,
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Dummy Seed)',
    },
  });

  console.log('Seeding completed.');
  console.log('------------------------------------------------');
  console.log('Admin:   admin@example.com       (Role: admin, Dept: HQ)');
  console.log('Manager: manager.eng@example.com (Role: manager, Dept: Engineering)');
  console.log('Staff 1: staff.eng@example.com   (Role: user, Dept: Engineering)');
  console.log('Staff 2: staff.hr@example.com    (Role: user, Dept: HR)');
  console.log('Password for all: Password123!');
  console.log('------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
