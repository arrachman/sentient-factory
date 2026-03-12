export type NotificationPriority = 'Kritis' | 'Tinggi' | 'Sedang' | 'Info';
export type NotificationStatus = 'Belum Dibaca' | 'Diproses' | 'Updated Status' | 'Menunggu Approval' | 'Selesai';

export type NotificationItem = {
  id: string;
  title: string;
  module: string;
  reference: string;
  plant: string;
  timestamp: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  owner: string;
  action: string;
  description: string;
  isRead: boolean;
};

export const notificationItems: NotificationItem[] = [
  {
    id: 'NTF-MFG-001',
    title: 'Work order WO-PRD-240309 terlambat 95 menit',
    module: 'Produksi',
    reference: 'WO-PRD-240309',
    plant: 'Plant Cikarang',
    timestamp: '09 Mar 2026, 08:15',
    priority: 'Kritis',
    status: 'Belum Dibaca',
    owner: 'Supervisor Produksi',
    action: 'Investigasi line issue',
    description: 'Line mixing batch resin FR-22 belum mulai karena material additive A17 belum diposting ke staging issue.',
    isRead: false,
  },
  {
    id: 'NTF-QC-014',
    title: 'Hasil QC batch RMX-884 di bawah viskositas minimum',
    module: 'Quality Control',
    reference: 'QC-RMX-884',
    plant: 'Plant Cikarang',
    timestamp: '09 Mar 2026, 07:48',
    priority: 'Tinggi',
    status: 'Diproses',
    owner: 'QC Lab',
    action: 'Review disposition',
    description: 'Sampel intermediate untuk batch resin RMX-884 tercatat 12 cps di bawah standar dan menunggu disposition.',
    isRead: false,
  },
  {
    id: 'NTF-PPIC-022',
    title: 'MRP shortage untuk bahan baku Titanium Dioxide',
    module: 'PPIC',
    reference: 'MRP-260309-11',
    plant: 'Plant Tangerang',
    timestamp: '09 Mar 2026, 07:30',
    priority: 'Tinggi',
    status: 'Menunggu Approval',
    owner: 'Planner PPIC',
    action: 'Approve purchase requisition',
    description: 'Kebutuhan 3 hari ke depan lebih tinggi 1.2 ton dari stok available dan purchase requisition belum dirilis.',
    isRead: false,
  },
  {
    id: 'NTF-WHS-031',
    title: 'Penerimaan material PO-88421 menunggu putaway',
    module: 'Warehouse',
    reference: 'GR-PO-88421',
    plant: 'Plant Tangerang',
    timestamp: '09 Mar 2026, 06:55',
    priority: 'Sedang',
    status: 'Updated Status',
    owner: 'Koordinator Gudang',
    action: 'Konfirmasi putaway selesai',
    description: '12 pallet solvent S-91 sudah diterima namun belum dipindahkan ke bin kimia karena area karantina penuh.',
    isRead: true,
  },
  {
    id: 'NTF-MTN-006',
    title: 'Mesin extruder EX-03 mencapai preventive maintenance threshold',
    module: 'Maintenance',
    reference: 'PM-EX03-0309',
    plant: 'Plant Bekasi',
    timestamp: '09 Mar 2026, 06:20',
    priority: 'Sedang',
    status: 'Menunggu Approval',
    owner: 'Maintenance Planner',
    action: 'Approve downtime plan',
    description: 'Running hour extruder EX-03 melewati 1.000 jam dan akan berdampak ke schedule produksi batch compound minggu ini.',
    isRead: false,
  },
  {
    id: 'NTF-SHP-017',
    title: 'Delivery order DO-77219 siap dikirim ke pelanggan OEM',
    module: 'Logistik',
    reference: 'DO-77219',
    plant: 'Plant Bekasi',
    timestamp: '09 Mar 2026, 05:45',
    priority: 'Info',
    status: 'Selesai',
    owner: 'Admin Logistik',
    action: 'Release shipment',
    description: 'Finished goods untuk order sealant OEM sudah complete picking, packing list tervalidasi, dan armada standby di gate 2.',
    isRead: true,
  },
  {
    id: 'NTF-PRD-028',
    title: 'Status WO-CMP-771 diupdate ke partial completion 60%',
    module: 'Produksi',
    reference: 'WO-CMP-771',
    plant: 'Plant Bekasi',
    timestamp: '09 Mar 2026, 09:05',
    priority: 'Info',
    status: 'Updated Status',
    owner: 'Leader Shift Produksi',
    action: 'Pantau sisa output',
    description: 'Operator melaporkan 3 dari 5 lot compound sudah selesai dan sisa lot menunggu perubahan mould setup.',
    isRead: true,
  },
  {
    id: 'NTF-FIN-012',
    title: 'Goods receipt GR-PO-88421 menunggu approval costing',
    module: 'Finance Accounting',
    reference: 'GR-PO-88421',
    plant: 'Plant Tangerang',
    timestamp: '09 Mar 2026, 08:42',
    priority: 'Sedang',
    status: 'Menunggu Approval',
    owner: 'Cost Control',
    action: 'Approve landed cost',
    description: 'Selisih biaya freight inbound 4.8% melebihi toleransi dan perlu approval sebelum material dipakai di produksi.',
    isRead: false,
  },
  {
    id: 'NTF-QA-019',
    title: 'Deviation report DV-219 sudah diupdate dengan CAPA terbaru',
    module: 'Quality Assurance',
    reference: 'DV-219',
    plant: 'Plant Cikarang',
    timestamp: '09 Mar 2026, 08:58',
    priority: 'Sedang',
    status: 'Updated Status',
    owner: 'QA Supervisor',
    action: 'Verifikasi CAPA',
    description: 'Tim QA menambahkan corrective action untuk isu kontaminasi minor pada batch packing line 4.',
    isRead: true,
  },
];

export function priorityBadgeVariant(priority: NotificationPriority) {
  switch (priority) {
    case 'Kritis':
      return 'destructive';
    case 'Tinggi':
      return 'warning';
    case 'Sedang':
      return 'info';
    default:
      return 'secondary';
  }
}

export function statusBadgeVariant(status: NotificationStatus) {
  switch (status) {
    case 'Belum Dibaca':
      return 'warning';
    case 'Diproses':
      return 'info';
    case 'Updated Status':
      return 'secondary';
    case 'Menunggu Approval':
      return 'warning';
    default:
      return 'success';
  }
}
