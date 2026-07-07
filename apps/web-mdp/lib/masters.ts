import type { LucideIcon } from 'lucide-react';
import { Boxes, CalendarClock, Clock, Factory, ListTree, ShieldCheck, Tag } from 'lucide-react';

export interface MdpMaster {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  /** DB domain prefix this master lives under. */
  readonly domain: string;
  readonly icon: LucideIcon;
  readonly route: string;
}

/**
 * Foundation master data MES depends on (`mdp`/`eam`). Surfaced as a "Master"
 * section, distinct from the MOM modules in lib/modules.ts.
 */
export const MDP_MASTERS: readonly MdpMaster[] = [
  {
    id: 'work-centers',
    name: 'Work Center',
    description: 'Resource produksi (line / cell / station) untuk routing MES.',
    domain: 'eam',
    icon: Factory,
    route: '/app/master/work-centers',
  },
  {
    id: 'assets',
    name: 'Aset / Equipment',
    description: 'Master equipment yang dirawat; link opsional ke ERP fixed asset.',
    domain: 'eam',
    icon: Boxes,
    route: '/app/master/assets',
  },
  {
    id: 'shifts',
    name: 'Shift',
    description: 'Definisi shift kerja — basis MES & OEE availability.',
    domain: 'mdp',
    icon: Clock,
    route: '/app/master/shifts',
  },
  {
    id: 'reason-codes',
    name: 'Reason Code',
    description: 'Katalog alasan downtime / scrap / delay (typed).',
    domain: 'mdp',
    icon: Tag,
    route: '/app/master/reason-codes',
  },
  {
    id: 'work-calendars',
    name: 'Work Calendar',
    description: 'Planned operating time — basis OEE Availability.',
    domain: 'mdp',
    icon: CalendarClock,
    route: '/app/master/work-calendars',
  },
  {
    id: 'menus',
    name: 'Menu / Navigasi',
    description: 'SSOT navigasi shell MDP (mirror sys_menus).',
    domain: 'mdp',
    icon: ListTree,
    route: '/app/master/menus',
  },
  {
    id: 'role-menus',
    name: 'Akses Menu per Role',
    description: 'Peta akses role → menu (canView/canEdit); role dikelola di ERP.',
    domain: 'mdp',
    icon: ShieldCheck,
    route: '/app/master/role-menus',
  },
];
