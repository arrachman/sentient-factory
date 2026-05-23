/**
 * Sidebar navigation tree + per-route page metadata.
 * Ported from prototype `sidebar.jsx` (NAV) and the `pageMeta` helper.
 */
import type { IconName } from '@/components/ui/icons';

export interface NavLeaf {
  id: string;
  label: string;
  code?: string;
}

export interface NavGroup {
  group: string;
  items: NavLeaf[];
}

export interface NavItem {
  id?: string;
  icon?: IconName;
  label?: string;
  children?: NavLeaf[] | NavGroup[];
  divider?: boolean;
}

export const NAV: NavItem[] = [
  { id: 'home', icon: 'home', label: 'Dashboard' },
  { id: 'statistik', icon: 'stats', label: 'Statistik' },
  {
    id: 'org',
    icon: 'database',
    label: 'Organization',
    children: [
      { id: '/org/branches', label: 'Branch', code: 'BRN' },
      { id: '/org/locations', label: 'Location', code: 'LOC' },
      { id: '/org/warehouses', label: 'Warehouse', code: 'WHS' },
      { id: '/org/divisions', label: 'Division', code: 'DIV' },
      { id: '/org/sub-divisions', label: 'Sub Division', code: 'SDIV' },
      { id: '/org/projects', label: 'Project', code: 'PRJ' },
      { id: '/org/cost-centers', label: 'Cost Center', code: 'CC' },
      { id: '/org/departments', label: 'Department', code: 'DEPT' },
      { id: '/org/sub-departments', label: 'Sub Department', code: 'SDEPT' },
    ],
  },
  {
    id: 'master',
    icon: 'database',
    label: 'Data Master',
    children: [
      { id: 'md-items', label: 'Item', code: 'ITM' },
      { id: 'md-partners', label: 'Partner', code: 'PTR' },
      { id: 'md-item-categories', label: 'Kategori Item', code: 'ICAT' },
      { id: 'md-units', label: 'Satuan', code: 'UOM' },
      { id: 'm-customer', label: 'Customer (lama)', code: 'CUS' },
      { id: 'm-supplier', label: 'Supplier (lama)', code: 'SUP' },
      { id: 'm-coa', label: 'Chart of Account', code: 'CoA' },
      { id: 'm-lokasi', label: 'Cabang & Lokasi', code: 'LOC' },
      { id: 'm-costcenter', label: 'Cost Center', code: 'CC' },
      { id: '/master/colors', label: 'Warna', code: 'CLR' },
      { id: '/master/item-permissions', label: 'Izin Item', code: 'IPM' },
      { id: '/master/price-indices', label: 'Price Index', code: 'PRX' },
      { id: '/master/item-informations', label: 'Info Item', code: 'INF' },
    ],
  },
  {
    id: 'keuangan',
    icon: 'coins',
    label: 'Keuangan',
    children: [
      {
        group: 'Transaksi',
        items: [
          { id: 'kas-masuk', label: 'Kas Masuk', code: 'CR' },
          { id: 'kas-keluar', label: 'Kas Keluar', code: 'CD' },
          { id: 'bank-masuk', label: 'Bank Masuk', code: 'RM' },
          { id: 'bank-keluar', label: 'Bank Keluar', code: 'SM' },
          { id: 'jurnal-umum', label: 'Jurnal Umum', code: 'GJ' },
          { id: 'giro-masuk', label: 'Giro Masuk', code: 'RG' },
          { id: 'giro-keluar', label: 'Giro Keluar', code: 'SG' },
          { id: 'giro-masuk-batal', label: 'Giro Masuk Batal', code: 'RGC' },
          { id: 'giro-keluar-batal', label: 'Giro Keluar Batal', code: 'SGC' },
          { id: 'saldo-awal', label: 'Saldo Awal Coa', code: 'CB' },
          { id: 'buku-besar', label: 'Buku Besar', code: 'GL' },
        ],
      },
      {
        group: 'Laporan',
        items: [
          { id: 'rep-neraca', label: 'Neraca', code: 'BS' },
          { id: 'rep-labarugi', label: 'Laba Rugi', code: 'PL' },
          { id: 'rep-aruskas', label: 'Arus Kas', code: 'CF' },
          { id: 'rep-modal', label: 'Perubahan Modal', code: 'EQ' },
        ],
      },
    ],
  },
  {
    id: 'persediaan',
    icon: 'boxes',
    label: 'Persediaan',
    children: [
      { id: 'inv-opname', label: 'Stock Opname', code: 'SO' },
      { id: 'inv-mutasi', label: 'Mutasi Stok', code: 'MS' },
      { id: 'inv-adjust', label: 'Penyesuaian', code: 'AJ' },
      { id: 'inv-transfer', label: 'Transfer Gudang', code: 'TG' },
    ],
  },
  {
    id: 'pembelian',
    icon: 'cart',
    label: 'Pembelian',
    children: [
      { id: 'pur-po', label: 'PO Pembelian', code: 'PO' },
      { id: 'pur-receipt', label: 'Penerimaan Barang', code: 'PR' },
      { id: 'pur-invoice', label: 'Faktur Pembelian', code: 'PI' },
      { id: 'pur-return', label: 'Retur Pembelian', code: 'PRT' },
    ],
  },
  {
    id: 'sales',
    icon: 'tag',
    label: 'Sales',
    children: [
      { id: 'sales-order', label: 'SO Penjualan', code: 'SO' },
      { id: 'sal-do', label: 'Pengiriman', code: 'DO' },
      { id: 'sal-invoice', label: 'Faktur Penjualan', code: 'SI' },
      { id: 'sal-return', label: 'Retur Penjualan', code: 'SRT' },
    ],
  },
  {
    id: 'produksi',
    icon: 'factory',
    label: 'Produksi',
    children: [
      { id: 'prd-wo', label: 'Work Order', code: 'WO' },
      { id: 'prd-bom', label: 'BOM', code: 'BOM' },
      { id: 'prd-output', label: 'Output Produksi', code: 'OP' },
    ],
  },
  {
    id: 'fixed-asset',
    icon: 'layers',
    label: 'Fixed Asset',
    children: [
      { id: 'fa-list', label: 'Daftar Aset', code: 'FA' },
      { id: 'fa-deprec', label: 'Penyusutan', code: 'DEP' },
      { id: 'fa-disposal', label: 'Disposal', code: 'DSP' },
    ],
  },
  { divider: true },
  {
    id: 'setting',
    icon: 'gear',
    label: 'Setting',
    children: [
      { id: 'adm-users', label: 'Users', code: 'USR' },
      { id: 'adm-roles', label: 'Roles', code: 'ROL' },
      { id: 'adm-branches', label: 'Cabang', code: 'BRN' },
      { id: 'adm-settings', label: 'System Settings', code: 'SET' },
      { id: 'set-users', label: 'Users (lama)', code: 'U' },
      { id: 'set-roles', label: 'Roles (lama)', code: 'R' },
      { id: 'set-prefs', label: 'Preferensi', code: 'PR' },
      { id: 'set-appearance', label: 'Tampilan', code: 'UI' },
    ],
  },
];

