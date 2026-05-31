import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CashBankPostingService } from './cash-bank-posting.service';
import { enrichTransactions } from './cash-bank-enrich';
import {
  CashBankLineDto,
  CreateCashBankTransactionDto,
} from './dto/create-cash-bank-transaction.dto';
import { QueryCashBankTransactionDto } from './dto/query-cash-bank-transaction.dto';
import { UpdateCashBankTransactionDto } from './dto/update-cash-bank-transaction.dto';
import {
  CashBankTransitionAction as A,
  TransitionCashBankTransactionDto,
} from './dto/transition-cash-bank-transaction.dto';

function toBigInt(v?: string | null): bigint | null {
  if (v === undefined || v === null || v === '') return null;
  return BigInt(v);
}

/** Statuses where header/lines may still be edited (§2.7 state machine). */
const EDITABLE = new Set(['DRAFT', 'NEED_APPROVE', 'REJECTED']);

/** valid (status, action) → next status. POST/REOPEN handled separately. */
const NEXT: Record<string, Partial<Record<A, string>>> = {
  DRAFT: { [A.SUBMIT]: 'NEED_APPROVE' },
  REJECTED: { [A.SUBMIT]: 'NEED_APPROVE' },
  NEED_APPROVE: { [A.APPROVE]: 'APPROVED', [A.REJECT]: 'REJECTED' },
  APPROVED: { [A.POST]: 'POSTED', [A.REOPEN]: 'DRAFT' },
};

/** (kind, direction) → numbering documentCode / fallback prefix. Kas=CR/CD, Bank=RM/SM. */
const docKey = (kind: string, direction: string) => `${kind}_${direction}`;
const FALLBACK_PREFIX: Record<string, string> = {
  CASH_RECEIPT: 'CR',
  CASH_DISBURSEMENT: 'CD',
  BANK_RECEIPT: 'RM',
  BANK_DISBURSEMENT: 'SM',
};
const DOC_CODE: Record<string, string> = {
  CASH_RECEIPT: 'CASH_RECEIPT',
  CASH_DISBURSEMENT: 'CASH_DISBURSEMENT',
  BANK_RECEIPT: 'BANK_RECEIPT',
  BANK_DISBURSEMENT: 'BANK_DISBURSEMENT',
};

/** Marks giros owned by a cash/bank transaction (Giro tab) for sync/cleanup. */
const GIRO_SOURCE = 'CASH_BANK_TXN';

