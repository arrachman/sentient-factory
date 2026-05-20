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
  const branches = [
    {
      code: 'HQ',
      name: 'Head Quarter',
      addressLine1: 'Jl. Jend. Sudirman No. 1',
      city: 'Jakarta Pusat',
      postalCode: '10220',
      phone: '021-5700001',
      fax: '021-5700002',
      notes: 'Kantor pusat perusahaan',
      isActive: true,
    },
    {
      code: 'BDG',
      name: 'Cabang Bandung',
      addressLine1: 'Jl. Asia Afrika No. 45',
      addressLine2: 'Gedung Landmark Lt. 3',
      city: 'Bandung',
      postalCode: '40111',
      phone: '022-4200101',
      fax: '022-4200102',
      notes: 'Cabang wilayah Jawa Barat',
      isActive: true,
    },
    {
      code: 'SBY',
      name: 'Cabang Surabaya',
      addressLine1: 'Jl. Pemuda No. 27',
      addressLine2: 'Ruko Pemuda Square Blok B-5',
      city: 'Surabaya',
      postalCode: '60271',
      phone: '031-5350201',
      fax: '031-5350202',
      notes: 'Cabang wilayah Jawa Timur',
      isActive: true,
    },
    {
      code: 'MKS',
      name: 'Cabang Makassar',
      addressLine1: 'Jl. Sam Ratulangi No. 8',
      city: 'Makassar',
      postalCode: '90111',
      phone: '0411-871301',
      fax: '0411-871302',
      notes: 'Cabang wilayah Sulawesi Selatan',
      isActive: true,
    },
    {
      code: 'MDN',
      name: 'Cabang Medan',
      addressLine1: 'Jl. Gatot Subroto No. 12',
      addressLine2: 'Kompleks Bisnis Center Blok A-2',
      city: 'Medan',
      postalCode: '20112',
      phone: '061-4521401',
      fax: '061-4521402',
      notes: 'Cabang wilayah Sumatera Utara',
      isActive: true,
    },
    {
      code: 'SMG',
      name: 'Cabang Semarang',
      addressLine1: 'Jl. Pandanaran No. 55',
      city: 'Semarang',
      postalCode: '50134',
      phone: '024-8310501',
      fax: '024-8310502',
      notes: 'Cabang wilayah Jawa Tengah',
      isActive: true,
    },
    {
      code: 'YGY',
      name: 'Cabang Yogyakarta',
      addressLine1: 'Jl. Malioboro No. 20',
      addressLine2: 'Ruko Malioboro Blok C-1',
      city: 'Yogyakarta',
      postalCode: '55213',
      phone: '0274-561601',
      fax: '0274-561602',
      notes: 'Cabang wilayah DIY',
      isActive: true,
    },
    {
      code: 'PLM',
      name: 'Cabang Palembang',
      addressLine1: 'Jl. Jend. Sudirman No. 88',
      city: 'Palembang',
      postalCode: '30126',
      phone: '0711-357701',
      fax: '0711-357702',
      notes: 'Cabang wilayah Sumatera Selatan',
      isActive: true,
    },
    {
      code: 'DPS',
      name: 'Cabang Denpasar',
      addressLine1: 'Jl. Raya Puputan No. 33',
      addressLine2: 'Gedung Renon Center Lt. 2',
      city: 'Denpasar',
      postalCode: '80235',
      phone: '0361-225801',
      fax: '0361-225802',
      notes: 'Cabang wilayah Bali',
      isActive: true,
    },
    {
      code: 'BPN',
      name: 'Cabang Balikpapan',
      addressLine1: 'Jl. Jend. Sudirman No. 15',
      city: 'Balikpapan',
      postalCode: '76114',
      phone: '0542-736901',
      fax: '0542-736902',
      notes: 'Cabang wilayah Kalimantan Timur',
      isActive: true,
    },
    {
      code: 'PKU',
      name: 'Cabang Pekanbaru',
      addressLine1: 'Jl. Jend. Ahmad Yani No. 7',
      city: 'Pekanbaru',
      postalCode: '28156',
      phone: '0761-857001',
      fax: '0761-857002',
      notes: 'Cabang wilayah Riau',
      isActive: false,
    },
    {
      code: 'PNK',
      name: 'Cabang Pontianak',
      addressLine1: 'Jl. Tanjungpura No. 66',
      addressLine2: 'Ruko Tanjungpura Bisnis Center No. 5',
      city: 'Pontianak',
      postalCode: '78112',
      phone: '0561-748101',
      fax: '0561-748102',
      notes: 'Cabang wilayah Kalimantan Barat',
      isActive: false,
    },
  ];

  for (const branch of branches) {
    await prisma.erpBranch.upsert({
      where: { code: branch.code },
      create: branch,
      update: {},
    });
  }
  console.log(`✓ md_branches (${branches.length} entries)`);
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

  async function upsertMenu(p: {
    code: string; title: string; type: ErpMenuType;
    parentId?: bigint; path?: string; icon?: string;
    sortOrder: number; legacyCode?: string;
  }) {
    const m = await prisma.erpMenu.upsert({
      where: { code: p.code },
      create: { code: p.code, title: p.title, type: p.type, parentId: p.parentId, path: p.path, icon: p.icon, sortOrder: p.sortOrder, legacyCode: p.legacyCode, isActive: true },
      update: {
        title: p.title,
        type: p.type,
        parentId: p.parentId ?? null,
        path: p.path ?? null,
        icon: p.icon ?? null,
        sortOrder: p.sortOrder,
        legacyCode: p.legacyCode ?? undefined,
      },
    });
    menuIds.set(p.code, m.id);
    return m;
  }

  async function upsertItems(items: Array<{ code: string; title: string; path: string; legacyCode?: string }>, parentId: bigint) {
    for (const [i, item] of items.entries()) {
      await upsertMenu({ ...item, type: ErpMenuType.ITEM, parentId, sortOrder: i + 1 });
    }
  }

  // ── M0: Administrator ─────────────────────────────────────────────────────
  const m0 = await upsertMenu({ code: 'M0', title: 'Administrator', icon: 'gear', type: ErpMenuType.MODULE, sortOrder: 1, legacyCode: '0-1' });

  // M0.CFG — Pengaturan Awal (legacy 0-2): all initial config
  const cfgGrp = await upsertMenu({ code: 'M0.CFG', title: 'Initial Setup', type: ErpMenuType.GROUP, parentId: m0.id, sortOrder: 1, legacyCode: '0-2' });
  await upsertItems([
    { code: 'M0.CFG.PREFERENCES',    title: 'Preferensi',          path: '/admin/preferences'                                   },
    { code: 'M0.CFG.COMPANY',        title: 'Company Settings',    path: '/admin/settings/company',        legacyCode: '0-27' },
    { code: 'M0.CFG.ACCOUNTING',     title: 'Accounting Settings', path: '/admin/settings/accounting',     legacyCode: '0-29' },
    { code: 'M0.CFG.DOCNUM',         title: 'Document Numbering',  path: '/admin/document-numbering',      legacyCode: '0-30' },
    { code: 'M0.CFG.BANK-ACCOUNTS',  title: 'Bank Accounts',       path: '/admin/settings/bank-accounts',  legacyCode: '0-31' },
    { code: 'M0.CFG.TAX',            title: 'Tax Settings',        path: '/admin/settings/tax',            legacyCode: '0-32' },
    { code: 'M0.CFG.DESCRIPTION',    title: 'Description Presets', path: '/admin/settings/description',    legacyCode: '0-33' },
    { code: 'M0.CFG.FORMAT',         title: 'Format Settings',     path: '/admin/settings/format',         legacyCode: '0-34' },
    { code: 'M0.CFG.DEFAULTS',       title: 'Default Settings',    path: '/admin/settings/defaults',       legacyCode: '0-35' },
    { code: 'M0.CFG.REPORT-DEFAULT', title: 'Report Defaults',     path: '/admin/settings/report-defaults', legacyCode: '0-36' },
    { code: 'M0.CFG.SIGNATURE',      title: 'Signature Settings',  path: '/admin/settings/signature',      legacyCode: '0-37' },
    { code: 'M0.CFG.OPTIONS',        title: 'Options',             path: '/admin/settings/options',        legacyCode: '0-38' },
    { code: 'M0.CFG.HOME',           title: 'Home Layout',         path: '/admin/settings/home',           legacyCode: '0-39' },
    { code: 'M0.CFG.APPROVAL',       title: 'Approval Settings',   path: '/admin/settings/approval',       legacyCode: '0-46' },
    { code: 'M0.CFG.IMPORT',         title: 'Import Data',         path: '/admin/import',                  legacyCode: '0-20' },
  ], cfgGrp.id);

  // M0.ADM — Tool Administrator (legacy 0-25): identity & admin tools
  const admGrp = await upsertMenu({ code: 'M0.ADM', title: 'Administration', type: ErpMenuType.GROUP, parentId: m0.id, sortOrder: 2, legacyCode: '0-25' });
  await upsertItems([
    { code: 'M0.ADM.USERS',          title: 'User Management',     path: '/admin/users',                    legacyCode: '0-4'  },
    { code: 'M0.ADM.ROLES',          title: 'Role Management',     path: '/admin/roles',                    legacyCode: '0-5'  },
    { code: 'M0.ADM.PERMISSIONS',    title: 'Permissions',         path: '/admin/permissions'                                   },
    { code: 'M0.ADM.LANG',           title: 'Language',            path: '/admin/language',                 legacyCode: '0-6'  },
    { code: 'M0.ADM.ONLINE-USERS',   title: 'Online Users',        path: '/admin/users/online',             legacyCode: '0-18' },
    { code: 'M0.ADM.USER-LOG',       title: 'User Log',            path: '/admin/audit-logs',               legacyCode: '0-21' },
    { code: 'M0.ADM.CLOSE-PERIOD',   title: 'Close Fiscal Period', path: '/admin/fiscal-periods/close',     legacyCode: '0-17' },
    { code: 'M0.ADM.RECALC-COGS',    title: 'Recalculate COGS',    path: '/admin/tools/recalc-cogs',        legacyCode: '0-12' },
    { code: 'M0.ADM.REPOST-JOURNAL', title: 'Repost Journals',     path: '/admin/tools/repost-journal',     legacyCode: '0-13' },
    { code: 'M0.ADM.DATA-VALIDITY',  title: 'Data Validity Check', path: '/admin/tools/data-validity',      legacyCode: '0-23' },
  ], admGrp.id);

  // M0.SYS — Sistem (legacy 0-26): system management (keep existing codes)
  const sysGrp = await upsertMenu({ code: 'M0.SYS', title: 'System', type: ErpMenuType.GROUP, parentId: m0.id, sortOrder: 3, legacyCode: '0-26' });
  await upsertItems([
    { code: 'M0.SYS.MENUS',    title: 'Menu Manager',        path: '/admin/menus',               legacyCode: '0-9'  },
    { code: 'M0.SYS.SETTINGS', title: 'Settings Manager',    path: '/admin/settings',            legacyCode: '0-11' },
    { code: 'M0.SYS.DOCNUM',   title: 'Document Numbering',  path: '/admin/document-numbering',  legacyCode: '0-30' },
    { code: 'M0.SYS.FISCAL',   title: 'Fiscal Periods',      path: '/admin/fiscal-periods',      legacyCode: '0-17' },
    { code: 'M0.SYS.AUDIT',    title: 'Audit Log',           path: '/admin/audit-logs',          legacyCode: '0-21' },
  ], sysGrp.id);

  // ── M1: Master Data ───────────────────────────────────────────────────────
  const m1 = await upsertMenu({ code: 'M1', title: 'Master Data', icon: 'database', type: ErpMenuType.MODULE, sortOrder: 2, legacyCode: '1-1' });

  // M1.ORG — Organization (branch, location, warehouse, divisions, etc.)
  const orgGrp = await upsertMenu({ code: 'M1.ORG', title: 'Organization', type: ErpMenuType.GROUP, parentId: m1.id, sortOrder: 1 });
  await upsertItems([
    { code: 'M1.ORG.BRANCH',       title: 'Branch',          path: '/org/branches',         legacyCode: '1-13' },
    { code: 'M1.ORG.LOCATION',     title: 'Location',        path: '/org/locations',        legacyCode: '1-14' },
    { code: 'M1.ORG.WAREHOUSE',    title: 'Warehouse',       path: '/org/warehouses',       legacyCode: '1-15' },
    { code: 'M1.ORG.DIVISION',     title: 'Division',        path: '/org/divisions',        legacyCode: '1-16' },
    { code: 'M1.ORG.SUBDIVISION',  title: 'Sub Division',    path: '/org/sub-divisions',    legacyCode: '1-17' },
    { code: 'M1.ORG.PROJECT',      title: 'Project',         path: '/org/projects',         legacyCode: '1-18' },
    { code: 'M1.ORG.COST-CENTER',  title: 'Cost Center',     path: '/org/cost-centers',     legacyCode: '1-19' },
    { code: 'M1.ORG.DEPARTMENT',   title: 'Department',      path: '/org/departments',      legacyCode: '1-84' },
    { code: 'M1.ORG.SUBDEPT',      title: 'Sub Department',  path: '/org/sub-departments',  legacyCode: '1-85' },
  ], orgGrp.id);

  // M1.ITEM — Items & product classification
  const itemsGrp = await upsertMenu({ code: 'M1.ITEM', title: 'Items', type: ErpMenuType.GROUP, parentId: m1.id, sortOrder: 2 });
  await upsertItems([
    { code: 'M1.ITEM.ITEMS',          title: 'Items',             path: '/master/items',           legacyCode: '1-11' },
    { code: 'M1.ITEM.CATEGORIES',     title: 'Item Categories',   path: '/master/item-categories', legacyCode: '1-8'  },
    { code: 'M1.ITEM.TYPES',          title: 'Item Types',        path: '/master/item-types',      legacyCode: '1-9'  },
    { code: 'M1.ITEM.UNITS',          title: 'Units',             path: '/master/units',           legacyCode: '1-10' },
    { code: 'M1.ITEM.LOCATIONS',      title: 'Item Locations',    path: '/master/item-locations',  legacyCode: '1-7'  },
    { code: 'M1.ITEM.INFO',           title: 'Item Information',  path: '/master/item-info',       legacyCode: '1-72' },
    { code: 'M1.ITEM.PRODUCT-CLASS',  title: 'Product Class',     path: '/master/product-classes', legacyCode: '1-80' },
    { code: 'M1.ITEM.PRICE-INDEX',    title: 'Price Index',       path: '/master/price-indices',   legacyCode: '1-81' },
    { code: 'M1.ITEM.PRICE-CATEGORY', title: 'Price Category',    path: '/master/price-categories', legacyCode: '1-90' },
    { code: 'M1.ITEM.COMMISSION',     title: 'Commission',        path: '/master/commissions',     legacyCode: '1-88' },
    { code: 'M1.ITEM.PERMISSIONS',    title: 'Item Permissions',  path: '/master/item-permissions', legacyCode: '1-92' },
    { code: 'M1.ITEM.CLASS',          title: 'Class',             path: '/master/classes',         legacyCode: '1-96' },
    { code: 'M1.ITEM.MODEL',          title: 'Model',             path: '/master/models',          legacyCode: '1-97' },
    { code: 'M1.ITEM.SIZE',           title: 'Size',              path: '/master/sizes',           legacyCode: '1-98' },
    { code: 'M1.ITEM.COLOR',          title: 'Color',             path: '/master/colors',          legacyCode: '1-99' },
    { code: 'M1.ITEM.BRAND',          title: 'Brand',             path: '/master/brands',          legacyCode: '1-101' },
    { code: 'M1.ITEM.MATERIAL',       title: 'Material',          path: '/master/materials',       legacyCode: '1-102' },
    { code: 'M1.ITEM.SECTION',        title: 'Section',           path: '/master/sections',        legacyCode: '1-103' },
  ], itemsGrp.id);

  // M1.PARTNER — Partners & contacts
  const partnerGrp = await upsertMenu({ code: 'M1.PARTNER', title: 'Partners', type: ErpMenuType.GROUP, parentId: m1.id, sortOrder: 3 });
  await upsertItems([
    { code: 'M1.PARTNER.PARTNERS',      title: 'Partners',             path: '/master/partners',             legacyCode: '1-6'  },
    { code: 'M1.PARTNER.CATEGORIES',    title: 'Partner Categories',   path: '/master/partner-categories',   legacyCode: '1-3'  },
    { code: 'M1.PARTNER.CUSTOMER-CAT',  title: 'Customer Categories',  path: '/master/customer-categories',  legacyCode: '1-4'  },
    { code: 'M1.PARTNER.SUPPLIER-CAT',  title: 'Supplier Categories',  path: '/master/supplier-categories',  legacyCode: '1-70' },
    { code: 'M1.PARTNER.SALESMAN-CAT',  title: 'Salesman Categories',  path: '/master/salesman-categories',  legacyCode: '1-5'  },
    { code: 'M1.PARTNER.BANK',          title: 'Bank',                 path: '/master/banks',                legacyCode: '1-23' },
    { code: 'M1.PARTNER.EXPEDITION',    title: 'Expedition',           path: '/master/expeditions',          legacyCode: '1-29' },
    { code: 'M1.PARTNER.VENDOR',        title: 'Vendor',               path: '/master/vendors',              legacyCode: '1-105' },
  ], partnerGrp.id);

  // M1.FIN — Finance Masters
  const finGrp = await upsertMenu({ code: 'M1.FIN', title: 'Finance Masters', type: ErpMenuType.GROUP, parentId: m1.id, sortOrder: 4 });
  await upsertItems([
    { code: 'M1.FIN.ACCOUNTS',     title: 'Chart of Accounts',  path: '/master/accounts',       legacyCode: '1-12' },
    { code: 'M1.FIN.TAXES',        title: 'Taxes',              path: '/master/taxes',          legacyCode: '1-21' },
    { code: 'M1.FIN.CURRENCIES',   title: 'Currencies',         path: '/master/currencies',     legacyCode: '1-22' },
    { code: 'M1.FIN.TERMS',        title: 'Payment Terms',      path: '/master/payment-terms',  legacyCode: '1-20' },
    { code: 'M1.FIN.OTHER-COSTS',  title: 'Other Costs',        path: '/master/other-costs',    legacyCode: '1-31' },
  ], finGrp.id);

  // M1.REF — Reference / Misc
  const refGrp = await upsertMenu({ code: 'M1.REF', title: 'Reference', type: ErpMenuType.GROUP, parentId: m1.id, sortOrder: 5 });
  await upsertItems([
    { code: 'M1.REF.COUNTRY',         title: 'Country',                path: '/master/countries',         legacyCode: '1-25' },
    { code: 'M1.REF.PROVINCE',        title: 'Province',               path: '/master/provinces',         legacyCode: '1-26' },
    { code: 'M1.REF.CITY',            title: 'City',                   path: '/master/cities',            legacyCode: '1-27' },
    { code: 'M1.REF.AREA',            title: 'Area',                   path: '/master/areas',             legacyCode: '1-28' },
    { code: 'M1.REF.TXN-NOTE',        title: 'Transaction Notes',      path: '/master/transaction-notes', legacyCode: '1-24' },
    { code: 'M1.REF.TXN-NOTE-DETAIL', title: 'Txn Note Detail',        path: '/master/txn-note-details',  legacyCode: '1-33' },
    { code: 'M1.REF.ITEM-TXN-TYPE',   title: 'Item Transaction Types', path: '/master/item-txn-types',    legacyCode: '1-30' },
    { code: 'M1.REF.PRODUCTION-CAT',  title: 'Production Categories',  path: '/master/production-categories', legacyCode: '1-35' },
    { code: 'M1.REF.WORK-ESTIMATE',   title: 'Work Estimate',          path: '/master/work-estimates',    legacyCode: '1-34' },
    { code: 'M1.REF.POINT-CAT',       title: 'Point Categories',       path: '/master/point-categories',  legacyCode: '1-78' },
    { code: 'M1.REF.MISC',            title: 'Miscellaneous',          path: '/master/misc',              legacyCode: '1-32' },
  ], refGrp.id);

  // M1.PROD — Production Masters
  const prodGrp = await upsertMenu({ code: 'M1.PROD', title: 'Production', type: ErpMenuType.GROUP, parentId: m1.id, sortOrder: 6 });
  await upsertItems([
    { code: 'M1.PROD.LABOR',     title: 'Labor',               path: '/master/labor',                 legacyCode: '1-94'  },
    { code: 'M1.PROD.MACHINE',   title: 'Machine',             path: '/master/machines',              legacyCode: '1-95'  },
    { code: 'M1.PROD.DESIGNER',  title: 'Designer',            path: '/master/designers',             legacyCode: '1-104' },
    { code: 'M1.PROD.ACTIVITY',  title: 'Production Activity', path: '/master/production-activities', legacyCode: '1-120' },
    { code: 'M1.PROD.ROUTE',     title: 'Production Route',    path: '/master/production-routes',     legacyCode: '1-122' },
    { code: 'M1.PROD.SUBCLASS',  title: 'Sub Class',           path: '/master/subclasses',            legacyCode: '1-106' },
  ], prodGrp.id);

  // ── SET: User Settings (personal preferences, not admin config) ──────────
  const setMod = await upsertMenu({ code: 'SET', title: 'Settings', icon: 'settings', type: ErpMenuType.MODULE, sortOrder: 99 });
  await upsertItems([
    { code: 'SET.APPEARANCE', title: 'Appearance', path: '/settings/appearance' },
  ], setMod.id);

  // ── M2–M14: Module stubs (legacy MyERP+ modules) ─────────────────────────
  // Roots only — items belum di-port. Path null = sidebar tampil tapi belum
  // navigable; expand per modul saat fitur dibangun. Tidak ada m9 di legacy.
  // Module roots Senti ERP. Dashboard pinned to top. M10 (HR & Payroll),
  // M11 (Hospital — Althea vertical), M13 (Academic), M14 (Cooperative)
  // dihapus 2026-05-20: bukan scope ERP manufaktur, belum di module-roadmap.
  // M11 secara eksplisit milik apps/web-althea (CLAUDE.md §1).
  const moduleStubs: Array<{ code: string; title: string; icon: string; legacyCode: string; sortOrder: number }> = [
    { code: 'M8',  title: 'Dashboard',              icon: 'layout-dashboard', legacyCode: '8-1', sortOrder: 0 },
    // M0/M1 sudah di-upsert di atas dengan sortOrder 1 & 2.
    { code: 'M2',  title: 'Finance & Accounting',  icon: 'calculator',     legacyCode: '2-1',  sortOrder: 3 },
    { code: 'M3',  title: 'Warehouse & Inventory', icon: 'boxes',          legacyCode: '3-1',  sortOrder: 4 },
    { code: 'M4',  title: 'Purchasing',            icon: 'shopping-cart',  legacyCode: '4-1',  sortOrder: 5 },
    { code: 'M5',  title: 'Sales',                 icon: 'trending-up',    legacyCode: '5-1',  sortOrder: 6 },
    { code: 'M6',  title: 'Production',            icon: 'factory',        legacyCode: '6-1',  sortOrder: 7 },
    { code: 'M7',  title: 'Fixed Assets',          icon: 'building',       legacyCode: '7-1',  sortOrder: 8 },
    { code: 'M12', title: 'Point of Sale',         icon: 'shopping-bag',   legacyCode: '12-1', sortOrder: 9 },
  ];
  for (const s of moduleStubs) {
    await upsertMenu({ code: s.code, title: s.title, icon: s.icon, type: ErpMenuType.MODULE, sortOrder: s.sortOrder, legacyCode: s.legacyCode });
  }

  // M2 Finance — paritas dengan legacy m2-finance (13 transaction modules + GL).
  // Legacy codes: CR=Cash Receipt, CD=Cash Disbursement, BD=Bank Disbursement,
  // CB=Cash/Bank Transfer, RG=Receipt Giro, SG=Send Giro, RGC/SGC=Giro Clearing,
  // RM=Receipt Memo (AR settle), SM=Send Memo (AP settle), GJ=General Journal,
  // AJ=Adjustment Journal. Title English (keputusan 2026-05-20).
  const m2Id = menuIds.get('M2');
  if (m2Id) {
    const m2TxGrp = await upsertMenu({ code: 'M2.TX', title: 'Transactions', type: ErpMenuType.GROUP, parentId: m2Id, sortOrder: 1 });
    await upsertItems([
      { code: 'M2.TX.CASH-RECEIPT',       title: 'Cash Receipt',         path: '/finance/cash-receipts',       legacyCode: 'CR' },
      { code: 'M2.TX.CASH-DISBURSEMENT',  title: 'Cash Disbursement',    path: '/finance/cash-disbursements',  legacyCode: 'CD' },
      { code: 'M2.TX.BANK-DISBURSEMENT',  title: 'Bank Disbursement',    path: '/finance/bank-disbursements',  legacyCode: 'BD' },
      { code: 'M2.TX.CASHBANK-TRANSFER',  title: 'Cash/Bank Transfer',   path: '/finance/cashbank-transfers',  legacyCode: 'CB' },
      { code: 'M2.TX.RECEIPT-GIRO',       title: 'Receipt Giro',         path: '/finance/receipt-giros',       legacyCode: 'RG' },
      { code: 'M2.TX.SEND-GIRO',          title: 'Send Giro',            path: '/finance/send-giros',          legacyCode: 'SG' },
      { code: 'M2.TX.RECEIPT-GIRO-CLR',   title: 'Receipt Giro Clearing', path: '/finance/receipt-giro-clearings', legacyCode: 'RGC' },
      { code: 'M2.TX.SEND-GIRO-CLR',      title: 'Send Giro Clearing',   path: '/finance/send-giro-clearings', legacyCode: 'SGC' },
      { code: 'M2.TX.RECEIPT-MEMO',       title: 'Receipt Memo',         path: '/finance/receipt-memos',       legacyCode: 'RM' },
      { code: 'M2.TX.SEND-MEMO',          title: 'Send Memo',            path: '/finance/send-memos',          legacyCode: 'SM' },
      { code: 'M2.TX.GENERAL-JOURNAL',    title: 'General Journal',      path: '/finance/general-journals',    legacyCode: 'GJ' },
      { code: 'M2.TX.ADJUSTMENT-JOURNAL', title: 'Adjustment Journal',   path: '/finance/adjustment-journals', legacyCode: 'AJ' },
    ], m2TxGrp.id);
    const m2RptGrp = await upsertMenu({ code: 'M2.RPT', title: 'Reports', type: ErpMenuType.GROUP, parentId: m2Id, sortOrder: 2 });
    await upsertItems([
      { code: 'M2.RPT.LEDGER',            title: 'General Ledger',       path: '/finance/ledger' },
    ], m2RptGrp.id);
  }

  // M3 Warehouse & Inventory — paritas dengan legacy m3 (10 transaksi, data, laporan, statistik).
  // Legacy mntype: 2=group, 3=data-list, 4=report, 6=stat-group, 7=stat-item.
  // Path prefix: /warehouse/* (belum navigable — frontend M3 belum dibangun).
  const m3Id = menuIds.get('M3');
  if (m3Id) {
    const m3TxGrp = await upsertMenu({ code: 'M3.TX', title: 'Transactions', type: ErpMenuType.GROUP, parentId: m3Id, sortOrder: 1, legacyCode: '3-2' });
    await upsertItems([
      { code: 'M3.TX.MR', title: 'Material Request (MR)',       path: '/warehouse/material-requests',  legacyCode: '3-3'  },
      { code: 'M3.TX.TS', title: 'Stock Transfer (TS)',         path: '/warehouse/transfers',          legacyCode: '3-4'  },
      { code: 'M3.TX.RS', title: 'Transfer Receipt (RS)',       path: '/warehouse/transfer-receipts',  legacyCode: '3-5'  },
      { code: 'M3.TX.SP', title: 'Stock Count (SP)',            path: '/warehouse/stock-counts',       legacyCode: '3-7'  },
      { code: 'M3.TX.SA', title: 'Stock Adjustment (SA)',       path: '/warehouse/stock-adjustments',  legacyCode: '3-6'  },
      { code: 'M3.TX.PA', title: 'Price Adjustment (PA)',       path: '/warehouse/price-adjustments',  legacyCode: '3-8'  },
      { code: 'M3.TX.IB', title: 'Opening Stock (IB)',          path: '/warehouse/opening-stocks',     legacyCode: '3-23' },
      { code: 'M3.TX.RF', title: 'Fuel Refill (RF)',            path: '/warehouse/fuel-refills',       legacyCode: '3-40' },
      { code: 'M3.TX.DC', title: 'Time Sheet/Daily Check (DC)', path: '/warehouse/daily-checks',       legacyCode: '3-41' },
      { code: 'M3.TX.RW', title: 'Receipt Weigher (RW)',        path: '/warehouse/receipt-weighers',   legacyCode: '3-51' },
    ], m3TxGrp.id);

    const m3DataGrp = await upsertMenu({ code: 'M3.DATA', title: 'Data', type: ErpMenuType.GROUP, parentId: m3Id, sortOrder: 2, legacyCode: '3-9' });
    await upsertItems([
      { code: 'M3.DATA.MR',     title: 'Material Request (MR)',       path: '/warehouse/data/material-requests',  legacyCode: '3-10' },
      { code: 'M3.DATA.TS',     title: 'Stock Transfer (TS)',         path: '/warehouse/data/transfers',          legacyCode: '3-11' },
      { code: 'M3.DATA.RS',     title: 'Transfer Receipt (RS)',       path: '/warehouse/data/transfer-receipts',  legacyCode: '3-12' },
      { code: 'M3.DATA.SP',     title: 'Stock Count (SP)',            path: '/warehouse/data/stock-counts',       legacyCode: '3-14' },
      { code: 'M3.DATA.SA',     title: 'Stock Adjustment (SA)',       path: '/warehouse/data/stock-adjustments',  legacyCode: '3-13' },
      { code: 'M3.DATA.PA',     title: 'Price Adjustment (PA)',       path: '/warehouse/data/price-adjustments',  legacyCode: '3-15' },
      { code: 'M3.DATA.IB',     title: 'Opening Stock (IB)',          path: '/warehouse/data/opening-stocks',     legacyCode: '3-24' },
      { code: 'M3.DATA.RF',     title: 'Fuel Refill (RF)',            path: '/warehouse/data/fuel-refills',       legacyCode: '3-42' },
      { code: 'M3.DATA.DC',     title: 'Time Sheet/Daily Check (DC)', path: '/warehouse/data/daily-checks',       legacyCode: '3-43' },
      { code: 'M3.DATA.RW',     title: 'Receipt Weigher (RW)',        path: '/warehouse/data/receipt-weighers',   legacyCode: '3-52' },
      { code: 'M3.DATA.SERIAL', title: 'Serial Item Cards',           path: '/warehouse/data/serial-cards',       legacyCode: '3-54' },
    ], m3DataGrp.id);

    const m3RptGrp = await upsertMenu({ code: 'M3.RPT', title: 'Reports', type: ErpMenuType.GROUP, parentId: m3Id, sortOrder: 3, legacyCode: '3-16' });
    await upsertItems([
      { code: 'M3.RPT.MR',           title: 'Material Request (MR)',       path: '/warehouse/reports/material-requests',  legacyCode: '3-17' },
      { code: 'M3.RPT.TS',           title: 'Stock Transfer (TS)',         path: '/warehouse/reports/transfers',          legacyCode: '3-18' },
      { code: 'M3.RPT.RS',           title: 'Transfer Receipt (RS)',       path: '/warehouse/reports/transfer-receipts',  legacyCode: '3-19' },
      { code: 'M3.RPT.SP',           title: 'Stock Count (SP)',            path: '/warehouse/reports/stock-counts',       legacyCode: '3-21' },
      { code: 'M3.RPT.SA',           title: 'Stock Adjustment (SA)',       path: '/warehouse/reports/stock-adjustments',  legacyCode: '3-20' },
      { code: 'M3.RPT.PA',           title: 'Price Adjustment (PA)',       path: '/warehouse/reports/price-adjustments',  legacyCode: '3-22' },
      { code: 'M3.RPT.IB',           title: 'Opening Stock (IB)',          path: '/warehouse/reports/opening-stocks',     legacyCode: '3-25' },
      { code: 'M3.RPT.RF',           title: 'Fuel Refill (RF)',            path: '/warehouse/reports/fuel-refills',       legacyCode: '3-44' },
      { code: 'M3.RPT.DC',           title: 'Time Sheet/Daily Check (DC)', path: '/warehouse/reports/daily-checks',       legacyCode: '3-45' },
      { code: 'M3.RPT.RW',           title: 'Receipt Weigher (RW)',        path: '/warehouse/reports/receipt-weighers',   legacyCode: '3-53' },
      { code: 'M3.RPT.STOCK-CARD',   title: 'Stock Card',                  path: '/warehouse/reports/stock-cards',        legacyCode: '3-36' },
      { code: 'M3.RPT.STOCK-MUT',    title: 'Stock Mutation',              path: '/warehouse/reports/stock-mutations',    legacyCode: '3-37' },
      { code: 'M3.RPT.STOCK',        title: 'Stock',                       path: '/warehouse/reports/stock',              legacyCode: '3-47' },
      { code: 'M3.RPT.RETURNS',      title: 'Return Items',                path: '/warehouse/reports/returns',            legacyCode: '3-48' },
      { code: 'M3.RPT.BELOW-MIN',    title: 'Below Minimum Stock',         path: '/warehouse/reports/below-minimum',      legacyCode: '3-26' },
      { code: 'M3.RPT.BATCH',        title: 'Batch Items',                 path: '/warehouse/reports/batch-items',        legacyCode: '3-39' },
      { code: 'M3.RPT.BATCH-CARD',   title: 'Batch Item Cards',            path: '/warehouse/reports/batch-cards',        legacyCode: '3-38' },
      { code: 'M3.RPT.SERIAL',       title: 'Serial Items',                path: '/warehouse/reports/serial-items',       legacyCode: '3-35' },
      { code: 'M3.RPT.SERIAL-CARD',  title: 'Serial Item Cards',           path: '/warehouse/reports/serial-cards',       legacyCode: '3-34' },
      { code: 'M3.RPT.COGS-BAL',     title: 'COGS Balance',                path: '/warehouse/reports/cogs-balance',       legacyCode: '3-49' },
      { code: 'M3.RPT.CONSIGNMENT',  title: 'Consignment Summary',         path: '/warehouse/reports/consignment',        legacyCode: '3-50' },
      { code: 'M3.RPT.DAILY-STOCK',  title: 'Daily Available Stock',       path: '/warehouse/reports/daily-stock',        legacyCode: '3-55' },
      { code: 'M3.RPT.STOCK-MINUS',  title: 'Stock Minus',                 path: '/warehouse/reports/stock-minus',        legacyCode: '3-56' },
    ], m3RptGrp.id);

    const m3StatGrp = await upsertMenu({ code: 'M3.STAT', title: 'Statistics', type: ErpMenuType.GROUP, parentId: m3Id, sortOrder: 4, legacyCode: '3-27' });
    await upsertItems([
      { code: 'M3.STAT.TOP-REVENUE',   title: 'Top Revenue Products',      path: '/warehouse/stats/top-revenue',     legacyCode: '3-29' },
      { code: 'M3.STAT.PROFITABLE',    title: 'Most Profitable Products',  path: '/warehouse/stats/most-profitable', legacyCode: '3-32' },
      { code: 'M3.STAT.BEST-SELLING',  title: 'Best Selling Products',     path: '/warehouse/stats/best-selling',    legacyCode: '3-33' },
      { code: 'M3.STAT.BELOW-MIN',     title: 'Below Minimum Stock',       path: '/warehouse/stats/below-minimum',   legacyCode: '3-30' },
      { code: 'M3.STAT.APPROVAL',      title: 'Need Approval (Warehouse)', path: '/warehouse/stats/approvals',       legacyCode: '3-46' },
      { code: 'M3.STAT.KPI',           title: 'KPI Warehouse',             path: '/warehouse/stats/kpi',             legacyCode: '3-31' },
    ], m3StatGrp.id);
  }

  // M4 Purchasing — active items only (skip CS=Lembar Biaya, IPC=Kalkulasi Import — mnactive=0 in legacy).
  // TX/DATA/RPT mirror legacy 3-group pattern. Payments (VPP/VP) kept in M4 for discoverability
  // even though posting goes via fin_ap_payments.
  const m4Id = menuIds.get('M4');
  if (m4Id) {
    const m4TxGrp = await upsertMenu({ code: 'M4.TX', title: 'Transactions', type: ErpMenuType.GROUP, parentId: m4Id, sortOrder: 1, legacyCode: '4-2' });
    await upsertItems([
      { code: 'M4.TX.PR',      title: 'Purchase Requisition (PR)',     path: '/purchasing/purchase-requisitions', legacyCode: '4-3'  },
      { code: 'M4.TX.RFQ',     title: 'Request for Quotation (RFQ)',   path: '/purchasing/rfqs',                  legacyCode: '4-5'  },
      { code: 'M4.TX.BS',      title: 'Bid Comparison (BS)',           path: '/purchasing/bid-comparisons',       legacyCode: '4-6'  },
      { code: 'M4.TX.PO',      title: 'Purchase Order (PO)',           path: '/purchasing/purchase-orders',       legacyCode: '4-7'  },
      { code: 'M4.TX.AP',      title: 'Vendor Advance (AP)',           path: '/purchasing/vendor-advances',       legacyCode: '4-8'  },
      { code: 'M4.TX.GRN',     title: 'Goods Receipt (GRN)',           path: '/purchasing/goods-receipts',        legacyCode: '4-10' },
      { code: 'M4.TX.PI',      title: 'Purchase Invoice (PI)',         path: '/purchasing/purchase-invoices',     legacyCode: '4-11' },
      { code: 'M4.TX.PP',      title: 'Freight Payable (PP)',          path: '/purchasing/freight-payables',      legacyCode: '4-44' },
      { code: 'M4.TX.DNR',     title: 'Return Shipment (DNR)',         path: '/purchasing/return-shipments',      legacyCode: '4-12' },
      { code: 'M4.TX.PRT',     title: 'Purchase Return (PRT)',         path: '/purchasing/purchase-returns',      legacyCode: '4-13' },
      { code: 'M4.TX.VPP',     title: 'Payment Schedule (VPP)',        path: '/purchasing/payment-schedules',     legacyCode: '4-14' },
      { code: 'M4.TX.VP',      title: 'Vendor Payment (VP)',           path: '/purchasing/vendor-payments',       legacyCode: '4-15' },
      { code: 'M4.TX.BALANCE', title: 'Opening AP Balance',            path: '/purchasing/opening-ap-balance',    legacyCode: '4-51' },
    ], m4TxGrp.id);

    const m4DataGrp = await upsertMenu({ code: 'M4.DATA', title: 'Data', type: ErpMenuType.GROUP, parentId: m4Id, sortOrder: 2, legacyCode: '4-16' });
    await upsertItems([
      { code: 'M4.DATA.PR',      title: 'Purchase Requisition (PR)',   path: '/purchasing/data/purchase-requisitions', legacyCode: '4-17' },
      { code: 'M4.DATA.RFQ',     title: 'Request for Quotation (RFQ)', path: '/purchasing/data/rfqs',                  legacyCode: '4-19' },
      { code: 'M4.DATA.BS',      title: 'Bid Comparison (BS)',         path: '/purchasing/data/bid-comparisons',       legacyCode: '4-20' },
      { code: 'M4.DATA.PO',      title: 'Purchase Order (PO)',         path: '/purchasing/data/purchase-orders',       legacyCode: '4-21' },
      { code: 'M4.DATA.AP',      title: 'Vendor Advance (AP)',         path: '/purchasing/data/vendor-advances',       legacyCode: '4-22' },
      { code: 'M4.DATA.GRN',     title: 'Goods Receipt (GRN)',         path: '/purchasing/data/goods-receipts',        legacyCode: '4-24' },
      { code: 'M4.DATA.PI',      title: 'Purchase Invoice (PI)',       path: '/purchasing/data/purchase-invoices',     legacyCode: '4-25' },
      { code: 'M4.DATA.PP',      title: 'Freight Payable (PP)',        path: '/purchasing/data/freight-payables',      legacyCode: '4-45' },
      { code: 'M4.DATA.DNR',     title: 'Return Shipment (DNR)',       path: '/purchasing/data/return-shipments',      legacyCode: '4-26' },
      { code: 'M4.DATA.PRT',     title: 'Purchase Return (PRT)',       path: '/purchasing/data/purchase-returns',      legacyCode: '4-27' },
      { code: 'M4.DATA.VPP',     title: 'Payment Schedule (VPP)',      path: '/purchasing/data/payment-schedules',     legacyCode: '4-28' },
      { code: 'M4.DATA.VP',      title: 'Vendor Payment (VP)',         path: '/purchasing/data/vendor-payments',       legacyCode: '4-29' },
      { code: 'M4.DATA.BALANCE', title: 'Opening AP Balance',          path: '/purchasing/data/opening-ap-balance',    legacyCode: '4-51' },
    ], m4DataGrp.id);

    const m4RptGrp = await upsertMenu({ code: 'M4.RPT', title: 'Reports', type: ErpMenuType.GROUP, parentId: m4Id, sortOrder: 3, legacyCode: '4-30' });
    await upsertItems([
      { code: 'M4.RPT.PR',      title: 'Purchase Requisition (PR)',   path: '/purchasing/reports/purchase-requisitions', legacyCode: '4-31' },
      { code: 'M4.RPT.RFQ',     title: 'Request for Quotation (RFQ)', path: '/purchasing/reports/rfqs',                  legacyCode: '4-33' },
      { code: 'M4.RPT.BS',      title: 'Bid Comparison (BS)',         path: '/purchasing/reports/bid-comparisons',       legacyCode: '4-34' },
      { code: 'M4.RPT.PO',      title: 'Purchase Order (PO)',         path: '/purchasing/reports/purchase-orders',       legacyCode: '4-35' },
      { code: 'M4.RPT.AP',      title: 'Vendor Advance (AP)',         path: '/purchasing/reports/vendor-advances',       legacyCode: '4-36' },
      { code: 'M4.RPT.GRN',     title: 'Goods Receipt (GRN)',         path: '/purchasing/reports/goods-receipts',        legacyCode: '4-38' },
      { code: 'M4.RPT.PI',      title: 'Purchase Invoice (PI)',       path: '/purchasing/reports/purchase-invoices',     legacyCode: '4-39' },
      { code: 'M4.RPT.PP',      title: 'Freight Payable (PP)',        path: '/purchasing/reports/freight-payables',      legacyCode: '4-46' },
      { code: 'M4.RPT.DNR',     title: 'Return Shipment (DNR)',       path: '/purchasing/reports/return-shipments',      legacyCode: '4-40' },
      { code: 'M4.RPT.PRT',     title: 'Purchase Return (PRT)',       path: '/purchasing/reports/purchase-returns',      legacyCode: '4-41' },
      { code: 'M4.RPT.VPP',     title: 'Payment Schedule (VPP)',      path: '/purchasing/reports/payment-schedules',     legacyCode: '4-42' },
      { code: 'M4.RPT.VP',      title: 'Vendor Payment (VP)',         path: '/purchasing/reports/vendor-payments',       legacyCode: '4-43' },
      { code: 'M4.RPT.SUMMARY', title: 'Purchases',                   path: '/purchasing/reports/summary',               legacyCode: '4-50' },
    ], m4RptGrp.id);
  }

  // M5 Sales — active items only (skip SPA=Penyesuaian Poin, CL=Complain — mnactive=0 in legacy).
  // IC (Penagihan Piutang) and PV (Pembayaran Piutang) kept in M5 for discoverability;
  // actual posting goes via fin_ar_receipts.
  const m5Id = menuIds.get('M5');
  if (m5Id) {
    const m5TxGrp = await upsertMenu({ code: 'M5.TX', title: 'Transactions', type: ErpMenuType.GROUP, parentId: m5Id, sortOrder: 1, legacyCode: '5-2' });
    await upsertItems([
      { code: 'M5.TX.SQ',      title: 'Sales Quotation (SQ)',       path: '/sales/quotations',           legacyCode: '5-3'  },
      { code: 'M5.TX.SO',      title: 'Sales Order (SO)',           path: '/sales/orders',               legacyCode: '5-4'  },
      { code: 'M5.TX.AS',      title: 'Customer Advance (AS)',      path: '/sales/customer-advances',    legacyCode: '5-5'  },
      { code: 'M5.TX.IP',      title: 'Payment Receipt (IP)',       path: '/sales/payment-receipts',     legacyCode: '5-44' },
      { code: 'M5.TX.PI',      title: 'Proforma Invoice (PI)',      path: '/sales/proforma-invoices',    legacyCode: '5-9'  },
      { code: 'M5.TX.PL',      title: 'Packing List (PL)',          path: '/sales/packing-lists',        legacyCode: '5-6'  },
      { code: 'M5.TX.DO',      title: 'Delivery Order (DO)',        path: '/sales/delivery-orders',      legacyCode: '5-7'  },
      { code: 'M5.TX.DR',      title: 'Delivery Report (DR)',       path: '/sales/delivery-reports',     legacyCode: '5-8'  },
      { code: 'M5.TX.SI',      title: 'Sales Invoice (SI)',         path: '/sales/invoices',             legacyCode: '5-10' },
      { code: 'M5.TX.RP',      title: 'Freight Receivable (RP)',    path: '/sales/freight-receivables',  legacyCode: '5-41' },
      { code: 'M5.TX.RNR',     title: 'Return Receipt (RNR)',       path: '/sales/return-receipts',      legacyCode: '5-11' },
      { code: 'M5.TX.SR',      title: 'Sales Return (SR)',          path: '/sales/returns',              legacyCode: '5-12' },
      { code: 'M5.TX.IC',      title: 'AR Collection (IC)',         path: '/sales/ar-collections',       legacyCode: '5-13' },
      { code: 'M5.TX.PV',      title: 'AR Payment (PV)',            path: '/sales/ar-payments',          legacyCode: '5-14' },
      { code: 'M5.TX.SIE',     title: 'Invoice Swap (SIE)',         path: '/sales/invoice-swaps',        legacyCode: '5-68' },
      { code: 'M5.TX.BALANCE', title: 'Opening AR Balance',         path: '/sales/opening-ar-balance',   legacyCode: '5-51' },
    ], m5TxGrp.id);

    const m5DataGrp = await upsertMenu({ code: 'M5.DATA', title: 'Data', type: ErpMenuType.GROUP, parentId: m5Id, sortOrder: 2, legacyCode: '5-15' });
    await upsertItems([
      { code: 'M5.DATA.SQ',      title: 'Sales Quotation (SQ)',     path: '/sales/data/quotations',          legacyCode: '5-16' },
      { code: 'M5.DATA.SO',      title: 'Sales Order (SO)',         path: '/sales/data/orders',              legacyCode: '5-17' },
      { code: 'M5.DATA.AS',      title: 'Customer Advance (AS)',    path: '/sales/data/customer-advances',   legacyCode: '5-18' },
      { code: 'M5.DATA.IP',      title: 'Payment Receipt (IP)',     path: '/sales/data/payment-receipts',    legacyCode: '5-45' },
      { code: 'M5.DATA.PI',      title: 'Proforma Invoice (PI)',    path: '/sales/data/proforma-invoices',   legacyCode: '5-22' },
      { code: 'M5.DATA.PL',      title: 'Packing List (PL)',        path: '/sales/data/packing-lists',       legacyCode: '5-19' },
      { code: 'M5.DATA.DO',      title: 'Delivery Order (DO)',      path: '/sales/data/delivery-orders',     legacyCode: '5-20' },
      { code: 'M5.DATA.DR',      title: 'Delivery Report (DR)',     path: '/sales/data/delivery-reports',    legacyCode: '5-21' },
      { code: 'M5.DATA.SI',      title: 'Sales Invoice (SI)',       path: '/sales/data/invoices',            legacyCode: '5-23' },
      { code: 'M5.DATA.RP',      title: 'Freight Receivable (RP)',  path: '/sales/data/freight-receivables', legacyCode: '5-42' },
      { code: 'M5.DATA.RNR',     title: 'Return Receipt (RNR)',     path: '/sales/data/return-receipts',     legacyCode: '5-24' },
      { code: 'M5.DATA.SR',      title: 'Sales Return (SR)',        path: '/sales/data/returns',             legacyCode: '5-25' },
      { code: 'M5.DATA.IC',      title: 'AR Collection (IC)',       path: '/sales/data/ar-collections',      legacyCode: '5-26' },
      { code: 'M5.DATA.PV',      title: 'AR Payment (PV)',          path: '/sales/data/ar-payments',         legacyCode: '5-27' },
      { code: 'M5.DATA.SIE',     title: 'Invoice Swap (SIE)',       path: '/sales/data/invoice-swaps',       legacyCode: '5-69' },
      { code: 'M5.DATA.BALANCE', title: 'Opening AR Balance',       path: '/sales/data/opening-ar-balance',  legacyCode: '5-52' },
    ], m5DataGrp.id);

    const m5RptGrp = await upsertMenu({ code: 'M5.RPT', title: 'Reports', type: ErpMenuType.GROUP, parentId: m5Id, sortOrder: 3, legacyCode: '5-28' });
    await upsertItems([
      { code: 'M5.RPT.SQ',          title: 'Sales Quotation (SQ)',     path: '/sales/reports/quotations',          legacyCode: '5-29' },
      { code: 'M5.RPT.SO',          title: 'Sales Order (SO)',         path: '/sales/reports/orders',              legacyCode: '5-30' },
      { code: 'M5.RPT.AS',          title: 'Customer Advance (AS)',    path: '/sales/reports/customer-advances',   legacyCode: '5-31' },
      { code: 'M5.RPT.IP',          title: 'Payment Receipt (IP)',     path: '/sales/reports/payment-receipts',    legacyCode: '5-46' },
      { code: 'M5.RPT.PI',          title: 'Proforma Invoice (PI)',    path: '/sales/reports/proforma-invoices',   legacyCode: '5-35' },
      { code: 'M5.RPT.PL',          title: 'Packing List (PL)',        path: '/sales/reports/packing-lists',       legacyCode: '5-32' },
      { code: 'M5.RPT.DO',          title: 'Delivery Order (DO)',      path: '/sales/reports/delivery-orders',     legacyCode: '5-33' },
      { code: 'M5.RPT.DR',          title: 'Delivery Report (DR)',     path: '/sales/reports/delivery-reports',    legacyCode: '5-34' },
      { code: 'M5.RPT.SI',          title: 'Sales Invoice (SI)',       path: '/sales/reports/invoices',            legacyCode: '5-36' },
      { code: 'M5.RPT.RP',          title: 'Freight Receivable (RP)',  path: '/sales/reports/freight-receivables', legacyCode: '5-43' },
      { code: 'M5.RPT.RNR',         title: 'Return Receipt (RNR)',     path: '/sales/reports/return-receipts',     legacyCode: '5-37' },
      { code: 'M5.RPT.SR',          title: 'Sales Return (SR)',        path: '/sales/reports/returns',             legacyCode: '5-38' },
      { code: 'M5.RPT.IC',          title: 'AR Collection (IC)',       path: '/sales/reports/ar-collections',      legacyCode: '5-39' },
      { code: 'M5.RPT.PV',          title: 'AR Payment (PV)',          path: '/sales/reports/ar-payments',         legacyCode: '5-40' },
      { code: 'M5.RPT.SIE',         title: 'Invoice Swap (SIE)',       path: '/sales/reports/invoice-swaps',       legacyCode: '5-70' },
      { code: 'M5.RPT.BALANCE',     title: 'Opening AR Balance',       path: '/sales/reports/opening-ar-balance',  legacyCode: '5-53' },
      { code: 'M5.RPT.SUMMARY',     title: 'Sales Summary',            path: '/sales/reports/summary',             legacyCode: '5-50' },
      { code: 'M5.RPT.BY-CUSTOMER', title: 'Sales by Customer',        path: '/sales/reports/by-customer',         legacyCode: '5-60' },
      { code: 'M5.RPT.BY-SALESMAN', title: 'Sales by Salesman',        path: '/sales/reports/by-salesman',         legacyCode: '5-61' },
      { code: 'M5.RPT.BY-ITEM',     title: 'Sales by Item',            path: '/sales/reports/by-item',             legacyCode: '5-62' },
      { code: 'M5.RPT.BY-PROJECT',  title: 'Sales by Project',         path: '/sales/reports/by-project',          legacyCode: '5-63' },
      { code: 'M5.RPT.BY-DIVISION', title: 'Sales by Division',        path: '/sales/reports/by-division',         legacyCode: '5-64' },
      { code: 'M5.RPT.BY-CC',       title: 'Sales by Cost Center',     path: '/sales/reports/by-cost-center',      legacyCode: '5-65' },
      { code: 'M5.RPT.BY-CATEGORY', title: 'Sales by Item Category',   path: '/sales/reports/by-item-category',    legacyCode: '5-66' },
      { code: 'M5.RPT.REVENUE',     title: 'Revenue & Collection',     path: '/sales/reports/revenue-collection',  legacyCode: '5-72' },
      { code: 'M5.RPT.BY-GROUP',    title: 'Sales by Group',           path: '/sales/reports/by-group',            legacyCode: '5-73' },
    ], m5RptGrp.id);
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

  const devUsers = [
    { code: 'ADMIN', name: 'Administrator', email: 'admin@senti-erp.local', password: 'Admin123!' },
    { code: 'rania', name: 'Rania', email: 'rania@senti-erp.local', password: 'sentient' },
  ];

  for (const u of devUsers) {
    const passwordHash = hashPassword(u.password);
    const user = await prisma.erpUser.upsert({
      where: { code: u.code },
      create: {
        code: u.code, name: u.name, email: u.email,
        passwordHash, level: ErpUserLevel.CENTRAL, language: 'id', isActive: true,
      },
      update: {},
    });
    await prisma.erpUserRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      create: { userId: user.id, roleId: role.id },
      update: {},
    });
  }

  console.log('✓ adm_roles, adm_users, adm_user_roles, adm_role_permissions, adm_role_menus');
}

