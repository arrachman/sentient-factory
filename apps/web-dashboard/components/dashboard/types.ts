export type KpiCard = {
  title: string;
  subtitle: string;
  value: string;
  delta: number;
  deltaLabel: string;
  status?: 'good' | 'warn' | 'bad';
  info?: string;
};

export type StatusItem = {
  key: string;
  label: string;
  value: number;
  color: string;
};

export type TimeseriesDatum = {
  date: string;
  [key: string]: string | number;
};

export type TimeseriesSeries = {
  key: string;
  label: string;
  color: string;
};

export type OutstandingTableRow = {
  location: string;
  referenceNumber: string;
  orderDate: string;
  dueDate: string;
  quantity: number;
  unit: string;
  flags: string[];
  status: string;
};

export type TopAmountRow = {
  initials: string;
  name: string;
  code: string;
  amount: string;
};

export type AgingRow = {
  label: string;
  days: number;
};