export function isNavGroupArray(
  children: NavLeaf[] | NavGroup[] | undefined,
): children is NavGroup[] {
  return Array.isArray(children) && !!children[0] && 'group' in children[0];
}

export interface Crumb {
  label: string;
  onClick?: () => void;
}

export interface PageMeta {
  title: string;
  icon: IconName;
  code?: string;
  crumbs: Crumb[];
}

/**
 * Title/breadcrumb for ERP routes keyed by the seeded `sys_menus.path`
 * (canonical id). Keeps tabs/breadcrumbs readable when the active route is
 * a raw path emitted by the dynamic sidebar.
 */
const ERP_ROUTE_META: Record<string, { group: string; title: string; icon: IconName }> = {
  '/admin/users': { group: 'Administrator', title: 'Users', icon: 'gear' },
  '/admin/roles': { group: 'Administrator', title: 'Roles', icon: 'gear' },
  '/admin/permissions': { group: 'Administrator', title: 'Permissions', icon: 'gear' },
  '/admin/menus': { group: 'Administrator', title: 'Menu Manager', icon: 'gear' },
  '/admin/settings': { group: 'Administrator', title: 'System Settings', icon: 'gear' },
  '/admin/document-numbering': { group: 'Administrator', title: 'Document Numbering', icon: 'gear' },
  '/admin/fiscal-periods': { group: 'Administrator', title: 'Fiscal Periods', icon: 'gear' },
  '/admin/preferences': { group: 'Administrator', title: 'Preferensi', icon: 'gear' },
  '/master/branches': { group: 'Data Master', title: 'Branch', icon: 'database' },
  '/master/locations': { group: 'Data Master', title: 'Location', icon: 'database' },
  '/master/warehouses': { group: 'Data Master', title: 'Warehouse', icon: 'database' },
  '/master/items': { group: 'Data Master', title: 'Item', icon: 'database' },
  '/master/item-categories': { group: 'Data Master', title: 'Item Categories', icon: 'database' },
  '/master/units': { group: 'Data Master', title: 'Units', icon: 'database' },
  '/master/partners': { group: 'Data Master', title: 'Partner', icon: 'database' },
  '/master/vendors': { group: 'Data Master', title: 'Vendor', icon: 'database' },
  '/master/partner-categories': { group: 'Data Master', title: 'Partner Categories', icon: 'database' },
  '/master/accounts': { group: 'Data Master', title: 'Chart of Accounts', icon: 'database' },
  '/master/currencies': { group: 'Data Master', title: 'Currencies', icon: 'database' },
  '/master/taxes': { group: 'Data Master', title: 'Taxes', icon: 'database' },
  '/master/payment-terms': { group: 'Data Master', title: 'Payment Terms', icon: 'database' },
  '/master/divisions': { group: 'Data Master', title: 'Division', icon: 'database' },
  '/master/subdivisions': { group: 'Data Master', title: 'Sub Division', icon: 'database' },
  // MD legacy batch (2026-05-20)
  '/master/colors': { group: 'Data Master', title: 'Color', icon: 'database' },
  '/master/item-permissions': { group: 'Data Master', title: 'Item Permissions', icon: 'database' },
  '/master/brands': { group: 'Data Master', title: 'Brand', icon: 'database' },
  '/master/materials': { group: 'Data Master', title: 'Material', icon: 'database' },
  '/master/models': { group: 'Data Master', title: 'Model', icon: 'database' },
  '/master/sizes': { group: 'Data Master', title: 'Size', icon: 'database' },
  '/master/sections': { group: 'Data Master', title: 'Section', icon: 'database' },
  '/master/item-types': { group: 'Data Master', title: 'Item Type', icon: 'database' },
  '/master/product-classes': { group: 'Data Master', title: 'Product Class', icon: 'database' },
  '/master/classes': { group: 'Data Master', title: 'Class', icon: 'database' },
  '/master/banks': { group: 'Data Master', title: 'Bank', icon: 'database' },
  '/master/expeditions': { group: 'Data Master', title: 'Expedition', icon: 'database' },
  '/master/other-costs': { group: 'Data Master', title: 'Other Cost', icon: 'database' },
  '/master/commissions': { group: 'Data Master', title: 'Commission', icon: 'database' },
  '/master/item-txn-types': { group: 'Data Master', title: 'Item Transaction Type', icon: 'database' },
  '/master/countries': { group: 'Data Master', title: 'Country', icon: 'database' },
  '/master/provinces': { group: 'Data Master', title: 'Province', icon: 'database' },
  '/master/cities': { group: 'Data Master', title: 'City', icon: 'database' },
  '/master/areas': { group: 'Data Master', title: 'Area', icon: 'database' },
  '/master/item-locations': { group: 'Data Master', title: 'Item Location', icon: 'database' },
  '/master/customer-categories': { group: 'Data Master', title: 'Customer Category', icon: 'database' },
  '/master/supplier-categories': { group: 'Data Master', title: 'Supplier Category', icon: 'database' },
  '/master/salesman-categories': { group: 'Data Master', title: 'Salesman Category', icon: 'database' },
  '/master/price-categories': { group: 'Data Master', title: 'Price Category', icon: 'database' },
  '/master/transaction-notes': { group: 'Data Master', title: 'Transaction Note', icon: 'database' },
  '/master/txn-note-details': { group: 'Data Master', title: 'Txn Note Detail', icon: 'database' },
  // MD production batch (2026-05-23)
  '/master/production-categories': { group: 'Data Master', title: 'Production Category', icon: 'database' },
  '/master/point-categories': { group: 'Data Master', title: 'Point Category', icon: 'database' },
  '/master/miscellaneous': { group: 'Data Master', title: 'Miscellaneous', icon: 'database' },
  '/master/sub-classes': { group: 'Data Master', title: 'Sub Class', icon: 'database' },
  '/master/work-estimates': { group: 'Data Master', title: 'Work Estimate', icon: 'database' },
  '/master/labors': { group: 'Data Master', title: 'Labor', icon: 'database' },
  '/master/machines': { group: 'Data Master', title: 'Machine', icon: 'database' },
  '/master/designers': { group: 'Data Master', title: 'Designer', icon: 'database' },
  '/master/production-activities': { group: 'Data Master', title: 'Production Activity', icon: 'database' },
  '/master/production-routes': { group: 'Data Master', title: 'Production Route', icon: 'database' },
  '/master/price-indices': { group: 'Data Master', title: 'Price Index', icon: 'database' },
  '/master/item-informations': { group: 'Data Master', title: 'Item Information', icon: 'database' },
  '/org/branches': { group: 'Organization', title: 'Branch', icon: 'database' },
  '/org/locations': { group: 'Organization', title: 'Location', icon: 'database' },
  '/org/warehouses': { group: 'Organization', title: 'Warehouse', icon: 'database' },
  '/org/divisions': { group: 'Organization', title: 'Division', icon: 'database' },
  '/org/sub-divisions': { group: 'Organization', title: 'Sub Division', icon: 'database' },
  '/org/projects': { group: 'Organization', title: 'Project', icon: 'database' },
  '/org/cost-centers': { group: 'Organization', title: 'Cost Center', icon: 'database' },
  '/org/departments': { group: 'Organization', title: 'Department', icon: 'database' },
  '/org/sub-departments': { group: 'Organization', title: 'Sub Department', icon: 'database' },
  '/finance/general-journals': { group: 'Finance', title: 'General Journal', icon: 'calculator' },
  '/finance/receipt-memos': { group: 'Finance', title: 'Receipt Memo', icon: 'calculator' },
  '/finance/send-memos': { group: 'Finance', title: 'Send Memo', icon: 'calculator' },
  '/finance/cash-receipts': { group: 'Finance', title: 'Cash Receipt', icon: 'calculator' },
  '/finance/cash-disbursements': { group: 'Finance', title: 'Cash Disbursement', icon: 'calculator' },
  '/finance/bank-disbursements': { group: 'Finance', title: 'Bank Disbursement', icon: 'calculator' },
  '/finance/cashbank-transfers': { group: 'Finance', title: 'Cash/Bank Transfer', icon: 'calculator' },
  '/finance/receipt-giros': { group: 'Finance', title: 'Receipt Giro', icon: 'calculator' },
  '/finance/send-giros': { group: 'Finance', title: 'Send Giro', icon: 'calculator' },
  '/finance/receipt-giro-clearings': { group: 'Finance', title: 'Receipt Giro Clearing', icon: 'calculator' },
  '/finance/send-giro-clearings': { group: 'Finance', title: 'Send Giro Clearing', icon: 'calculator' },
  '/finance/adjustment-journals': { group: 'Finance', title: 'Adjustment Journal', icon: 'calculator' },
  '/finance/ledger': { group: 'Finance', title: 'General Ledger', icon: 'calculator' },
  '/settings/appearance': { group: 'Administrator', title: 'Appearance', icon: 'gear' },
};

