/**
 * Mock data + icon registry untuk Home page.
 * Dipisah dari `page.tsx` agar halaman tetap < 400 LOC dan data mudah swap
 * ke API endpoint nyata di masa depan.
 */

export type IconName =
  | 'home'
  | 'sparkles'
  | 'grid'
  | 'bell'
  | 'shield'
  | 'chev'
  | 'search'
  | 'settings'
  | 'chart'
  | 'coin'
  | 'bolt'
  | 'factory'
  | 'box'
  | 'cart'
  | 'truck'
  | 'layers'
  | 'refresh';

export const kpis = [
  { l: 'Sales MTD', v: 'Rp 390,5 M', d: '+8.0%', up: true, sub: 'vs last month', icon: 'chart', tone: 'success', spark: [12, 18, 16, 22, 20, 28, 32, 30, 36, 42] },
  { l: 'Net Cashflow', v: 'Rp 1,6 M', d: '+20.0%', up: true, sub: 'March 2026', icon: 'coin', tone: 'primary', spark: [10, 14, 12, 18, 22, 20, 26, 28, 32, 30] },
  { l: 'Outstanding AR', v: 'Rp 845 Jt', d: '-3.2%', up: false, sub: '92 invoices open', icon: 'bolt', tone: 'warning', spark: [40, 38, 42, 36, 34, 30, 28, 32, 28, 26] },
  { l: 'Production Yield', v: '94.7%', d: '+0.8%', up: true, sub: '5 lines running', icon: 'factory', tone: 'info', spark: [88, 90, 89, 92, 91, 93, 94, 93, 95, 94] },
] as const;

export const modules = [
  { name: 'Finance', icon: 'coin', tone: 'primary', health: 'healthy', a: 2, kpi: 'Rp 1,6 M', k: 'Net Flow', trend: 20, hot: 'AR Aging 90+ rising in Jakarta' },
  { name: 'Warehouse', icon: 'box', tone: 'info', health: 'watch', a: 1, kpi: '12,408', k: 'SKU On Hand', trend: 1.2, hot: '7 SKU below safety stock' },
  { name: 'Purchase', icon: 'cart', tone: 'warning', health: 'watch', a: 1, kpi: '184', k: 'Active POs', trend: -3.4, hot: 'PT Cipta Logam lead time drift' },
  { name: 'Sales', icon: 'chart', tone: 'success', health: 'alert', a: 3, kpi: 'Rp 390,5 M', k: 'MTD Revenue', trend: 8, hot: 'Surabaya -31.6% yesterday' },
  { name: 'Production', icon: 'factory', tone: 'info', health: 'healthy', a: 0, kpi: '94.7%', k: 'Yield Rate', trend: 0.8, hot: 'Line C stopped - maintenance' },
  { name: 'Delivery', icon: 'truck', tone: 'primary', health: 'watch', a: 1, kpi: '98.2%', k: 'On-time', trend: -0.4, hot: '2 shipments delayed today' },
] as const;

export const sentiPrompts = [
  { i: 'chart', t: 'Sales vs collection 3 bulan terakhir' },
  { i: 'coin', t: 'Customer berisiko aging > 90 hari' },
  { i: 'box', t: 'Stok yang akan habis 14 hari ke depan' },
  { i: 'cart', t: 'Lead time supplier paling lambat' },
] as const;

export const alerts = [
  { sev: 'critical', t: 'Daily sales dropped -31.6% di Surabaya', m: 'Sales', at: '2m' },
  { sev: 'critical', t: 'Dead-letter triage requires action', m: 'Alerting', at: '5m' },
  { sev: 'high', t: 'Overdue receivable naik materially di Jakarta', m: 'Finance', at: '8m' },
  { sev: 'high', t: 'Stock Aluminum Sheet 3mm di bawah minimum', m: 'Warehouse', at: '14m' },
  { sev: 'medium', t: 'Lead time drift PT Cipta Logam Nusantara', m: 'Purchase', at: '21m' },
  { sev: 'medium', t: 'Line C Assembly stopped - operator dispatched', m: 'Production', at: '28m' },
] as const;

export const tasks = [
  { t: 'Approve PO-2026-0218 (PT Cipta Logam)', who: 'Procurement Lead', due: 'Hari ini, 16:00', p: 'high' },
  { t: 'Verifikasi rekonsiliasi BCA Main Account', who: 'Finance Manager', due: 'Hari ini, 17:30', p: 'high' },
  { t: 'Review escalation rule untuk Sales drop', who: 'Ops Alert Group', due: 'Besok, 10:00', p: 'medium' },
  { t: 'Update jadwal preventive maintenance Line C', who: 'Production Manager', due: 'Besok, 14:00', p: 'medium' },
] as const;

export const factoryStatus = [
  { name: 'Cibitung-1', type: 'Plant', st: 'running', load: 86 },
  { name: 'Cibitung-2', type: 'Plant', st: 'running', load: 72 },
  { name: 'Surabaya-A', type: 'Warehouse', st: 'running', load: 64 },
  { name: 'Bekasi-3', type: 'Warehouse', st: 'watch', load: 48 },
  { name: 'Surabaya-B', type: 'Warehouse', st: 'alert', load: 22 },
] as const;

export const dataFreshness = [
  { src: 'MyERPPlus - Sales', ago: '12s', st: 'ok' },
  { src: 'MyERPPlus - Finance', ago: '30s', st: 'ok' },
  { src: 'MyERPPlus - Inventory', ago: '1m', st: 'ok' },
  { src: 'WMS Realtime', ago: '8s', st: 'ok' },
  { src: 'Production MES', ago: '4m', st: 'stale' },
] as const;

export const activityStats = [
  { l: 'Senti Queries', v: '284', d: '+18%' },
  { l: 'Alerts Triggered', v: '16', d: '+4' },
  { l: 'Resolved', v: '42', d: '+12' },
  { l: 'Notif Delivered', v: '98', d: '100%' },
] as const;