@Injectable()
export class ErpFinCashBankTransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly posting: CashBankPostingService,
  ) {}

  // ── helpers ───────────────────────────────────────────────────────────────
  private sumAmount(lines: CashBankLineDto[], fallback?: string) {
    if (!lines?.length) return new Prisma.Decimal(fallback ?? 0);
    return lines.reduce((s, l) => s.add(new Prisma.Decimal(l.amount)), new Prisma.Decimal(0));
  }

  private mapLine(line: CashBankLineDto, header: { currencyId: string; exchangeRate: string }) {
    return {
      accountId: BigInt(line.accountId),
      currencyId: BigInt(line.currencyId ?? header.currencyId),
      exchangeRate: new Prisma.Decimal(line.exchangeRate ?? header.exchangeRate),
      amount: new Prisma.Decimal(line.amount),
      amountFx: line.amountFx ? new Prisma.Decimal(line.amountFx) : null,
      notes: line.notes ?? null,
      costCenterId: toBigInt(line.costCenterId),
      divisionId: toBigInt(line.divisionId),
      subdivisionId: toBigInt(line.subdivisionId),
      projectId: toBigInt(line.projectId),
      customFields: line.customFields
        ? (line.customFields as Prisma.InputJsonValue)
        : Prisma.JsonNull,
      lineNo: line.lineNo,
    };
  }

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

  private async genDocNumber(
    tx: Prisma.TransactionClient,
    kind: string,
    direction: string,
  ): Promise<string> {
    const key = docKey(kind, direction);
    const numbering = await tx.erpDocumentNumbering.findFirst({
      where: { documentCode: DOC_CODE[key], deletedAt: null },
    });
    if (numbering) {
      const seq = numbering.nextNumber;
      await tx.erpDocumentNumbering.update({
        where: { id: numbering.id },
        data: { nextNumber: seq + 1 },
      });
      return `${numbering.prefix}${String(seq).padStart(numbering.digitCount, '0')}`;
    }
    const count = await tx.erpFinCashBankTransaction.count({
      where: { direction: direction as never, kind: kind as never },
    });
    return `${FALLBACK_PREFIX[key] ?? 'TX'}${String(count + 1).padStart(6, '0')}`;
  }

  /** RECEIPT → INCOMING giro, DISBURSEMENT → OUTGOING. */
  private giroType(direction: string) {
    return direction === 'RECEIPT' ? 'INCOMING' : 'OUTGOING';
  }

  /**
   * Replace the giros owned by a transaction (Giro tab). Children of an
   * editable (pre-post) document, so hard delete + recreate — mirrors how
   * contra lines are synced. Skips when `giros` is undefined (no change).
   */
  private async syncGiros(
    tx: Prisma.TransactionClient,
    txnId: bigint,
    giros: CreateCashBankTransactionDto['giros'],
    header: {
      direction: string;
      partnerId: bigint | null;
      branchId: bigint;
      fiscalPeriodId: bigint;
      currencyId: bigint;
      exchangeRate: string;
    },
    actor: bigint | null,
  ) {
    if (giros === undefined) return;
    await tx.erpFinGiro.deleteMany({
      where: { sourceTransactionId: txnId, source: GIRO_SOURCE },
    });
    if (!giros.length) return;
    await tx.erpFinGiro.createMany({
      data: giros.map((g) => ({
        giroNumber: g.giroNumber,
        type: this.giroType(header.direction) as never,
        source: GIRO_SOURCE,
        sourceTransactionId: txnId,
        partnerId: header.partnerId,
        branchId: header.branchId,
        fiscalPeriodId: header.fiscalPeriodId,
        bankName: g.bankName ?? null,
        bankAccountNo: g.bankAccountNo ?? null,
        currencyId: header.currencyId,
        exchangeRate: new Prisma.Decimal(header.exchangeRate),
        amount: new Prisma.Decimal(g.amount),
        dueDate: new Date(g.dueDate),
        status: 'OUTSTANDING' as never,
        notes: g.notes ?? null,
        lineNo: g.lineNo,
        createdById: actor,
        updatedById: actor,
      })),
    });
  }

  private async loadGiros(txnId: bigint) {
    return this.prisma.erpFinGiro.findMany({
      where: { sourceTransactionId: txnId, source: GIRO_SOURCE, deletedAt: null },
      orderBy: { lineNo: 'asc' },
    });
  }

  private async findRaw(id: bigint) {
    const txn = await this.prisma.erpFinCashBankTransaction.findFirst({
      where: { id, deletedAt: null },
      include: { lines: { orderBy: { lineNo: 'asc' } } },
    });
    if (!txn) throw new NotFoundException('Transaksi kas/bank tidak ditemukan');
    return txn;
  }

  private async one(id: bigint) {
    const txn = await this.findRaw(id);
    const [enriched] = await enrichTransactions(this.prisma, [txn]);
    const giros = await this.loadGiros(id);
    return { success: true, data: { ...enriched, giros } };
  }

  // ── CRUD ────────────────────────────────────────────────────────────────────
  async create(dto: CreateCashBankTransactionDto, actorId?: string) {
    const actor = actorId ? BigInt(actorId) : null;
    const kind = dto.kind ?? 'CASH';
    const created = await this.prisma.$transaction(async (tx) => {
      const fiscalPeriodId = await this.resolvePeriod(tx, dto.fiscalPeriodId, dto.transactionDate);
      const wantAuto = dto.auto !== false && !dto.docNumber;
      const docNumber = wantAuto ? await this.genDocNumber(tx, kind, dto.direction) : dto.docNumber;
      if (!docNumber) throw new BadRequestException('No transaksi wajib diisi.');

      const row = await tx.erpFinCashBankTransaction.create({
        data: {
          docNumber,
          autoNumber: wantAuto ? docNumber : null,
          direction: dto.direction as never,
          kind: kind as never,
          paymentMethod: (dto.paymentMethod ?? null) as never,
          branchId: BigInt(dto.branchId),
          locationId: toBigInt(dto.locationId),
          source: dto.source ?? null,
          transactionDate: new Date(dto.transactionDate),
          fiscalPeriodId,
          bankAccountId: BigInt(dto.bankAccountId),
          partnerId: toBigInt(dto.partnerId),
          contactPerson: dto.contactPerson ?? null,
          description: dto.description,
          notes: dto.notes ?? null,
          currencyId: BigInt(dto.currencyId),
          exchangeRate: new Prisma.Decimal(dto.exchangeRate),
          amount: this.sumAmount(dto.lines, dto.amount),
          status: 'DRAFT',
          postingStatus: 'UNPOSTED',
          legacyCode: dto.legacyCode ?? null,
          createdById: actor,
          updatedById: actor,
          lines: dto.lines.length
            ? { create: dto.lines.map((l) => this.mapLine(l, dto)) }
            : undefined,
        },
        select: { id: true },
      });
      await this.syncGiros(
        tx,
        row.id,
        dto.giros,
        {
          direction: dto.direction,
          partnerId: toBigInt(dto.partnerId),
          branchId: BigInt(dto.branchId),
          fiscalPeriodId,
          currencyId: BigInt(dto.currencyId),
          exchangeRate: dto.exchangeRate,
        },
        actor,
      );
      return row;
    });
    return this.one(created.id);
  }

  async findAll(query: QueryCashBankTransactionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: Prisma.ErpFinCashBankTransactionWhereInput = { deletedAt: null };

    if (query.direction) where.direction = query.direction as never;
    if (query.kind) where.kind = query.kind as never;
    if (query.paymentMethod) where.paymentMethod = query.paymentMethod as never;
    if (query.status) where.status = query.status as never;
    if (query.branchId) where.branchId = BigInt(query.branchId);
    if (query.locationId) where.locationId = BigInt(query.locationId);
    if (query.partnerId) where.partnerId = BigInt(query.partnerId);
    if (query.createdById) where.createdById = BigInt(query.createdById);
    if (query.dateFrom || query.dateTo) {
      where.transactionDate = {
        ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
        ...(query.dateTo ? { lte: new Date(query.dateTo) } : {}),
      };
    }
    if (query.docNumberFrom || query.docNumberTo) {
      where.docNumber = {
        ...(query.docNumberFrom ? { gte: query.docNumberFrom } : {}),
        ...(query.docNumberTo ? { lte: query.docNumberTo } : {}),
      };
    }
    if (query.description?.trim()) {
      where.description = { contains: query.description.trim(), mode: 'insensitive' };
    }
    if (query.notes?.trim()) {
      where.notes = { contains: query.notes.trim(), mode: 'insensitive' };
    }
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { docNumber: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { contactPerson: { contains: q, mode: 'insensitive' } },
      ];
    }

    const sortBy = query.sortBy ?? 'transactionDate';
    const sortDir = query.sortDir ?? 'desc';
    const [items, total] = await this.prisma.$transaction([
      this.prisma.erpFinCashBankTransaction.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: { lines: { orderBy: { lineNo: 'asc' } } },
      }),
      this.prisma.erpFinCashBankTransaction.count({ where }),
    ]);

    return {
      success: true,
      data: await enrichTransactions(this.prisma, items),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  findOne(id: bigint) {
    return this.one(id);
  }

  async update(id: bigint, dto: UpdateCashBankTransactionDto, actorId?: string) {
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
      const data: Prisma.ErpFinCashBankTransactionUpdateInput = { updatedById: actor };
      if (dto.docNumber !== undefined) data.docNumber = dto.docNumber;
      if (dto.direction !== undefined) data.direction = dto.direction as never;
      if (dto.kind !== undefined) data.kind = dto.kind as never;
      if (dto.paymentMethod !== undefined) data.paymentMethod = dto.paymentMethod as never;
      if (dto.branchId !== undefined) data.branchId = BigInt(dto.branchId);
      if (dto.locationId !== undefined) data.locationId = toBigInt(dto.locationId);
      if (dto.source !== undefined) data.source = dto.source;
      if (dto.contactPerson !== undefined) data.contactPerson = dto.contactPerson;
      if (dto.description !== undefined) data.description = dto.description;
      if (dto.notes !== undefined) data.notes = dto.notes;
      if (dto.bankAccountId !== undefined) data.bankAccountId = BigInt(dto.bankAccountId);
      if (dto.partnerId !== undefined) data.partnerId = toBigInt(dto.partnerId);
      if (dto.currencyId !== undefined) data.currencyId = BigInt(dto.currencyId);
      if (dto.exchangeRate !== undefined) data.exchangeRate = new Prisma.Decimal(dto.exchangeRate);
      if (dto.transactionDate !== undefined) {
        data.transactionDate = new Date(dto.transactionDate);
        data.fiscalPeriodId = await this.resolvePeriod(tx, dto.fiscalPeriodId, dto.transactionDate);
      } else if (dto.fiscalPeriodId !== undefined) {
        data.fiscalPeriodId = BigInt(dto.fiscalPeriodId);
      }
      if (dto.lines !== undefined) {
        data.amount = this.sumAmount(dto.lines, dto.amount);
        await tx.erpFinCashBankLine.deleteMany({ where: { cashBankTransactionId: id } });
        data.lines = { create: dto.lines.map((l) => this.mapLine(l, header)) };
      }
      await tx.erpFinCashBankTransaction.update({ where: { id }, data });
      await this.syncGiros(
        tx,
        id,
        dto.giros,
        {
          direction: dto.direction ?? existing.direction,
          partnerId: dto.partnerId !== undefined ? toBigInt(dto.partnerId) : existing.partnerId,
          branchId: dto.branchId !== undefined ? BigInt(dto.branchId) : existing.branchId,
          fiscalPeriodId:
            dto.fiscalPeriodId !== undefined ? BigInt(dto.fiscalPeriodId) : existing.fiscalPeriodId,
          currencyId: BigInt(header.currencyId),
          exchangeRate: header.exchangeRate,
        },
        actor,
      );
    });
    return this.one(id);
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.findRaw(id);
    if (existing.status === 'POSTED') {
      throw new BadRequestException('Dokumen POSTED tidak bisa dihapus. Reopen dulu.');
    }
    const actor = actorId ? BigInt(actorId) : null;
    await this.prisma.$transaction(async (tx) => {
      await tx.erpFinCashBankTransaction.update({
        where: { id },
        data: { deletedAt: new Date(), updatedById: actor },
      });
      await tx.erpFinGiro.updateMany({
        where: { sourceTransactionId: id, source: GIRO_SOURCE, deletedAt: null },
        data: { deletedAt: new Date(), updatedById: actor },
      });
    });
    return { success: true, message: 'Transaksi kas/bank dihapus' };
  }

  // ── workflow (§2.7 state machine) ────────────────────────────────────────────
  async transition(id: bigint, dto: TransitionCashBankTransactionDto, actorId?: string) {
    const txn = await this.findRaw(id);
    const actor = actorId ? BigInt(actorId) : null;
    const next = NEXT[txn.status]?.[dto.action];
    if (!next) {
      throw new BadRequestException(`Aksi ${dto.action} tidak valid dari status ${txn.status}.`);
    }
    if (dto.action === A.REJECT && !dto.reason?.trim()) {
      throw new BadRequestException('Alasan reject wajib diisi.');
    }

    if (dto.action === A.POST) {
      const period = await this.prisma.erpFiscalPeriod.findUnique({
        where: { id: txn.fiscalPeriodId },
        select: { status: true },
      });
      if (period?.status === 'CLOSED') {
        throw new BadRequestException('Periode fiskal sudah ditutup — tidak bisa posting.');
      }
      await this.prisma.$transaction(async (tx) => {
        await this.posting.reverseLedger(tx, txn.id);
        await this.posting.postToLedger(tx, txn, actor);
        await tx.erpFinCashBankTransaction.update({
          where: { id },
          data: {
            status: 'POSTED',
            previousStatus: txn.status as never,
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
        await this.posting.reverseLedger(tx, txn.id);
        await tx.erpFinCashBankTransaction.update({
          where: { id },
          data: {
            status: 'DRAFT',
            previousStatus: txn.status as never,
            postingStatus: 'UNPOSTED',
            postedAt: null,
            updatedById: actor,
          },
        });
      });
      return this.one(id);
    }

    await this.prisma.erpFinCashBankTransaction.update({
      where: { id },
      data: {
        status: next as never,
        previousStatus: txn.status as never,
        updatedById: actor,
        ...(dto.action === A.REJECT
          ? {
              metadata: {
                ...((txn.metadata as object) ?? {}),
                rejectReason: dto.reason,
              },
            }
          : {}),
      },
    });
    return this.one(id);
  }
}