/** Resolve a route id to its title/icon/breadcrumb — mirrors prototype `pageMeta`. */
export function pageMeta(route: string, t: (k: string) => string): PageMeta {
  const erpMeta = ERP_ROUTE_META[route];
  if (erpMeta) {
    return {
      title: t(erpMeta.title),
      icon: erpMeta.icon,
      crumbs: [{ label: t(erpMeta.group) }, { label: t(erpMeta.title) }],
    };
  }
  if (route === 'home') {
    return { title: t('Dashboard'), icon: 'home', crumbs: [{ label: t('Dashboard') }] };
  }
  if (route === 'statistik') {
    return { title: t('Statistik'), icon: 'stats', crumbs: [{ label: t('Statistik') }] };
  }
  for (const top of NAV) {
    if (top.divider || !top.children) continue;
    const leaves: NavLeaf[] = isNavGroupArray(top.children)
      ? top.children.flatMap((g) => g.items)
      : top.children;
    const leaf = leaves.find((l) => l.id === route);
    if (leaf) {
      return {
        title: t(leaf.label),
        icon: top.icon ?? 'file',
        code: leaf.code,
        crumbs: [{ label: t(top.label ?? '') }, { label: t(leaf.label) }],
      };
    }
  }
  return { title: route, icon: 'file', crumbs: [{ label: route }] };
}
