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
exports.ClinicRoomService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClinicRoomService = class ClinicRoomService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.clinicRoom.findFirst({
            where: { name: dto.name, deletedAt: null },
            select: { id: true },
        });
        if (existing)
            throw new common_1.ConflictException(`Room '${dto.name}' sudah ada.`);
        const created = await this.prisma.clinicRoom.create({
            data: { ...dto, isActive: dto.isActive ?? true, createdBy: actorId, updatedBy: actorId },
        });
        return { success: true, data: created, message: 'Room created' };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 50;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (query.type)
            where.type = query.type;
        if (typeof query.isActive === 'boolean')
            where.isActive = query.isActive;
        if (query.search?.trim()) {
            where.OR = [
                { name: { contains: query.search.trim(), mode: 'insensitive' } },
                { description: { contains: query.search.trim(), mode: 'insensitive' } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.clinicRoom.findMany({
                where,
                orderBy: [{ type: 'asc' }, { name: 'asc' }],
                skip,
                take: limit,
            }),
            this.prisma.clinicRoom.count({ where }),
        ]);
        const ids = items.map((r) => r.id);
        const hasBookingsRows = ids.length === 0
            ? []
            : await this.prisma.clinicBooking.findMany({
                where: { roomId: { in: ids }, deletedAt: null },
                select: { roomId: true },
                distinct: ['roomId'],
            });
        const hasBookingsSet = new Set(hasBookingsRows.map((b) => b.roomId));
        return {
            success: true,
            data: items.map((r) => ({ ...r, hasBookings: hasBookingsSet.has(r.id) })),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const room = await this.prisma.clinicRoom.findFirst({ where: { id, deletedAt: null } });
        if (!room)
            throw new common_1.NotFoundException(`Room ${id} not found`);
        return { success: true, data: room };
    }
    async update(id, dto, actorId) {
        await this.findOne(id);
        const updated = await this.prisma.clinicRoom.update({
            where: { id },
            data: { ...dto, updatedBy: actorId },
        });
        return { success: true, data: updated, message: 'Room updated' };
    }
    async remove(id, actorId) {
        await this.findOne(id);
        const bookingCount = await this.prisma.clinicBooking.count({
            where: { roomId: id, deletedAt: null },
        });
        if (bookingCount > 0) {
            throw new common_1.ConflictException(`Ruangan ini punya ${bookingCount} booking terkait. Tidak bisa dihapus — nonaktifkan saja lewat toggle "Aktif".`);
        }
        await this.prisma.clinicRoom.update({
            where: { id },
            data: { deletedAt: new Date(), deletedBy: actorId, isActive: false, updatedBy: actorId },
        });
        return { success: true, message: 'Room deleted' };
    }
};
exports.ClinicRoomService = ClinicRoomService;
exports.ClinicRoomService = ClinicRoomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClinicRoomService);
//# sourceMappingURL=clinic-room.service.js.map