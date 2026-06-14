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
exports.ClinicServiceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ClinicServiceService = class ClinicServiceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizeSlotOverrides(raw) {
        if (!raw || raw.length === 0)
            return [];
        const byIndex = new Map();
        for (const o of raw) {
            if (o.start >= o.end) {
                throw new common_1.BadRequestException(`Slot override index ${o.index}: jam mulai (${o.start}) harus sebelum jam selesai (${o.end}).`);
            }
            byIndex.set(o.index, { index: o.index, start: o.start, end: o.end });
        }
        return [...byIndex.values()].sort((a, b) => a.index - b.index);
    }
    async create(dto, actorId) {
        const existing = await this.prisma.clinicService.findFirst({
            where: { name: dto.name, deletedAt: null },
            select: { id: true },
        });
        if (existing) {
            throw new common_1.ConflictException(`Service '${dto.name}' sudah ada.`);
        }
        const { slotOverrides: _slotOverrides, ...rest } = dto;
        const created = await this.prisma.clinicService.create({
            data: {
                ...rest,
                basePrice: new client_1.Prisma.Decimal(dto.basePrice),
                isActive: dto.isActive ?? true,
                slotOverrides: this.normalizeSlotOverrides(dto.slotOverrides),
                createdBy: actorId,
                updatedBy: actorId,
            },
        });
        return { success: true, data: created, message: 'Service created' };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 50;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (query.category)
            where.category = query.category;
        if (typeof query.isActive === 'boolean')
            where.isActive = query.isActive;
        if (query.search?.trim()) {
            where.OR = [
                { name: { contains: query.search.trim(), mode: 'insensitive' } },
                { description: { contains: query.search.trim(), mode: 'insensitive' } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.clinicService.findMany({
                where,
                orderBy: [{ category: 'asc' }, { name: 'asc' }],
                skip,
                take: limit,
            }),
            this.prisma.clinicService.count({ where }),
        ]);
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        const ids = items.map((s) => s.id);
        const bookedAgg = ids.length === 0
            ? []
            : await this.prisma.clinicBooking.groupBy({
                by: ['serviceId'],
                where: {
                    serviceId: { in: ids },
                    status: { not: 'cancelled' },
                    deletedAt: null,
                    scheduledStart: { gte: monthStart },
                },
                _count: { _all: true },
            });
        const bookedMap = new Map(bookedAgg.map((row) => [row.serviceId, row._count._all]));
        const hasBookingsRows = ids.length === 0
            ? []
            : await this.prisma.clinicBooking.findMany({
                where: { serviceId: { in: ids }, deletedAt: null },
                select: { serviceId: true },
                distinct: ['serviceId'],
            });
        const hasBookingsSet = new Set(hasBookingsRows.map((b) => b.serviceId));
        const enriched = items.map((s) => ({
            ...s,
            bookedThisMonth: bookedMap.get(s.id) ?? 0,
            hasBookings: hasBookingsSet.has(s.id),
        }));
        return {
            success: true,
            data: enriched,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const service = await this.prisma.clinicService.findFirst({
            where: { id, deletedAt: null },
        });
        if (!service)
            throw new common_1.NotFoundException(`Service ${id} not found`);
        return { success: true, data: service };
    }
    async update(id, dto, actorId) {
        await this.findOne(id);
        const { slotOverrides: _slotOverrides, ...rest } = dto;
        const data = {
            ...rest,
            updatedBy: actorId,
        };
        if (dto.basePrice !== undefined)
            data.basePrice = new client_1.Prisma.Decimal(dto.basePrice);
        if (dto.slotOverrides !== undefined) {
            data.slotOverrides = this.normalizeSlotOverrides(dto.slotOverrides);
        }
        const updated = await this.prisma.clinicService.update({ where: { id }, data });
        return { success: true, data: updated, message: 'Service updated' };
    }
    async remove(id, actorId) {
        await this.findOne(id);
        const bookingCount = await this.prisma.clinicBooking.count({
            where: { serviceId: id, deletedAt: null },
        });
        if (bookingCount > 0) {
            throw new common_1.ConflictException(`Service ini punya ${bookingCount} booking terkait. Tidak bisa dihapus — nonaktifkan saja lewat toggle "Aktif".`);
        }
        await this.prisma.clinicService.update({
            where: { id },
            data: { deletedAt: new Date(), deletedBy: actorId, isActive: false, updatedBy: actorId },
        });
        return { success: true, message: 'Service deleted' };
    }
};
exports.ClinicServiceService = ClinicServiceService;
exports.ClinicServiceService = ClinicServiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClinicServiceService);
//# sourceMappingURL=clinic-service.service.js.map