async function seedNotifications() {
  const admin = await prisma.erpUser.findUnique({ where: { email: 'admin@senti-erp.local' } });
  if (!admin) {
    console.warn('  ! admin user not found, skip notifications seed');
    return;
  }
  const existing = await prisma.erpNotification.count({ where: { recipientId: admin.id } });
  if (existing > 0) {
    console.log(`✓ sys_notifications (skip, ${existing} sudah ada untuk admin)`);
    return;
  }
  const now = Date.now();
  const items = [
    { type: 'warn', title: 'Menunggu persetujuan', body: 'CR-2605-2398 (Rp 4.250.000) perlu Anda setujui.', referenceEntity: 'fin_ar_receipts', actionUrl: '/finance/cash-receipts', minutesAgo: 2, read: false },
    { type: 'success', title: 'Dokumen diposting', body: 'RM-2605-0871 berhasil diposting oleh fitri.h.', referenceEntity: 'fin_receipt_memos', actionUrl: '/finance/receipt-memos', minutesAgo: 14, read: false },
    { type: 'danger', title: 'Transaksi ditolak', body: 'CD-2605-1640 ditolak oleh maya.p — cek catatan.', referenceEntity: 'fin_ap_payments', actionUrl: '/finance/cash-disbursements', minutesAgo: 38, read: false },
    { type: 'info', title: 'Stok menipis', body: 'Bearing 6204 di bawah minimum (sisa 12 PCS).', referenceEntity: 'md_items', actionUrl: '/master/items', minutesAgo: 60, read: true },
    { type: 'info', title: 'Giro jatuh tempo', body: 'RG-2605-0231 jatuh tempo besok (20/06/2026).', referenceEntity: 'fin_giros', actionUrl: '/finance/receipt-giros', minutesAgo: 180, read: true },
    { type: 'success', title: 'Backup harian selesai', body: 'Backup database 02:00 WIB sukses.', referenceEntity: null, actionUrl: null, minutesAgo: 60 * 20, read: true },
  ];
  for (const it of items) {
    const createdAt = new Date(now - it.minutesAgo * 60_000);
    await prisma.erpNotification.create({
      data: {
        recipientId: admin.id,
        type: it.type,
        title: it.title,
        body: it.body,
        referenceEntity: it.referenceEntity ?? undefined,
        actionUrl: it.actionUrl ?? undefined,
        createdAt,
        readAt: it.read ? createdAt : null,
      },
    });
  }
  console.log(`✓ sys_notifications (${items.length} contoh untuk admin)`);
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
  await seedNotifications();
  console.log('\n✅ ERP seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
