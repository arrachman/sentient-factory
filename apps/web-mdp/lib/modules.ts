import type { LucideIcon } from 'lucide-react';
import {
  Factory,
  ShieldCheck,
  Wrench,
  Warehouse,
  AlertTriangle,
  FileText,
  HardHat,
  GraduationCap,
  Gauge,
  Boxes,
} from 'lucide-react';

export type ModuleStatus = 'planned' | 'in-progress' | 'live';

export interface MdpModule {
  /** Canonical short id (route segment under /app). */
  readonly id: string;
  readonly name: string;
  /** ISA-95 / MOM system label from the reference diagram. */
  readonly system: string;
  readonly description: string;
  /** DB domain prefix(es) this module owns. */
  readonly domains: readonly string[];
  readonly icon: LucideIcon;
  readonly status: ModuleStatus;
  /** App route if the module has a live page; absent = not yet routed. */
  readonly route?: string;
}

/**
 * The eight MOM modules + the OEE overlay, ordered by the build sequence
 * defined in db-design/module-roadmap.md. `mdp`/`eam` foundation domains are
 * shared and not surfaced as standalone modules here.
 */
export const MDP_MODULES: readonly MdpModule[] = [
  {
    id: 'mes',
    name: 'Eksekusi Produksi',
    system: 'MES',
    description: 'Jalankan & catat produksi dari work order ERP (entry manual).',
    domains: ['mes', 'eam'],
    icon: Factory,
    status: 'in-progress',
    route: '/app/mes',
  },
  {
    id: 'wms',
    name: 'Eksekusi Gudang',
    system: 'WMS',
    description: 'Putaway, picking, dan perpindahan stok fisik → feed ERP inv.',
    domains: ['wms'],
    icon: Warehouse,
    status: 'in-progress',
    route: '/app/wms',
  },
  {
    id: 'qms',
    name: 'Kualitas',
    system: 'QMS',
    description: 'Inspeksi, nonconformance (NCR), dan tindakan CAPA.',
    domains: ['qms'],
    icon: ShieldCheck,
    status: 'in-progress',
    route: '/app/quality',
  },
  {
    id: 'cmms',
    name: 'Pemeliharaan',
    system: 'CMMS',
    description: 'Work order pemeliharaan, jadwal PM, dan spare parts.',
    domains: ['mnt', 'eam'],
    icon: Wrench,
    status: 'planned',
  },
  {
    id: 'prts',
    name: 'Problem & Tracking',
    system: 'PRTS',
    description: 'Andon, penangkapan masalah, dan eskalasi.',
    domains: ['prt'],
    icon: AlertTriangle,
    status: 'planned',
  },
  {
    id: 'dms',
    name: 'Dokumen',
    system: 'DMS',
    description: 'Dokumen terkontrol, revisi, dan acknowledgement.',
    domains: ['dms'],
    icon: FileText,
    status: 'planned',
  },
  {
    id: 'ims',
    name: 'QHSE Terpadu',
    system: 'IMS',
    description: 'Insiden, audit, dan izin kerja (permit-to-work).',
    domains: ['ehs'],
    icon: HardHat,
    status: 'planned',
  },
  {
    id: 'lms',
    name: 'Pelatihan',
    system: 'LMS',
    description: 'Kursus, enrollment, dan matriks kompetensi.',
    domains: ['lms'],
    icon: GraduationCap,
    status: 'planned',
  },
  {
    id: 'oee',
    name: 'OEE',
    system: 'Metrik',
    description: 'Availability × Performance × Quality — overlay dari MES/CMMS/QMS.',
    domains: ['mes', 'mnt', 'qms'],
    icon: Gauge,
    status: 'planned',
  },
  {
    id: 'eam',
    name: 'Registry Aset',
    system: 'EAM · L3–L4',
    description: 'Master equipment yang dirawat; jembatan ke ERP fixed asset.',
    domains: ['eam'],
    icon: Boxes,
    status: 'planned',
  },
];
