"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpDocumentNumberingsService = void 0;
const common_1 = require("@nestjs/common");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
let ErpDocumentNumberingsService = class ErpDocumentNumberingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.erpDocumentNumbering.findFirst({
            where: { documentCode: dto.documentCode },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            if (existing.deletedAt) {
                throw new common_1.BadRequestException(`Document code "${dto.documentCode}" already exists (soft-deleted). Restore or use a different code.`);
            }
            throw new common_1.BadRequestException(`Document code "${dto.documentCode}" already exists`);
        }
        const actorBigInt = (0, audit_user_util_1.toAuditUserId)(actorId) ? BigInt((0, audit_user_util_1.toAuditUserId)(actorId)) : undefined;
        const created = await this.prisma.erpDocumentNumbering.create({
            data: {
                documentCode: dto.documentCode,
                name: dto.name,
                prefix: dto.prefix,
                digitCount: dto.digitCount,
                resetPolicy: dto.resetPolicy,
                nextNumber: dto.nextNumber ?? 1,
                menuId: dto.menuId ? BigInt(dto.menuId) : null,
                affectsLedger: dto.affectsLedger ?? false,
                affectsInventory: dto.affectsInventory ?? false,
                affectsCost: dto.affectsCost ?? false,
                notes: dto.notes,
                createdById: actorBigInt,
                updatedById: actorBigInt,
            },
        });
        return { success: true, data: created };
    }
    async findAll(query) {
        const where = {};
        if (query.isActive === true || query.isActive === undefined) {
            where.deletedAt = null;
        }
        if (query.documentCode?.trim())
            where.documentCode = query.documentCode.trim();
        const items = await this.prisma.erpDocumentNumbering.findMany({
            where,
            orderBy: [{ documentCode: 'asc' }],
        });
        return { success: true, data: items };
    }
    async findOne(id) {
        const item = await this.prisma.erpDocumentNumbering.findFirst({
            where: { id, deletedAt: null },
            include: { menu: true },
        });
        if (!item)
            throw new common_1.NotFoundException('Document numbering not found');
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpDocumentNumbering.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Document numbering not found');
        if (dto.documentCode && dto.documentCode !== existing.documentCode) {
            const duplicate = await this.prisma.erpDocumentNumbering.findFirst({
                where: { documentCode: dto.documentCode, NOT: { id } },
                select: { id: true },
            });
            if (duplicate) {
                throw new common_1.BadRequestException(`Document code "${dto.documentCode}" already exists`);
            }
        }
        const actorBigInt = (0, audit_user_util_1.toAuditUserId)(actorId) ? BigInt((0, audit_user_util_1.toAuditUserId)(actorId)) : undefined;
        const updated = await this.prisma.erpDocumentNumbering.update({
            where: { id },
            data: {
                documentCode: dto.documentCode,
                name: dto.name,
                prefix: dto.prefix,
                digitCount: dto.digitCount,
                resetPolicy: dto.resetPolicy,
                nextNumber: dto.nextNumber,
                menuId: dto.menuId !== undefined ? (dto.menuId ? BigInt(dto.menuId) : null) : undefined,
                affectsLedger: dto.affectsLedger,
                affectsInventory: dto.affectsInventory,
                affectsCost: dto.affectsCost,
                notes: dto.notes,
                updatedById: actorBigInt,
            },
        });
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpDocumentNumbering.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing)
            throw new common_1.NotFoundException('Document numbering not found');
        const actorBigInt = (0, audit_user_util_1.toAuditUserId)(actorId) ? BigInt((0, audit_user_util_1.toAuditUserId)(actorId)) : undefined;
        await this.prisma.erpDocumentNumbering.update({
            where: { id },
            data: { deletedAt: new Date(), updatedById: actorBigInt },
        });
        return { success: true, message: 'Document numbering deleted' };
    }
    async getNextNumber(documentCode) {
        const result = await this.prisma.$transaction(async (tx) => {
            const numbering = await tx.erpDocumentNumbering.findFirst({
                where: { documentCode, deletedAt: null },
            });
            if (!numbering) {
                throw new common_1.NotFoundException(`Document numbering for code "${documentCode}" not found`);
            }
            const seq = numbering.nextNumber;
            const padded = String(seq).padStart(numbering.digitCount, '0');
            const docNumber = `${numbering.prefix}${padded}`;
            await tx.erpDocumentNumbering.update({
                where: { id: numbering.id },
                data: { nextNumber: seq + 1 },
            });
            return { documentCode, docNumber, sequence: seq };
        });
        return { success: true, data: result };
    }
};
exports.ErpDocumentNumberingsService = ErpDocumentNumberingsService;
exports.ErpDocumentNumberingsService = ErpDocumentNumberingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpDocumentNumberingsService);
//# sourceMappingURL=erp-document-numberings.service.js.map