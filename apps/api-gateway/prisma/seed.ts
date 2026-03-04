import { PrismaClient } from '@prisma/client';
import { pbkdf2Sync, randomBytes } from 'crypto';

const prisma = new PrismaClient();

type MenuSeed = {
  key: string;
  title: string;
  path: string | null;
  icon: string | null;
  type: 'GROUP' | 'ITEM';
  parentKey: string | null;
  sortOrder: number;
  isVisible?: boolean;
  isActive?: boolean;
  permissionName?: string | null;
};

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const iterations = 210000;
  const digest = 'sha512';
  const derived = pbkdf2Sync(password, salt, iterations, 64, digest);
  return `pbkdf2$v1$${digest}$${iterations}$${salt.toString('base64')}$${derived.toString('base64')}`;
}

async function main() {
  console.log('Seeding database...');

  const passwordHash = await hashPassword('Password123!');

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

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {
        module: perm.module,
        action: perm.action,
        description: perm.description,
        deletedAt: null,
        deletedBy: null,
      },
      create: perm,
    });
  }

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {
      description: 'System Administrator',
      isSystem: true,
      deletedAt: null,
      deletedBy: null,
    },
    create: {
      name: 'admin',
      description: 'System Administrator',
      isSystem: true,
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {
      description: 'Department Manager',
      isSystem: false,
      deletedAt: null,
      deletedBy: null,
    },
    create: {
      name: 'manager',
      description: 'Department Manager',
      isSystem: false,
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {
      description: 'Regular User',
      isSystem: true,
      deletedAt: null,
      deletedBy: null,
    },
    create: {
      name: 'user',
      description: 'Regular User',
      isSystem: true,
    },
  });

  const allPermissions = await prisma.permission.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
  });
  const managerPermissionNames = new Set(['user:read', 'user:update', 'department:manage']);

  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
      update: { deletedAt: null, deletedBy: null },
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
    if (managerPermissionNames.has(perm.name)) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: managerRole.id, permissionId: perm.id } },
        update: { deletedAt: null, deletedBy: null },
        create: { roleId: managerRole.id, permissionId: perm.id },
      });
    }
  }

  const provinceSeeds = [
    { isoCode: 'ID-SU', name: 'Sumatera Utara' },
    { isoCode: 'ID-KS', name: 'Kalimantan Selatan' },
    { isoCode: 'ID-SS', name: 'Sumatera Selatan' },
    { isoCode: 'ID-SN', name: 'Sulawesi Selatan' },
  ];

  const provinceByIso = new Map<string, number>();
  for (const seed of provinceSeeds) {
    const province = await prisma.masterDataProvince.upsert({
      where: { isoCode: seed.isoCode },
      update: {
        name: seed.name,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        isoCode: seed.isoCode,
        name: seed.name,
      },
      select: { id: true },
    });
    provinceByIso.set(seed.isoCode, province.id);
  }

  const citySeeds = [
    { provinceIso: 'ID-SU', name: 'Medan', postalCode: '20111' },
    { provinceIso: 'ID-KS', name: 'Banjarmasin', postalCode: '70111' },
    { provinceIso: 'ID-SS', name: 'Palembang', postalCode: '30111' },
    { provinceIso: 'ID-SN', name: 'Makassar', postalCode: '90111' },
  ];

  const cityByName = new Map<string, number>();
  for (const seed of citySeeds) {
    const provinceId = provinceByIso.get(seed.provinceIso);
    if (!provinceId) {
      throw new Error(`Province not found for ${seed.name}`);
    }
    const existing = await prisma.masterDataCity.findFirst({
      where: { provinceId, name: seed.name },
      select: { id: true },
    });

    const city = existing
      ? await prisma.masterDataCity.update({
          where: { id: existing.id },
          data: {
            postalCode: seed.postalCode,
            deletedAt: null,
            deletedBy: null,
          },
          select: { id: true },
        })
      : await prisma.masterDataCity.create({
          data: {
            provinceId,
            name: seed.name,
            postalCode: seed.postalCode,
          },
          select: { id: true },
        });

    cityByName.set(seed.name, city.id);
  }

  const warehouseSeeds = [
    { name: 'Medan', cityName: 'Medan', locationName: 'Gudang Medan' },
    { name: 'Banjarmasin', cityName: 'Banjarmasin', locationName: 'Gudang Banjarmasin' },
    { name: 'Palembang', cityName: 'Palembang', locationName: 'Gudang Palembang' },
    { name: 'Makasar', cityName: 'Makassar', locationName: 'Gudang Makasar' },
  ];

  const warehouseByName = new Map<string, number>();
  for (const seed of warehouseSeeds) {
    const cityId = cityByName.get(seed.cityName);
    if (!cityId) {
      throw new Error(`City not found for warehouse ${seed.name}`);
    }

    const existing = await prisma.masterDataWarehouse.findFirst({
      where: { name: seed.name, cityId },
      select: { id: true },
    });

    const warehouse = existing
      ? await prisma.masterDataWarehouse.update({
          where: { id: existing.id },
          data: {
            locationName: seed.locationName,
            deletedAt: null,
            deletedBy: null,
          },
          select: { id: true },
        })
      : await prisma.masterDataWarehouse.create({
          data: {
            name: seed.name,
            cityId,
            locationName: seed.locationName,
          },
          select: { id: true },
        });

    warehouseByName.set(seed.name, warehouse.id);
  }

  const uomSeeds = [
    { code: 'PCS', name: 'Pieces', type: 'unit' },
    { code: 'KG', name: 'Kilogram', type: 'weight' },
  ];
  for (const seed of uomSeeds) {
    await prisma.masterDataUom.upsert({
      where: { code: seed.code },
      update: {
        name: seed.name,
        type: seed.type,
        deletedAt: null,
        deletedBy: null,
      },
      create: seed,
    });
  }

  const contactSeeds = [
    {
      code: 'SUP-001',
      name: 'PT Supplier Utama',
      type: 'SUPPLIER',
      city: 'Medan',
      province: 'Sumatera Utara',
      contactFirstName: 'Budi',
      contactEmail: 'supplier.utama@example.com',
      contactPhone: '081200000001',
      address: 'Jl. Industri No. 1, Medan',
      tax: '01.234.567.8-901.000',
    },
    {
      code: 'CUS-001',
      name: 'PT Pelanggan Retail',
      type: 'CUSTOMER',
      city: 'Palembang',
      province: 'Sumatera Selatan',
      contactFirstName: 'Sari',
      contactEmail: 'pelanggan.retail@example.com',
      contactPhone: '081200000002',
      address: 'Jl. Niaga No. 99, Palembang',
      tax: '02.345.678.9-012.000',
    },
  ];

  for (const seed of contactSeeds) {
    await prisma.masterDataContact.upsert({
      where: { code: seed.code },
      update: {
        name: seed.name,
        type: seed.type,
        city: seed.city,
        province: seed.province,
        contactFirstName: seed.contactFirstName,
        contactEmail: seed.contactEmail,
        contactPhone: seed.contactPhone,
        address: seed.address,
        tax: seed.tax,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        code: seed.code,
        name: seed.name,
        type: seed.type,
        city: seed.city,
        province: seed.province,
        contactFirstName: seed.contactFirstName,
        contactEmail: seed.contactEmail,
        contactPhone: seed.contactPhone,
        address: seed.address,
        tax: seed.tax,
      },
    });
  }

  const pcsUom = await prisma.masterDataUom.findUnique({
    where: { code: 'PCS' },
    select: { id: true },
  });
  const kgUom = await prisma.masterDataUom.findUnique({
    where: { code: 'KG' },
    select: { id: true },
  });
  if (!pcsUom || !kgUom) {
    throw new Error('Required UOM seeds (PCS/KG) not found');
  }

  const itemSeeds = [
    {
      code: 'ITEM-001',
      name: 'Gula Pasir Premium 1KG',
      category: 'RAW_MATERIAL',
      itemType: 'RAW',
      uomId: kgUom.id,
    },
    {
      code: 'ITEM-002',
      name: 'Kopi Bubuk 250GR',
      category: 'FINISHED_GOOD',
      itemType: 'FG',
      uomId: pcsUom.id,
    },
  ];

  for (const seed of itemSeeds) {
    await prisma.masterDataItem.upsert({
      where: { code: seed.code },
      update: {
        name: seed.name,
        category: seed.category,
        itemType: seed.itemType,
        uomId: seed.uomId,
        isActive: true,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        code: seed.code,
        name: seed.name,
        category: seed.category,
        itemType: seed.itemType,
        uomId: seed.uomId,
        isActive: true,
      },
    });
  }

  const divisionSeeds = [
    { code: 'FNB', name: 'Food & Beverage', description: 'Retail food and beverage division' },
    { code: 'INSTI', name: 'Institution', description: 'Institution and B2B division' },
  ];
  for (const seed of divisionSeeds) {
    await prisma.masterDataDivision.upsert({
      where: { code: seed.code },
      update: {
        name: seed.name,
        description: seed.description,
        isActive: true,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        ...seed,
        isActive: true,
      },
    });
  }

  const rootDepartment = await prisma.department.upsert({
    where: { code: 'root' },
    update: {
      name: 'Headquarters',
      description: 'Global HQ',
      parentId: null,
      deletedAt: null,
      deletedBy: null,
    },
    create: {
      code: 'root',
      name: 'Headquarters',
      description: 'Global HQ',
    },
    select: { id: true },
  });

  const engineeringDepartment = await prisma.department.upsert({
    where: { code: 'eng' },
    update: {
      name: 'Engineering',
      description: 'Engineering and Technology',
      parentId: rootDepartment.id,
      deletedAt: null,
      deletedBy: null,
    },
    create: {
      code: 'eng',
      name: 'Engineering',
      description: 'Engineering and Technology',
      parentId: rootDepartment.id,
    },
    select: { id: true },
  });

  const hrDepartment = await prisma.department.upsert({
    where: { code: 'hr' },
    update: {
      name: 'Human Resources',
      description: 'Human Resources',
      parentId: rootDepartment.id,
      deletedAt: null,
      deletedBy: null,
    },
    create: {
      code: 'hr',
      name: 'Human Resources',
      description: 'Human Resources',
      parentId: rootDepartment.id,
    },
    select: { id: true },
  });

  const users = [
    {
      email: 'admin@example.com',
      username: 'admin',
      fullName: 'System Administrator',
      role: 'admin',
      departmentId: rootDepartment.id,
      warehouseName: 'Medan',
    },
    {
      email: 'administrator@example.com',
      username: 'administrator',
      fullName: 'Administrator',
      role: 'admin',
      departmentId: rootDepartment.id,
      warehouseName: 'Medan',
    },
    {
      email: 'manager.eng@example.com',
      username: 'manager_eng',
      fullName: 'Engineering Manager',
      role: 'manager',
      departmentId: engineeringDepartment.id,
      warehouseName: 'Medan',
    },
    {
      email: 'staff.eng@example.com',
      username: 'staff_eng',
      fullName: 'Engineering Staff',
      role: 'user',
      departmentId: engineeringDepartment.id,
      warehouseName: 'Medan',
    },
    {
      email: 'staff.hr@example.com',
      username: 'staff_hr',
      fullName: 'HR Staff',
      role: 'user',
      departmentId: hrDepartment.id,
      warehouseName: 'Medan',
    },
  ] as const;

  const roleByName = new Map([
    ['admin', adminRole.id],
    ['manager', managerRole.id],
    ['user', userRole.id],
  ]);

  for (const userSeed of users) {
    const warehouseId = warehouseByName.get(userSeed.warehouseName);
    if (!warehouseId) {
      throw new Error(`Warehouse not found for user ${userSeed.email}`);
    }

    const user = await prisma.user.upsert({
      where: { email: userSeed.email },
      update: {
        username: userSeed.username,
        fullName: userSeed.fullName,
        passwordHash,
        isActive: true,
        warehouseId,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        email: userSeed.email,
        username: userSeed.username,
        fullName: userSeed.fullName,
        passwordHash,
        isActive: true,
        warehouseId,
      },
      select: { id: true, email: true },
    });

    const roleId = roleByName.get(userSeed.role);
    if (!roleId) {
      throw new Error(`Role not found for user ${userSeed.email}`);
    }

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId } },
      update: { deletedAt: null, deletedBy: null },
      create: { userId: user.id, roleId },
    });

    await prisma.userDepartment.upsert({
      where: { userId_departmentId: { userId: user.id, departmentId: userSeed.departmentId } },
      update: { deletedAt: null, deletedBy: null },
      create: { userId: user.id, departmentId: userSeed.departmentId },
    });
  }

  const menuSeeds: MenuSeed[] = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      path: null,
      icon: 'LayoutGrid',
      type: 'COLLAPSE',
      parentKey: null,
      sortOrder: 1,
    },
    {
      key: 'dashboard-overview',
      title: 'Overview',
      path: '/app',
      icon: 'LayoutGrid',
      type: 'ITEM',
      parentKey: 'dashboard',
      sortOrder: 1,
    },
    {
      key: 'dashboard-m1',
      title: 'Dashboard M1',
      path: '/app?domain=m1',
      icon: 'BarChart3',
      type: 'ITEM',
      parentKey: 'dashboard',
      sortOrder: 2,
    },
    {
      key: 'dashboard-m',
      title: 'Dashboard M',
      path: '/app?domain=m',
      icon: 'LineChart',
      type: 'ITEM',
      parentKey: 'dashboard',
      sortOrder: 3,
    },
    {
      key: 'dashboard-m2',
      title: 'Finance & Accounting',
      path: '/app/dashboard/finance-accounting',
      icon: 'Wallet',
      type: 'ITEM',
      parentKey: 'dashboard',
      sortOrder: 4,
    },
    {
      key: 'dashboard-so',
      title: 'Sales',
      path: '/app/dashboard/sales',
      icon: 'TrendingUp',
      type: 'ITEM',
      parentKey: 'dashboard',
      sortOrder: 5,
    },
    {
      key: 'dashboard-m2r',
      title: 'Dashboard M2R',
      path: '/app?domain=m2r',
      icon: 'Activity',
      type: 'ITEM',
      parentKey: 'dashboard',
      sortOrder: 6,
    },
    {
      key: 'administrator',
      title: 'Administrator',
      path: null,
      icon: 'Shield',
      type: 'GROUP',
      parentKey: null,
      sortOrder: 2,
    },
    {
      key: 'administrator-users',
      title: 'Users',
      path: '/app/administrator/users',
      icon: 'Users',
      type: 'ITEM',
      parentKey: 'administrator',
      sortOrder: 1,
    },
    {
      key: 'administrator-department',
      title: 'Department',
      path: '/app/administrator/department',
      icon: 'Building',
      type: 'ITEM',
      parentKey: 'administrator',
      sortOrder: 2,
    },
    {
      key: 'administrator-permission',
      title: 'Permission',
      path: '/app/administrator/permission',
      icon: 'Key',
      type: 'ITEM',
      parentKey: 'administrator',
      sortOrder: 3,
    },
    {
      key: 'administrator-menu',
      title: 'Menu',
      path: '/app/administrator/menu',
      icon: 'LayoutGrid',
      type: 'ITEM',
      parentKey: 'administrator',
      sortOrder: 4,
    },
    {
      key: 'administrator-session',
      title: 'Session',
      path: '/app/administrator/session',
      icon: 'Clock',
      type: 'ITEM',
      parentKey: 'administrator',
      sortOrder: 5,
    },
    {
      key: 'administrator-auditlog',
      title: 'Auditlog',
      path: '/app/administrator/auditlog',
      icon: 'FileText',
      type: 'ITEM',
      parentKey: 'administrator',
      sortOrder: 6,
    },
    {
      key: 'master-data',
      title: 'Master Data',
      path: null,
      icon: 'Database',
      type: 'GROUP',
      parentKey: null,
      sortOrder: 3,
    },
    {
      key: 'master-data-contact',
      title: 'Contact',
      path: '/app/master/contact',
      icon: 'ContactRound',
      type: 'ITEM',
      parentKey: 'master-data',
      sortOrder: 1,
    },
    {
      key: 'master-data-division',
      title: 'Division',
      path: '/app/master/division',
      icon: 'Building2',
      type: 'ITEM',
      parentKey: 'master-data',
      sortOrder: 2,
    },
    {
      key: 'master-data-item',
      title: 'Item',
      path: '/app/master/item',
      icon: 'Package',
      type: 'ITEM',
      parentKey: 'master-data',
      sortOrder: 4,
    },
    {
      key: 'master-data-province',
      title: 'Province',
      path: '/app/master/province',
      icon: 'Map',
      type: 'ITEM',
      parentKey: 'master-data',
      sortOrder: 5,
    },
    {
      key: 'master-data-city',
      title: 'City',
      path: '/app/master/city',
      icon: 'MapPin',
      type: 'ITEM',
      parentKey: 'master-data',
      sortOrder: 6,
    },
    {
      key: 'master-data-city-sla',
      title: 'City SLA',
      path: '/app/master/city-sla',
      icon: 'Clock',
      type: 'ITEM',
      parentKey: 'master-data',
      sortOrder: 7,
    },
    {
      key: 'master-data-uom',
      title: 'UOM',
      path: '/app/master/uom',
      icon: 'Ruler',
      type: 'ITEM',
      parentKey: 'master-data',
      sortOrder: 8,
    },
    {
      key: 'master-data-warehouse',
      title: 'Warehouse',
      path: '/app/master/warehouse',
      icon: 'Warehouse',
      type: 'ITEM',
      parentKey: 'master-data',
      sortOrder: 9,
    },
    {
      key: 'logistic',
      title: 'Logistic',
      path: null,
      icon: 'Truck',
      type: 'GROUP',
      parentKey: null,
      sortOrder: 4,
    },
    {
      key: 'logistic-inbound',
      title: 'Inbound',
      path: '/app/logistic/inbound',
      icon: 'ArrowDownToLine',
      type: 'ITEM',
      parentKey: 'logistic',
      sortOrder: 1,
    },
    {
      key: 'logistic-outbound',
      title: 'Outbound',
      path: '/app/logistic/outbound',
      icon: 'ArrowRightLeft',
      type: 'ITEM',
      parentKey: 'logistic',
      sortOrder: 2,
    },
    {
      key: 'logistic-report-monitoring-do',
      title: 'Report Monitoring DO',
      path: '/app/logistic/report-monitoring-do',
      icon: 'ClipboardList',
      type: 'ITEM',
      parentKey: 'logistic',
      sortOrder: 3,
    },
    {
      key: 'logistic-report-stock-batch',
      title: 'Report Stock Batch',
      path: '/app/logistic/report-stock-batch',
      icon: 'Boxes',
      type: 'ITEM',
      parentKey: 'logistic',
      sortOrder: 4,
    },
    {
      key: 'logistic-report-stock-mutation',
      title: 'Report Stock Mutation',
      path: '/app/logistic/report-stock-mutation',
      icon: 'Repeat',
      type: 'ITEM',
      parentKey: 'logistic',
      sortOrder: 5,
    },
  ];

  const menuByKey = new Map<string, number>();
  for (const seed of menuSeeds.filter((m) => m.parentKey === null)) {
    const menu = await prisma.menu.upsert({
      where: { key: seed.key },
      update: {
        title: seed.title,
        path: seed.path,
        icon: seed.icon,
        type: seed.type,
        parentId: null,
        sortOrder: seed.sortOrder,
        isVisible: seed.isVisible ?? true,
        isActive: seed.isActive ?? true,
        permissionName: seed.permissionName ?? null,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        key: seed.key,
        title: seed.title,
        path: seed.path,
        icon: seed.icon,
        type: seed.type,
        parentId: null,
        sortOrder: seed.sortOrder,
        isVisible: seed.isVisible ?? true,
        isActive: seed.isActive ?? true,
        permissionName: seed.permissionName ?? null,
      },
      select: { id: true },
    });
    menuByKey.set(seed.key, menu.id);
  }

  for (const seed of menuSeeds.filter((m) => m.parentKey !== null)) {
    const parentId = menuByKey.get(seed.parentKey as string);
    if (!parentId) {
      throw new Error(`Parent menu not found for ${seed.key}`);
    }
    const menu = await prisma.menu.upsert({
      where: { key: seed.key },
      update: {
        title: seed.title,
        path: seed.path,
        icon: seed.icon,
        type: seed.type,
        parentId,
        sortOrder: seed.sortOrder,
        isVisible: seed.isVisible ?? true,
        isActive: seed.isActive ?? true,
        permissionName: seed.permissionName ?? null,
        deletedAt: null,
        deletedBy: null,
      },
      create: {
        key: seed.key,
        title: seed.title,
        path: seed.path,
        icon: seed.icon,
        type: seed.type,
        parentId,
        sortOrder: seed.sortOrder,
        isVisible: seed.isVisible ?? true,
        isActive: seed.isActive ?? true,
        permissionName: seed.permissionName ?? null,
      },
      select: { id: true },
    });
    menuByKey.set(seed.key, menu.id);
  }

  const assignMenuToRole = async (roleId: number, menuId: number) => {
    await prisma.roleMenu.upsert({
      where: { roleId_menuId: { roleId, menuId } },
      update: { canView: true, deletedAt: null, deletedBy: null },
      create: { roleId, menuId, canView: true },
    });
  };

  for (const menuId of menuByKey.values()) {
    await assignMenuToRole(adminRole.id, menuId);
  }

  // Admin must always have full menu access, including menus created outside this seed list.
  const allMenus = await prisma.menu.findMany({
    where: { deletedAt: null },
    select: { id: true },
  });
  for (const menu of allMenus) {
    await assignMenuToRole(adminRole.id, menu.id);
  }

  const operationalMenuKeys = [
    'dashboard',
    'dashboard-overview',
    'dashboard-m1',
    'dashboard-m',
    'dashboard-m2',
    'dashboard-so',
    'dashboard-m2r',
    'master-data',
    'master-data-contact',
    'master-data-division',
    'master-data-item',
    'master-data-item-stock',
    'master-data-province',
    'master-data-city',
    'master-data-city-sla',
    'master-data-uom',
    'master-data-warehouse',
    'logistic',
    'logistic-inbound',
    'logistic-outbound',
    'logistic-report-monitoring-do',
    'logistic-report-stock-batch',
    'logistic-report-stock-mutation',
  ] as const;

  for (const key of operationalMenuKeys) {
    const menuId = menuByKey.get(key);
    if (!menuId) {
      continue;
    }
    await assignMenuToRole(managerRole.id, menuId);
    await assignMenuToRole(userRole.id, menuId);
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
    select: { id: true },
  });
  if (adminUser) {
    const existingAudit = await prisma.auditLog.findFirst({
      where: {
        userId: adminUser.id,
        action: 'USER_LOGIN',
        entityType: 'AUTH',
        entityId: String(adminUser.id),
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!existingAudit) {
      await prisma.auditLog.create({
        data: {
          userId: adminUser.id,
          action: 'USER_LOGIN',
          entityType: 'AUTH',
          entityId: String(adminUser.id),
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 (Seed)',
          createdBy: adminUser.id,
          updatedBy: adminUser.id,
        },
      });
    }
  }

  console.log('Seeding completed.');
  console.log('-------------------------------------------');
  console.log('Admin:   admin@example.com');
  console.log('Manager: manager.eng@example.com');
  console.log('Staff:   staff.eng@example.com');
  console.log('Staff:   staff.hr@example.com');
  console.log('Password for all users: Password123!');
  console.log('-------------------------------------------');
}

main()
  .catch((error) => {
    console.error('Seeding error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
