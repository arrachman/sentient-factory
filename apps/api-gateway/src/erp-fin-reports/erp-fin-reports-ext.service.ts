import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReportColumn, ReportDocument, ReportRow, ReportSection } from './report-types';
import { ZERO, metaCabang, num, printedMeta } from './report-helpers';

@Injectable()
export class ErpFinReportsExtService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // 1. Cash Flow
  // ---------------------------------------------------------------------------
  async buildCashFlow(from: string, to: string, branchId?: string): Promise<ReportDocument> {
    const where: Prisma.ErpFinCashBankTransactionWhereInput = {
      deletedAt: null,
      transactionDate: { gte: new Date(from), lte: new Date(to) },
    };
    if (branchId) where.branchId = BigInt(branchId);

    const txns = await this.prisma.erpFinCashBankTransaction.findMany({
      where,
      select: { kind: true, direction: true, amount: true },
    });

    const columns: ReportColumn[] = [
      { key: 'Keterangan', label: 'Keterangan', type: 'text', width: 30 },
      { key: 'Kas', label: 'Kas (CASH)', type: 'number', align: 'right', width: 18 },
      { key: 'Bank', label: 'Bank', type: 'number', align: 'right', width: 18 },
      { key: 'Total', label: 'Total', type: 'number', align: 'right', width: 18 },
    ];

    const sumMap: Record<string, Record<string, Prisma.Decimal>> = {
      RECEIPT: { CASH: ZERO, BANK: ZERO },
      DISBURSEMENT: { CASH: ZERO, BANK: ZERO },
    };
    for (const t of txns) {
      const dir = t.direction as string;
      const kind = t.kind as string;
      if (sumMap[dir] && sumMap[dir][kind] !== undefined) {
        sumMap[dir][kind] = sumMap[dir][kind].add(t.amount);
      }
    }

    const makeSection = (dir: string, heading: string): ReportSection => {
      const cash = sumMap[dir].CASH;
      const bank = sumMap[dir].BANK;
      const total = cash.add(bank);
      const row: ReportRow = {
        cells: { Keterangan: heading, Kas: num(cash), Bank: num(bank), Total: num(total) },
      };
      return { heading, rows: [row], subtotal: { cells: { ...row.cells }, bold: true } };
    };

    const recCash = sumMap.RECEIPT.CASH;
    const recBank = sumMap.RECEIPT.BANK;
    const disCash = sumMap.DISBURSEMENT.CASH;
    const disBank = sumMap.DISBURSEMENT.BANK;
    const netCash = recCash.sub(disCash);
    const netBank = recBank.sub(disBank);
    const netTotal = netCash.add(netBank);

    return {
      key: 'cash-flow',
      title: 'Laporan Arus Kas',
      subtitle: `Periode ${from} s/d ${to}`,
      meta: [
        { label: 'Periode', value: `${from} s/d ${to}` },
        ...metaCabang(branchId),
        printedMeta(),
      ],
      columns,
      sections: [
        makeSection('RECEIPT', 'Penerimaan'),
        makeSection('DISBURSEMENT', 'Pengeluaran'),
      ],
      grandTotal: {
        cells: { Keterangan: 'Net Arus Kas', Kas: num(netCash), Bank: num(netBank), Total: num(netTotal) },
        bold: true,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // 2. Daily Cash Bank
  // ---------------------------------------------------------------------------
  async buildDailyCashBank(from: string, to: string, branchId?: string): Promise<ReportDocument> {
    const where: Prisma.ErpFinCashBankTransactionWhereInput = {
      deletedAt: null,
      transactionDate: { gte: new Date(from), lte: new Date(to) },
    };
    if (branchId) where.branchId = BigInt(branchId);

    const txns = await this.prisma.erpFinCashBankTransaction.findMany({
      where,
      select: { kind: true, direction: true, amount: true, transactionDate: true },
      orderBy: { transactionDate: 'asc' },
    });

    const columns: ReportColumn[] = [
      { key: 'Tanggal', label: 'Tanggal', type: 'date', width: 14 },
      { key: 'Penerimaan', label: 'Penerimaan', type: 'number', align: 'right', width: 18 },
      { key: 'Pengeluaran', label: 'Pengeluaran', type: 'number', align: 'right', width: 18 },
      { key: 'Neto', label: 'Neto', type: 'number', align: 'right', width: 18 },
    ];

    type DailyMap = Record<string, { receipt: Prisma.Decimal; disbursement: Prisma.Decimal }>;
    const byKind: Record<string, DailyMap> = { CASH: {}, BANK: {} };

    for (const t of txns) {
      const kind = t.kind as string;
      const dateKey = t.transactionDate.toISOString().slice(0, 10);
      if (!byKind[kind]) continue;
      if (!byKind[kind][dateKey]) byKind[kind][dateKey] = { receipt: ZERO, disbursement: ZERO };
      const dir = t.direction as string;
      if (dir === 'RECEIPT') byKind[kind][dateKey].receipt = byKind[kind][dateKey].receipt.add(t.amount);
      else byKind[kind][dateKey].disbursement = byKind[kind][dateKey].disbursement.add(t.amount);
    }

    const sections: ReportSection[] = [];
    for (const kind of ['CASH', 'BANK']) {
      const daily = byKind[kind];
      const rows: ReportRow[] = Object.entries(daily).map(([date, v]) => ({
        cells: {
          Tanggal: date,
          Penerimaan: num(v.receipt),
          Pengeluaran: num(v.disbursement),
          Neto: num(v.receipt.sub(v.disbursement)),
        },
      }));
      let totRec = ZERO, totDis = ZERO;
      for (const v of Object.values(daily)) { totRec = totRec.add(v.receipt); totDis = totDis.add(v.disbursement); }
      sections.push({
        heading: kind === 'CASH' ? 'Kas' : 'Bank',
        rows,
        subtotal: {
          cells: { Tanggal: 'Subtotal', Penerimaan: num(totRec), Pengeluaran: num(totDis), Neto: num(totRec.sub(totDis)) },
          bold: true,
        },
      });
    }

    return {
      key: 'daily-cash-bank',
      title: 'Kas Bank Harian',
      subtitle: `Periode ${from} s/d ${to}`,
      meta: [{ label: 'Periode', value: `${from} s/d ${to}` }, ...metaCabang(branchId), printedMeta()],
      columns,
      sections,
    };
  }

  // ---------------------------------------------------------------------------
  // 3. AR Card
  // ---------------------------------------------------------------------------
  async buildArCard(from: string, to: string, partnerId?: string, branchId?: string): Promise<ReportDocument> {
    const where: Prisma.ErpFinArReceiptWhereInput = {
      deletedAt: null,
      postingStatus: 'POSTED',
      transactionDate: { gte: new Date(from), lte: new Date(to) },
    };
    if (branchId) where.branchId = BigInt(branchId);
    if (partnerId) where.partnerId = BigInt(partnerId);

    const rows = await this.prisma.erpFinArReceipt.findMany({
      where,
      orderBy: { transactionDate: 'asc' },
      include: { partner: { select: { code: true, name: true } } },
    });

    const columns: ReportColumn[] = [
      { key: 'No', label: 'No Dokumen', type: 'text', width: 16 },
      { key: 'Tanggal', label: 'Tanggal', type: 'date', width: 12 },
      { key: 'Partner', label: 'Partner', type: 'text', width: 30 },
      { key: 'Keterangan', label: 'Keterangan', type: 'text', width: 30 },
      { key: 'Jumlah', label: 'Jumlah', type: 'number', align: 'right', width: 16 },
      { key: 'Dialokasi', label: 'Dialokasi', type: 'number', align: 'right', width: 16 },
      { key: 'Outstanding', label: 'Outstanding', type: 'number', align: 'right', width: 16 },
    ];

    const reportRows: ReportRow[] = rows.map((r) => ({
      cells: {
        No: r.docNumber,
        Tanggal: r.transactionDate.toISOString().slice(0, 10),
        Partner: r.partner ? `${r.partner.code} - ${r.partner.name}` : '',
        Keterangan: r.description,
        Jumlah: num(r.amount),
        Dialokasi: num(r.allocatedAmount),
        Outstanding: num(r.amount.sub(r.allocatedAmount)),
      },
    }));

    return {
      key: 'ar-card',
      title: 'Kartu Piutang (AR Card)',
      subtitle: `Periode ${from} s/d ${to}`,
      meta: [{ label: 'Periode', value: `${from} s/d ${to}` }, ...metaCabang(branchId), printedMeta()],
      columns,
      sections: [{ rows: reportRows }],
    };
  }

  // ---------------------------------------------------------------------------
  // 4. AR Aging
  // ---------------------------------------------------------------------------
  async buildArAging(asOf?: string): Promise<ReportDocument> {
    const refDate = asOf ? new Date(asOf) : new Date();
    const refStr = refDate.toISOString().slice(0, 10);

    const rows = await this.prisma.erpFinArReceipt.findMany({
      where: { deletedAt: null, postingStatus: 'POSTED' },
      include: { partner: { select: { code: true, name: true } } },
    });

    const columns: ReportColumn[] = [
      { key: 'No', label: 'No Dokumen', type: 'text', width: 16 },
      { key: 'Tanggal', label: 'Tanggal', type: 'date', width: 12 },
      { key: 'Partner', label: 'Partner', type: 'text', width: 30 },
      { key: 'Total', label: 'Total', type: 'number', align: 'right', width: 14 },
      { key: 'Outstanding', label: 'Outstanding', type: 'number', align: 'right', width: 14 },
      { key: 'Bucket', label: 'Umur (hari)', type: 'text', width: 16 },
    ];

    const buckets = ['0-30', '31-60', '61-90', '91-120', '120+'];
    const byBucket: Record<string, ReportRow[]> = Object.fromEntries(buckets.map((b) => [b, []]));

    for (const r of rows) {
      const outstanding = r.amount.sub(r.allocatedAmount);
      if (outstanding.lte(ZERO)) continue;
      const days = Math.floor((refDate.getTime() - r.transactionDate.getTime()) / 86400000);
      const bucket = days <= 30 ? '0-30' : days <= 60 ? '31-60' : days <= 90 ? '61-90' : days <= 120 ? '91-120' : '120+';
      byBucket[bucket].push({
        cells: {
          No: r.docNumber,
          Tanggal: r.transactionDate.toISOString().slice(0, 10),
          Partner: r.partner ? `${r.partner.code} - ${r.partner.name}` : '',
          Total: num(r.amount),
          Outstanding: num(outstanding),
          Bucket: bucket,
        },
      });
    }

    const sections: ReportSection[] = buckets.map((b) => ({ heading: `${b} hari`, rows: byBucket[b] }));

    return {
      key: 'ar-aging',
      title: 'Analisis Umur Piutang (AR Aging)',
      subtitle: `Per tanggal ${refStr}`,
      meta: [{ label: 'Per Tanggal', value: refStr }, printedMeta()],
      columns,
      sections,
    };
  }

  // ---------------------------------------------------------------------------
  // 5. AP Card
  // ---------------------------------------------------------------------------
  async buildApCard(from: string, to: string, partnerId?: string, branchId?: string): Promise<ReportDocument> {
    const where: Prisma.ErpFinApPaymentWhereInput = {
      deletedAt: null,
      postingStatus: 'POSTED',
      transactionDate: { gte: new Date(from), lte: new Date(to) },
    };
    if (branchId) where.branchId = BigInt(branchId);
    if (partnerId) where.partnerId = BigInt(partnerId);

    const rows = await this.prisma.erpFinApPayment.findMany({
      where,
      orderBy: { transactionDate: 'asc' },
      include: { partner: { select: { code: true, name: true } } },
    });

    const columns: ReportColumn[] = [
      { key: 'No', label: 'No Dokumen', type: 'text', width: 16 },
      { key: 'Tanggal', label: 'Tanggal', type: 'date', width: 12 },
      { key: 'Partner', label: 'Partner', type: 'text', width: 30 },
      { key: 'Keterangan', label: 'Keterangan', type: 'text', width: 30 },
      { key: 'Jumlah', label: 'Jumlah', type: 'number', align: 'right', width: 16 },
      { key: 'Dialokasi', label: 'Dialokasi', type: 'number', align: 'right', width: 16 },
      { key: 'Outstanding', label: 'Outstanding', type: 'number', align: 'right', width: 16 },
    ];

    const reportRows: ReportRow[] = rows.map((r) => ({
      cells: {
        No: r.docNumber,
        Tanggal: r.transactionDate.toISOString().slice(0, 10),
        Partner: r.partner ? `${r.partner.code} - ${r.partner.name}` : '',
        Keterangan: r.description,
        Jumlah: num(r.amount),
        Dialokasi: num(r.allocatedAmount),
        Outstanding: num(r.amount.sub(r.allocatedAmount)),
      },
    }));

    return {
      key: 'ap-card',
      title: 'Kartu Utang (AP Card)',
      subtitle: `Periode ${from} s/d ${to}`,
      meta: [{ label: 'Periode', value: `${from} s/d ${to}` }, ...metaCabang(branchId), printedMeta()],
      columns,
      sections: [{ rows: reportRows }],
    };
  }

  // ---------------------------------------------------------------------------
  // 6. AP Aging
  // ---------------------------------------------------------------------------
  async buildApAging(asOf?: string): Promise<ReportDocument> {
    const refDate = asOf ? new Date(asOf) : new Date();
    const refStr = refDate.toISOString().slice(0, 10);

    const rows = await this.prisma.erpFinApPayment.findMany({
      where: { deletedAt: null, postingStatus: 'POSTED' },
      include: { partner: { select: { code: true, name: true } } },
    });

    const columns: ReportColumn[] = [
      { key: 'No', label: 'No Dokumen', type: 'text', width: 16 },
      { key: 'Tanggal', label: 'Tanggal', type: 'date', width: 12 },
      { key: 'Partner', label: 'Partner', type: 'text', width: 30 },
      { key: 'Total', label: 'Total', type: 'number', align: 'right', width: 14 },
      { key: 'Outstanding', label: 'Outstanding', type: 'number', align: 'right', width: 14 },
      { key: 'Bucket', label: 'Umur (hari)', type: 'text', width: 16 },
    ];

    const buckets = ['0-30', '31-60', '61-90', '91-120', '120+'];
    const byBucket: Record<string, ReportRow[]> = Object.fromEntries(buckets.map((b) => [b, []]));

    for (const r of rows) {
      const outstanding = r.amount.sub(r.allocatedAmount);
      if (outstanding.lte(ZERO)) continue;
      const days = Math.floor((refDate.getTime() - r.transactionDate.getTime()) / 86400000);
      const bucket = days <= 30 ? '0-30' : days <= 60 ? '31-60' : days <= 90 ? '61-90' : days <= 120 ? '91-120' : '120+';
      byBucket[bucket].push({
        cells: {
          No: r.docNumber,
          Tanggal: r.transactionDate.toISOString().slice(0, 10),
          Partner: r.partner ? `${r.partner.code} - ${r.partner.name}` : '',
          Total: num(r.amount),
          Outstanding: num(outstanding),
          Bucket: bucket,
        },
      });
    }

    const sections: ReportSection[] = buckets.map((b) => ({ heading: `${b} hari`, rows: byBucket[b] }));

    return {
      key: 'ap-aging',
      title: 'Analisis Umur Utang (AP Aging)',
      subtitle: `Per tanggal ${refStr}`,
      meta: [{ label: 'Per Tanggal', value: refStr }, printedMeta()],
      columns,
      sections,
    };
  }

  // ---------------------------------------------------------------------------
  // 7. Giro Maturity
  // ---------------------------------------------------------------------------
  async buildGiroMaturity(from?: string, to?: string): Promise<ReportDocument> {
    const refDate = from ? new Date(from) : new Date();
    const endDate = to ? new Date(to) : new Date(refDate.getTime() + 90 * 86400000);
    const refStr = refDate.toISOString().slice(0, 10);
    const endStr = endDate.toISOString().slice(0, 10);

    const giros = await this.prisma.erpFinGiro.findMany({
      where: { deletedAt: null, status: 'OUTSTANDING' },
      orderBy: { dueDate: 'asc' },
      include: { partner: { select: { code: true, name: true } } },
    });

    const columns: ReportColumn[] = [
      { key: 'No', label: 'No Giro', type: 'text', width: 18 },
      { key: 'Jenis', label: 'Jenis', type: 'text', width: 12 },
      { key: 'Partner', label: 'Partner', type: 'text', width: 30 },
      { key: 'Jumlah', label: 'Jumlah', type: 'number', align: 'right', width: 16 },
      { key: 'JatuhTempo', label: 'Jatuh Tempo', type: 'date', width: 14 },
      { key: 'Bucket', label: 'Bucket', type: 'text', width: 20 },
    ];

    const bNames = ['Jatuh Tempo (0-7 hari)', 'Jatuh Tempo (8-30 hari)', 'Lebih dari 30 hari'];
    const byBucket: Record<string, ReportRow[]> = Object.fromEntries(bNames.map((b) => [b, []]));

    for (const g of giros) {
      const days = Math.floor((g.dueDate.getTime() - refDate.getTime()) / 86400000);
      const bucket = days <= 7 ? bNames[0] : days <= 30 ? bNames[1] : bNames[2];
      byBucket[bucket].push({
        cells: {
          No: g.giroNumber,
          Jenis: g.type as string,
          Partner: g.partner ? `${g.partner.code} - ${g.partner.name}` : '',
          Jumlah: num(g.amount),
          JatuhTempo: g.dueDate.toISOString().slice(0, 10),
          Bucket: bucket,
        },
      });
    }

    const sections: ReportSection[] = bNames.map((b) => ({ heading: b, rows: byBucket[b] }));

    return {
      key: 'giro-maturity',
      title: 'Jatuh Tempo Giro',
      subtitle: `Dari ${refStr} s/d ${endStr}`,
      meta: [{ label: 'Periode', value: `${refStr} s/d ${endStr}` }, printedMeta()],
      columns,
      sections,
    };
  }

  // ---------------------------------------------------------------------------
  // 8. Budget Realization
  // ---------------------------------------------------------------------------
  async buildBudgetRealization(from?: string, to?: string): Promise<ReportDocument> {
    const periodWhere: Prisma.ErpFiscalPeriodWhereInput = { deletedAt: null };
    if (from) periodWhere.startDate = { gte: new Date(from) };
    if (to) periodWhere.endDate = { lte: new Date(to) };

    const periods = await this.prisma.erpFiscalPeriod.findMany({
      where: periodWhere,
      select: { id: true },
    });
    const periodIds = periods.map((p) => p.id);

    const brWhere: Prisma.ErpFinBudgetRealizationWhereInput = { deletedAt: null };
    if (periodIds.length > 0) brWhere.fiscalPeriodId = { in: periodIds };

    const items = await this.prisma.erpFinBudgetRealization.findMany({
      where: brWhere,
      include: { account: { select: { code: true, name: true, type: true } } },
      orderBy: { account: { code: 'asc' } },
    });

    const columns: ReportColumn[] = [
      { key: 'KodeAkun', label: 'Kode Akun', type: 'text', width: 14 },
      { key: 'NamaAkun', label: 'Nama Akun', type: 'text', width: 34 },
      { key: 'Anggaran', label: 'Anggaran', type: 'number', align: 'right', width: 16 },
      { key: 'Realisasi', label: 'Realisasi', type: 'number', align: 'right', width: 16 },
      { key: 'Selisih', label: 'Selisih', type: 'number', align: 'right', width: 16 },
      { key: 'Pct', label: '%', type: 'number', align: 'right', width: 10 },
    ];

    const reportRows: ReportRow[] = items.map((r) => {
      const isExpense = r.account?.type === 'EXPENSE';
      const realization = isExpense ? r.debitTotal.sub(r.creditTotal) : r.creditTotal.sub(r.debitTotal);
      const variance = r.budgetAmount.sub(realization);
      const pct = r.budgetAmount.isZero() ? 0 : num(realization.div(r.budgetAmount).mul(new Prisma.Decimal(100)));
      return {
        cells: {
          KodeAkun: r.account?.code ?? '',
          NamaAkun: r.account?.name ?? '',
          Anggaran: num(r.budgetAmount),
          Realisasi: num(realization),
          Selisih: num(variance),
          Pct: Math.round(pct * 100) / 100,
        },
      };
    });

    const subtitle = from && to ? `Periode ${from} s/d ${to}` : 'Semua Periode';

    return {
      key: 'budget-realization',
      title: 'Realisasi Anggaran',
      subtitle,
      meta: [{ label: 'Periode', value: subtitle }, printedMeta()],
      columns,
      sections: [{ rows: reportRows }],
    };
  }
}
