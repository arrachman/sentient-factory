import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SlsInvoicePostingService } from './sls-invoice-posting.service';
import { enrichInvoices } from './sls-invoice-enrich';
import { CreateSlsInvoiceDto } from './dto/create-sls-invoice.dto';
import { QuerySlsInvoicesDto } from './dto/query-sls-invoices.dto';
import { UpdateSlsInvoiceDto } from './dto/update-sls-invoice.dto';
import {
  SlsInvoiceTransitionAction as A,
  TransitionSlsInvoiceDto,
} from './dto/transition-sls-invoice.dto';
import {
  toBigInt,
  EDITABLE,
  NEXT,
  buildSlsInvoiceWhere,
  mapInvoiceLine,
  computeInvoiceTotals,
} from './sls-invoice.helpers';

const DOC_CODE = 'SI';
const FALLBACK_PREFIX = 'SI';

@Injectable()
export class ErpSlsInvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly posting: SlsInvoicePostingService,
  ) {}

  private async resolvePeriod(
    tx: Prisma.TransactionClient,
    fiscalPeriodId: string | undefined,
    date: string,
  ): Promise<bigint> {
    if (fiscalPeriodId) return BigInt(fiscalPeriodId);
    const d = new Date(date);
    const period = await tx.erpFiscalPeriod.findFirst({
      where: { deletedAt: null, startDate: { lte: d }, endDate: { gte: d } },
      select: { id: true },
    });
    if (!period) {
      throw new BadRequestException(`Tidak ada periode fiskal yang memuat tanggal ${date}.`);
    }
    return period.id;
  }

  private async genDocNumber(tx: Prisma.TransactionClient): Promise<string> {
    const numbering = await tx.erpDocumentNumbering.findFirst({
      where: { documentCode: DOC_CODE, deletedAt: null },
    });
    if (numbering) {
      const seq = numbering.nextNumber;
      await tx.erpDocumentNumbering.update({
        where: { id: numbering.id },
        data: { nextNumber: seq + 1 },
      });
      return `${numbering.prefix}${String(seq).padStart(numbering.digitCount, '0')}`;
    }
    const count = await tx.erpSlsInvoice.count();
    return `${FALLBACK_PREFIX}${String(count + 1).padStart(6, '0')}`;
  }

  private async findRaw(id: bigint) {
    const invoice = await this.prisma.erpSlsInvoice.findFirst({
      where: { id, deletedAt: null },
      include: { lines: { orderBy: { lineNo: 'asc' } } },
    });
    if (!invoice) throw new NotFoundException('Sales invoice tidak ditemukan');
    return invoice;
  }

  private async one(id: bigint) {
    const invoice = await this.findRaw(id);
    const [enriched] = await enrichInvoices(this.prisma, [invoice]);
    return { success: true, data: enriched };
  }

  private async taxRateMap(taxIds: (string | undefined)[]): Promise<Map<string, Prisma.Decimal>> {
    const ids = [...new Set(taxIds.filter((v): v is string => !!v))];
    if (!ids.length) return new Map();
    const taxes = await this.prisma.erpTax.findMany({
      where: { id: { in: ids.map(BigInt) }, deletedAt: null },
      select: { id: true, rate: true },
    });
    const m = new Map<string, Prisma.Decimal>();
    for (const t of taxes) m.set(t.id.toString(), t.rate);
    return m;
  }

  private async resolveDueDate(
    paymentTermId: string | undefined,
    docDate: string,
    explicitDueDate?: string,
  ): Promise<Date | null> {
    if (explicitDueDate) return new Date(explicitDueDate);
    if (!paymentTermId) return null;
    const term = await this.prisma.erpPaymentTerm.findUnique({
      where: { id: BigInt(paymentTermId) },
      select: { netDays: true },
    });
    if (!term) return null;
    const d = new Date(docDate);
    d.setDate(d.getDate() + term.netDays);
    return d;
  }

  // ── CRUD ────────────────────────────────────────────────────────────────────
  async create(dto: CreateSlsInvoiceDto, actorId?: string) {
    const actor = actorId ? BigInt(actorId) : null;
    const priceMode = (dto.priceMode ?? 'TAX_EXCLUSIVE') as 'TAX_EXCLUSIVE' | 'TAX_INCLUSIVE';
    const header = { currencyId: dto.currencyId, exchangeRate: dto.exchangeRate };

    const taxIds = dto.lines.flatMap((l) => [l.tax1Id, l.tax2Id]);
    const rateById = await this.taxRateMap(taxIds);
    const { subtotal, grandTotal, lines: computedLines, discountAmount, otherCostAmount } =
      computeInvoiceTotals(dto.lines, dto, rateById, priceMode);

    const dueDate = await this.resolveDueDate(dto.paymentTermId, dto.docDate, dto.dueDate);

    const created = await this.prisma.$transaction(async (tx) => {
      const fiscalPeriodId = await this.resolvePeriod(tx, dto.fiscalPeriodId, dto.docDate);
      const wantAuto = dto.auto !== false && !dto.docNumber;
      const docNumber = wantAuto ? await this.genDocNumber(tx) : dto.docNumber;
      if (!docNumber) throw new BadRequestException('No dokumen wajib diisi.');

      const row = await tx.erpSlsInvoice.create({
        data: {
          code: docNumber,
          docNumber,
          autoNumber: wantAuto ? docNumber : null,
          branchId: BigInt(dto.branchId),
          locationId: toBigInt(dto.locationId),
          warehouseId: toBigInt(dto.warehouseId),
          docDate: new Date(dto.docDate),
          fiscalPeriodId,
          customerId: toBigInt(dto.customerId),
          paymentTermId: toBigInt(dto.paymentTermId),
          dueDate,
          currencyId: BigInt(dto.currencyId),
          exchangeRate: new Prisma.Decimal(dto.exchangeRate),
          priceMode: priceMode as never,
          orderId: toBigInt(dto.orderId),
          deliveryOrderId: toBigInt(dto.deliveryOrderId),
          advanceId: toBigInt(dto.advanceId),
          advanceAmount: dto.advanceAmount != null ? new Prisma.Decimal(dto.advanceAmount) : null,
          taxInvoiceNo: dto.taxInvoiceNo ?? null,
          channel: (dto.channel ?? 'STANDARD') as never,
          isOpeningBalance: dto.isOpeningBalance ?? false,
          settlementStatus: 'UNSETTLED' as never,
          subtotal,
          discountPercent: dto.discountPercent != null ? new Prisma.Decimal(dto.discountPercent) : null,
          discountAmount,
          tax1Amount: dto.tax1Amount != null ? new Prisma.Decimal(dto.tax1Amount) : null,
          tax2Amount: dto.tax2Amount != null ? new Prisma.Decimal(dto.tax2Amount) : null,
          otherCostAmount,
          grandTotal,
          description: dto.description ?? null,
          notes: dto.notes ?? null,
          referenceNo: dto.referenceNo ?? null,
          referenceDate: dto.referenceDate ? new Date(dto.referenceDate) : null,
          receivableAccountId: toBigInt(dto.receivableAccountId),
          salesDeptId: toBigInt(dto.salesDeptId),
          status: 'DRAFT',
          postingStatus: 'UNPOSTED',
          legacyCode: dto.legacyCode ?? null,
          createdById: actor,
          updatedById: actor,
          lines: computedLines.length
            ? { create: computedLines.map((l) => mapInvoiceLine(l, header)) }
            : undefined,
        },
        select: { id: true },
      });
      return row;
    });
    return this.one(created.id);
  }

  async findAll(query: QuerySlsInvoicesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = buildSlsInvoiceWhere(query);

    const sortBy = query.sortBy ?? 'docDate';
    const sortDir = query.sortDir ?? 'desc';
    const [items, total, agg] = await this.prisma.$transaction([
      this.prisma.erpSlsInvoice.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: { lines: { orderBy: { lineNo: 'asc' } } },
      }),
      this.prisma.erpSlsInvoice.count({ where }),
      this.prisma.erpSlsInvoice.aggregate({ where, _sum: { grandTotal: true } }),
    ]);

    return {
      success: true,
      data: await enrichInvoices(this.prisma, items),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        sumGrandTotal: agg._sum.grandTotal?.toString() ?? '0',
      },
    };
  }

  findOne(id: bigint) {
    return this.one(id);
  }

  async update(id: bigint, dto: UpdateSlsInvoiceDto, actorId?: string) {
    const existing = await this.findRaw(id);
    if (!EDITABLE.has(existing.status)) {
      throw new BadRequestException(
        `Dokumen berstatus ${existing.status} tidak bisa diedit. Reopen dulu bila perlu.`,
      );
    }
    const actor = actorId ? BigInt(actorId) : null;
    const header = {
      currencyId: dto.currencyId ?? existing.currencyId.toString(),
      exchangeRate: dto.exchangeRate ?? existing.exchangeRate.toString(),
    };

    await this.prisma.$transaction(async (tx) => {
      const data: Prisma.ErpSlsInvoiceUncheckedUpdateInput = { updatedById: actor };
      if (dto.docNumber !== undefined) {
        data.docNumber = dto.docNumber;
        data.code = dto.docNumber;
      }
      if (dto.branchId !== undefined) data.branchId = BigInt(dto.branchId);
      if (dto.locationId !== undefined) data.locationId = toBigInt(dto.locationId);
      if (dto.warehouseId !== undefined) data.warehouseId = toBigInt(dto.warehouseId);
      if (dto.customerId !== undefined) data.customerId = toBigInt(dto.customerId);
      if (dto.paymentTermId !== undefined) data.paymentTermId = toBigInt(dto.paymentTermId);
      if (dto.dueDate !== undefined) data.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
      if (dto.currencyId !== undefined) data.currencyId = BigInt(dto.currencyId);
      if (dto.exchangeRate !== undefined) data.exchangeRate = new Prisma.Decimal(dto.exchangeRate);
      if (dto.priceMode !== undefined) data.priceMode = dto.priceMode as never;
      if (dto.orderId !== undefined) data.orderId = toBigInt(dto.orderId);
      if (dto.deliveryOrderId !== undefined) data.deliveryOrderId = toBigInt(dto.deliveryOrderId);
      if (dto.advanceId !== undefined) data.advanceId = toBigInt(dto.advanceId);
      if (dto.advanceAmount !== undefined) {
        data.advanceAmount = dto.advanceAmount != null ? new Prisma.Decimal(dto.advanceAmount) : null;
      }
      if (dto.taxInvoiceNo !== undefined) data.taxInvoiceNo = dto.taxInvoiceNo;
      if (dto.channel !== undefined) data.channel = dto.channel as never;
      if (dto.isOpeningBalance !== undefined) data.isOpeningBalance = dto.isOpeningBalance;
      if (dto.description !== undefined) data.description = dto.description;
      if (dto.notes !== undefined) data.notes = dto.notes;
      if (dto.referenceNo !== undefined) data.referenceNo = dto.referenceNo;
      if (dto.referenceDate !== undefined) {
        data.referenceDate = dto.referenceDate ? new Date(dto.referenceDate) : null;
      }
      if (dto.receivableAccountId !== undefined) {
        data.receivableAccountId = toBigInt(dto.receivableAccountId);
      }
      if (dto.salesDeptId !== undefined) data.salesDeptId = toBigInt(dto.salesDeptId);
      if (dto.discountPercent !== undefined) {
        data.discountPercent = dto.discountPercent != null ? new Prisma.Decimal(dto.discountPercent) : null;
      }
      if (dto.legacyCode !== undefined) data.legacyCode = dto.legacyCode;
      if (dto.docDate !== undefined) {
        data.docDate = new Date(dto.docDate);
        data.fiscalPeriodId = await this.resolvePeriod(tx, dto.fiscalPeriodId, dto.docDate);
      } else if (dto.fiscalPeriodId !== undefined) {
        data.fiscalPeriodId = BigInt(dto.fiscalPeriodId);
      }

      const discountAmount =
        dto.discountAmount !== undefined ? dto.discountAmount : existing.discountAmount?.toString();
      const tax1Amount =
        dto.tax1Amount !== undefined ? dto.tax1Amount : existing.tax1Amount?.toString();
      const tax2Amount =
        dto.tax2Amount !== undefined ? dto.tax2Amount : existing.tax2Amount?.toString();
      const otherCostAmount =
        dto.otherCostAmount !== undefined
          ? dto.otherCostAmount
          : existing.otherCostAmount?.toString();
      if (dto.tax1Amount !== undefined) {
        data.tax1Amount = dto.tax1Amount != null ? new Prisma.Decimal(dto.tax1Amount) : null;
      }
      if (dto.tax2Amount !== undefined) {
        data.tax2Amount = dto.tax2Amount != null ? new Prisma.Decimal(dto.tax2Amount) : null;
      }

      const mergedLines: typeof dto.lines = dto.lines ?? existing.lines.map((l) => ({
        itemId: l.itemId.toString(),
        quantity: l.quantity.toString(),
        unitId: l.unitId.toString(),
        unitPrice: l.unitPrice.toString(),
        discountPercent: l.discountPercent?.toString(),
        discountAmount: l.discountAmount?.toString(),
        tax1Id: (l.tax1Id as bigint | null)?.toString(),
        tax2Id: (l.tax2Id as bigint | null)?.toString(),
        tax1Amount: l.tax1Amount?.toString(),
        tax2Amount: l.tax2Amount?.toString(),
        lineNo: l.lineNo,
      }));

      const priceMode = ((dto.priceMode ?? existing.priceMode) as string) as 'TAX_EXCLUSIVE' | 'TAX_INCLUSIVE';
      const taxIds = mergedLines.flatMap((l) => [l.tax1Id, l.tax2Id]);
      const rateById = await this.taxRateMap(taxIds);
      const totals = computeInvoiceTotals(
        mergedLines,
        { discountAmount, discountPercent: dto.discountPercent, tax1Amount, tax2Amount, otherCostAmount },
        rateById,
        priceMode,
      );
      data.subtotal = totals.subtotal;
      data.grandTotal = totals.grandTotal;
      if (totals.discountAmount !== null) data.discountAmount = totals.discountAmount;
      if (totals.otherCostAmount !== null) data.otherCostAmount = totals.otherCostAmount;

      if (dto.paymentTermId !== undefined && dto.dueDate === undefined) {
        const termId = dto.paymentTermId ?? null;
        const docDateStr = dto.docDate ?? existing.docDate.toISOString().slice(0, 10);
        data.dueDate = await this.resolveDueDate(termId ?? undefined, docDateStr, undefined);
      }

      if (dto.lines !== undefined) {
        await tx.erpSlsInvoiceLine.deleteMany({ where: { invoiceId: id } });
        data.lines = { create: totals.lines.map((l) => mapInvoiceLine(l, header)) };
      }
      await tx.erpSlsInvoice.update({ where: { id }, data });
    });
    return this.one(id);
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.findRaw(id);
    if (existing.status === 'POSTED') {
      throw new BadRequestException('Dokumen POSTED tidak bisa dihapus. Reopen dulu.');
    }
    const actor = actorId ? BigInt(actorId) : null;
    await this.prisma.erpSlsInvoice.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actor },
    });
    return { success: true, message: 'Sales invoice dihapus' };
  }

  // ── workflow (§2.7 state machine) ────────────────────────────────────────────
  async transition(id: bigint, dto: TransitionSlsInvoiceDto, actorId?: string) {
    const invoice = await this.findRaw(id);
    const actor = actorId ? BigInt(actorId) : null;
    const next = NEXT[invoice.status]?.[dto.action];
    if (!next) {
      throw new BadRequestException(`Aksi ${dto.action} tidak valid dari status ${invoice.status}.`);
    }
    if (dto.action === A.REJECT && !dto.reason?.trim()) {
      throw new BadRequestException('Alasan reject wajib diisi.');
    }

    if (dto.action === A.POST) {
      const period = await this.prisma.erpFiscalPeriod.findUnique({
        where: { id: invoice.fiscalPeriodId },
        select: { status: true },
      });
      if (period?.status === 'CLOSED') {
        throw new BadRequestException('Periode fiskal sudah ditutup — tidak bisa posting.');
      }
      await this.prisma.$transaction(async (tx) => {
        await this.posting.reverseLedger(tx, invoice.id);
        // postToLedger validates lines; AR entry creation is noted in posting service
        await this.posting.postToLedger(tx, invoice, actor);
        await tx.erpSlsInvoice.update({
          where: { id },
          data: {
            status: 'POSTED',
            previousStatus: invoice.status as never,
            postingStatus: 'POSTED',
            postedAt: new Date(),
            updatedById: actor,
          },
        });
      });
      return this.one(id);
    }

    if (dto.action === A.REOPEN) {
      await this.prisma.$transaction(async (tx) => {
        await this.posting.reverseLedger(tx, invoice.id);
        await tx.erpSlsInvoice.update({
          where: { id },
          data: {
            status: 'DRAFT',
            previousStatus: invoice.status as never,
            postingStatus: 'UNPOSTED',
            postedAt: null,
            updatedById: actor,
          },
        });
      });
      return this.one(id);
    }

    await this.prisma.erpSlsInvoice.update({
      where: { id },
      data: {
        status: next as never,
        previousStatus: invoice.status as never,
        updatedById: actor,
        ...(dto.action === A.REJECT
          ? {
              metadata: {
                ...((invoice.metadata as object) ?? {}),
                rejectReason: dto.reason,
              },
            }
          : {}),
      },
    });
    return this.one(id);
  }
}
