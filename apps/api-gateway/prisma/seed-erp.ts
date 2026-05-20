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
  const moduleStubs: Array<{ code: string; title: string; icon: string; legacyCode: string; sortOrder: number }> = [
    { code: 'M2',  title: 'Finance & Accounting', icon: 'calculator',   legacyCode: '2-1',  sortOrder: 3  },
    { code: 'M3',  title: 'Warehouse & Inventory', icon: 'boxes',       legacyCode: '3-1',  sortOrder: 4  },
    { code: 'M4',  title: 'Purchasing',            icon: 'shopping-cart', legacyCode: '4-1',  sortOrder: 5  },
    { code: 'M5',  title: 'Sales',                 icon: 'trending-up',  legacyCode: '5-1',  sortOrder: 6  },
    { code: 'M6',  title: 'Production',            icon: 'factory',      legacyCode: '6-1',  sortOrder: 7  },
    { code: 'M7',  title: 'Fixed Assets',          icon: 'building',     legacyCode: '7-1',  sortOrder: 8  },
    { code: 'M8',  title: 'Dashboard',             icon: 'layout-dashboard', legacyCode: '8-1', sortOrder: 9  },
    { code: 'M10', title: 'HR & Payroll',          icon: 'users-round',  legacyCode: '10-1', sortOrder: 10 },
    { code: 'M11', title: 'Hospital',              icon: 'hospital',     legacyCode: '11-1', sortOrder: 11 },
    { code: 'M12', title: 'Point of Sales',        icon: 'shopping-bag', legacyCode: '12-1', sortOrder: 12 },
    { code: 'M13', title: 'Academic',              icon: 'graduation-cap', legacyCode: '13-1', sortOrder: 13 },
    { code: 'M14', title: 'Cooperative',           icon: 'handshake',    legacyCode: '14-1', sortOrder: 14 },
  ];
  for (const s of moduleStubs) {
    await upsertMenu({ code: s.code, title: s.title, icon: s.icon, type: ErpMenuType.MODULE, sortOrder: s.sortOrder, legacyCode: s.legacyCode });
  }

  // M2 Finance — skeleton CRUD items (m2 MVP, no posting/balancing yet)
  const m2Id = menuIds.get('M2');
  if (m2Id) {
    const m2TxGrp = await upsertMenu({ code: 'M2.TX', title: 'Transactions', type: ErpMenuType.GROUP, parentId: m2Id, sortOrder: 1 });
    await upsertItems([
      { code: 'M2.TX.JOURNAL',     title: 'Journal Entries', path: '/keuangan/journal-entries' },
      { code: 'M2.TX.AR-RECEIPT',  title: 'AR Receipts',     path: '/keuangan/ar-receipts' },
      { code: 'M2.TX.AP-PAYMENT',  title: 'AP Payments',     path: '/keuangan/ap-payments' },
      { code: 'M2.TX.GIRO',        title: 'Giros',           path: '/keuangan/giros' },
    ], m2TxGrp.id);
    const m2RptGrp = await upsertMenu({ code: 'M2.RPT', title: 'Reports', type: ErpMenuType.GROUP, parentId: m2Id, sortOrder: 2 });
    await upsertItems([
      { code: 'M2.RPT.LEDGER',     title: 'General Ledger',  path: '/keuangan/ledger' },
    ], m2RptGrp.id);
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
