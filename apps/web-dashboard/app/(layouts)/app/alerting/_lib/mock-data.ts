export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'open' | 'acknowledged' | 'resolved' | 'muted';

export type AlertSummaryItem = {
  label: string;
  value: string;
  delta: string;
};

export type AlertEvent = {
  id: string;
  title: string;
  module: 'Sales' | 'Finance' | 'Warehouse' | 'Purchasing';
  severity: AlertSeverity;
  status: AlertStatus;
  detectedAt: string;
  source: string;
  channels: string[];
  owner: string;
  description: string;
};

export type AlertRule = {
  id: string;
  name: string;
  module: string;
  severity: AlertSeverity;
  schedule: string;
  channels: string[];
  isActive: boolean;
  lastRun: string;
};

export type AlertTemplate = {
  id: string;
  name: string;
  description: string;
  severity: AlertSeverity;
  recommendedChannels: string[];
};

export type NotificationChannel = {
  id: string;
  type: 'WhatsApp Personal' | 'WhatsApp Group' | 'Email';
  label: string;
  target: string;
  status: 'connected' | 'draft' | 'failed';
  ownership: 'standalone' | 'internal_user';
  ownerLabel?: string;
};

export type NotificationLog = {
  id: string;
  alertId: string;
  channel: string;
  recipient: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  sentAt: string;
};

export const alertSummary: AlertSummaryItem[] = [
  { label: 'Active Alerts', value: '18', delta: '+3 today' },
  { label: 'Critical Alerts', value: '4', delta: '+1 today' },
  { label: 'Notifications Sent', value: '126', delta: 'last 24h' },
  { label: 'Failed Delivery', value: '7', delta: '-2 vs yesterday' },
];

export const alertEvents: AlertEvent[] = [
  {
    id: 'alrt-001',
    title: 'Daily sales dropped below threshold',
    module: 'Sales',
    severity: 'critical',
    status: 'open',
    detectedAt: '2026-04-17 08:15',
    source: 'Daily Sales Revenue',
    channels: ['WA Group', 'Email'],
    owner: 'Sales Manager',
    description: 'Daily sales is down 32% versus yesterday and below the configured minimum threshold.',
  },
  {
    id: 'alrt-002',
    title: 'Receivable aging spike',
    module: 'Finance',
    severity: 'high',
    status: 'acknowledged',
    detectedAt: '2026-04-17 07:40',
    source: 'Receivable Aging',
    channels: ['WA Personal', 'Email'],
    owner: 'Finance Lead',
    description: 'Outstanding invoices older than 30 days increased materially in the latest check.',
  },
  {
    id: 'alrt-003',
    title: 'Negative stock detected on fast moving SKU',
    module: 'Warehouse',
    severity: 'critical',
    status: 'open',
    detectedAt: '2026-04-17 06:55',
    source: 'Stock Position',
    channels: ['WA Group'],
    owner: 'Warehouse Supervisor',
    description: 'Fast moving SKU has negative on-hand balance in one warehouse location.',
  },
  {
    id: 'alrt-004',
    title: 'Purchase price variance exceeded limit',
    module: 'Purchasing',
    severity: 'medium',
    status: 'resolved',
    detectedAt: '2026-04-16 16:20',
    source: 'Purchase Price Comparison',
    channels: ['Email'],
    owner: 'Procurement Analyst',
    description: 'Latest purchase price exceeded expected variance but was already confirmed by buyer.',
  },
];

export const alertRules: AlertRule[] = [
  {
    id: 'rule-001',
    name: 'Sales Drop Alert',
    module: 'Sales',
    severity: 'critical',
    schedule: 'Every 15 minutes',
    channels: ['WA Group', 'Email'],
    isActive: true,
    lastRun: '2026-04-17 08:15',
  },
  {
    id: 'rule-002',
    name: 'Overdue Receivable Alert',
    module: 'Finance',
    severity: 'high',
    schedule: 'Hourly',
    channels: ['WA Personal', 'Email'],
    isActive: true,
    lastRun: '2026-04-17 08:00',
  },
  {
    id: 'rule-003',
    name: 'Negative Stock Alert',
    module: 'Warehouse',
    severity: 'critical',
    schedule: 'Every 15 minutes',
    channels: ['WA Group'],
    isActive: true,
    lastRun: '2026-04-17 08:15',
  },
  {
    id: 'rule-004',
    name: 'Purchase Price Spike',
    module: 'Purchasing',
    severity: 'medium',
    schedule: 'Daily 08:00',
    channels: ['Email'],
    isActive: false,
    lastRun: '2026-04-17 08:00',
  },
];

export const alertTemplates: AlertTemplate[] = [
  {
    id: 'tpl-001',
    name: 'Sales Drop Alert',
    description: 'Detects revenue drop compared to previous period and notifies sales leadership.',
    severity: 'critical',
    recommendedChannels: ['WA Group', 'Email'],
  },
  {
    id: 'tpl-002',
    name: 'Negative Stock Alert',
    description: 'Flags negative stock balances on selected warehouse or SKU groups.',
    severity: 'critical',
    recommendedChannels: ['WA Group'],
  },
  {
    id: 'tpl-003',
    name: 'Overdue Receivable Alert',
    description: 'Monitors overdue receivables and sends escalation to finance recipients.',
    severity: 'high',
    recommendedChannels: ['WA Personal', 'Email'],
  },
  {
    id: 'tpl-004',
    name: 'Cashflow Anomaly',
    description: 'Monitors unusual cash-in or cash-out changes across the selected period.',
    severity: 'high',
    recommendedChannels: ['Email'],
  },
];

export const notificationChannels: NotificationChannel[] = [
  {
    id: 'chn-001',
    type: 'WhatsApp Personal',
    label: 'Finance Lead',
    target: '+62812 1111 2222',
    status: 'connected',
    ownership: 'internal_user',
    ownerLabel: 'Finance Manager',
  },
  {
    id: 'chn-002',
    type: 'WhatsApp Group',
    label: 'Ops Alert Group',
    target: 'ops-alert-group',
    status: 'connected',
    ownership: 'standalone',
  },
  {
    id: 'chn-003',
    type: 'Email',
    label: 'Management Distribution',
    target: 'management@fr-labs.my.id',
    status: 'connected',
    ownership: 'standalone',
  },
  {
    id: 'chn-004',
    type: 'Email',
    label: 'Warehouse Team',
    target: 'warehouse@fr-labs.my.id',
    status: 'draft',
    ownership: 'internal_user',
    ownerLabel: 'Warehouse Supervisor',
  },
];

export const notificationLogs: NotificationLog[] = [
  { id: 'log-001', alertId: 'alrt-001', channel: 'WA Group', recipient: 'Ops Alert Group', status: 'delivered', sentAt: '2026-04-17 08:16' },
  { id: 'log-002', alertId: 'alrt-001', channel: 'Email', recipient: 'management@fr-labs.my.id', status: 'sent', sentAt: '2026-04-17 08:16' },
  { id: 'log-003', alertId: 'alrt-002', channel: 'WA Personal', recipient: '+62812 1111 2222', status: 'delivered', sentAt: '2026-04-17 07:41' },
  { id: 'log-004', alertId: 'alrt-003', channel: 'WA Group', recipient: 'Ops Alert Group', status: 'failed', sentAt: '2026-04-17 06:56' },
];

export function getAlertById(alertId: string) {
  return alertEvents.find((item) => item.id === alertId) ?? alertEvents[0];
}
