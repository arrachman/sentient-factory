/**
 * Definisi produk untuk dokumentasi multi-instance.
 * Satu sumber kebenaran: dipakai oleh docusaurus.config.ts (plugin docs +
 * navbar) dan portal landing (src/pages/index.tsx).
 *
 * Menambah produk baru cukup di sini: tambah entry → plugin docs, dropdown
 * navbar, dan kartu portal otomatis ikut.
 */

export type ProductDoc = {
  /** id instance plugin-content-docs (unik). */
  id: string;
  /** Label tampil di navbar & kartu portal. */
  label: string;
  /** Folder konten relatif terhadap root docs/. */
  path: string;
  /** Prefix route publik, mis. "/hr". */
  routeBasePath: string;
  /** Path file sidebar. */
  sidebarPath: string;
  /** Ringkasan untuk kartu portal. */
  tagline: string;
};

export const PRODUCT_DOCS: ProductDoc[] = [
  {
    id: 'hr',
    label: 'Senti HR',
    path: 'hr',
    routeBasePath: '/hr',
    sidebarPath: './sidebars-hr.ts',
    tagline: 'Time & Attendance / Workforce Management — absensi, wajah, GPS, jadwal, cuti.',
  },
  {
    id: 'erp',
    label: 'Senti ERP',
    path: 'erp',
    routeBasePath: '/erp',
    sidebarPath: './sidebars-erp.ts',
    tagline: 'Enterprise Resource Planning — master data, finance, purchasing, inventory.',
  },
  {
    id: 'mdp',
    label: 'Senti MDP',
    path: 'mdp',
    routeBasePath: '/mdp',
    sidebarPath: './sidebars-mdp.ts',
    tagline: 'Manufacturing Digitalization Platform (ISA-95 L3 / MOM) — MES, QMS, CMMS, WMS, OEE.',
  },
];
