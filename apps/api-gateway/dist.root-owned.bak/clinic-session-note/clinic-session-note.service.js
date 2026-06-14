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
exports.ClinicSessionNoteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClinicSessionNoteService = class ClinicSessionNoteService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId, actorRoles = []) {
        const booking = await this.prisma.clinicBooking.findFirst({
            where: { id: dto.bookingId, deletedAt: null },
            select: { id: true, psikologUserId: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking ${dto.bookingId} not found`);
        }
        const isAdmin = actorRoles.includes('clinic-admin');
        if (!isAdmin && actorId !== booking.psikologUserId) {
            throw new common_1.ForbiddenException('Hanya psikolog yang assigned ke booking (atau admin) yang bisa menulis catatan');
        }
        const note = await this.prisma.clinicSessionNote.create({
            data: {
                bookingId: dto.bookingId,
                psikologUserId: booking.psikologUserId,
                noteText: dto.noteText,
                isPrivate: dto.isPrivate ?? true,
                createdBy: actorId,
                updatedBy: actorId,
            },
        });
        return { success: true, data: note, message: 'Note created' };
    }
    async findAll(query, actorId, actorRoles = []) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 50;
        const skip = (page - 1) * limit;
        const isAdmin = actorRoles.includes('clinic-admin');
        const where = { deletedAt: null };
        if (query.bookingId)
            where.bookingId = query.bookingId;
        if (query.psikologUserId)
            where.psikologUserId = query.psikologUserId;
        if (typeof query.isPrivate === 'boolean')
            where.isPrivate = query.isPrivate;
        if (!isAdmin && actorId) {
            where.OR = [{ psikologUserId: actorId }, { isPrivate: false }];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.clinicSessionNote.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.clinicSessionNote.count({ where }),
        ]);
        return {
            success: true,
            data: items,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findByBooking(bookingId, actorId, actorRoles = []) {
        const isAdmin = actorRoles.includes('clinic-admin');
        const where = {
            bookingId,
            deletedAt: null,
        };
        if (!isAdmin && actorId) {
            where.OR = [{ psikologUserId: actorId }, { isPrivate: false }];
        }
        const notes = await this.prisma.clinicSessionNote.findMany({
            where,
            orderBy: [{ createdAt: 'desc' }],
        });
        return { success: true, data: notes };
    }
    async findOne(id, actorId, actorRoles = []) {
        const note = await this.prisma.clinicSessionNote.findFirst({
            where: { id, deletedAt: null },
        });
        if (!note)
            throw new common_1.NotFoundException(`Note ${id} not found`);
        const isAdmin = actorRoles.includes('clinic-admin');
        if (!isAdmin && note.isPrivate && note.psikologUserId !== actorId) {
            throw new common_1.ForbiddenException('Catatan private — hanya psikolog yang menulis bisa lihat');
        }
        return { success: true, data: note };
    }
    async update(id, dto, actorId, actorRoles = []) {
        const existing = await this.findOne(id, actorId, actorRoles);
        const isAdmin = actorRoles.includes('clinic-admin');
        if (!isAdmin && existing.data.psikologUserId !== actorId) {
            throw new common_1.ForbiddenException('Hanya psikolog penulis (atau admin) yang bisa edit');
        }
        const updated = await this.prisma.clinicSessionNote.update({
            where: { id },
            data: {
                noteText: dto.noteText ?? undefined,
                isPrivate: dto.isPrivate ?? undefined,
                updatedBy: actorId,
            },
        });
        return { success: true, data: updated, message: 'Note updated' };
    }
    async remove(id, actorId, actorRoles = []) {
        const existing = await this.findOne(id, actorId, actorRoles);
        const isAdmin = actorRoles.includes('clinic-admin');
        if (!isAdmin && existing.data.psikologUserId !== actorId) {
            throw new common_1.ForbiddenException('Hanya psikolog penulis (atau admin) yang bisa hapus');
        }
        await this.prisma.clinicSessionNote.update({
            where: { id },
            data: { deletedAt: new Date(), deletedBy: actorId, updatedBy: actorId },
        });
        return { success: true, message: 'Note deleted' };
    }
};
exports.ClinicSessionNoteService = ClinicSessionNoteService;
exports.ClinicSessionNoteService = ClinicSessionNoteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClinicSessionNoteService);
//# sourceMappingURL=clinic-session-note.service.js.map