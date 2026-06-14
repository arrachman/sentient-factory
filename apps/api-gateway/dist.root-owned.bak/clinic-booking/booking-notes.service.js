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
exports.BookingNotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookingNotesService = class BookingNotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addNote(bookingId, noteText, actorId) {
        if (!noteText.trim()) {
            throw new common_1.BadRequestException('noteText tidak boleh kosong');
        }
        const booking = await this.prisma.clinicBooking.findFirst({
            where: { id: bookingId, deletedAt: null },
            select: { id: true, psikologUserId: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking ${bookingId} tidak ditemukan`);
        }
        const note = await this.prisma.clinicSessionNote.create({
            data: {
                bookingId: booking.id,
                psikologUserId: actorId ?? booking.psikologUserId,
                noteText: noteText.trim(),
                isPrivate: true,
                createdBy: actorId,
                updatedBy: actorId,
            },
        });
        return { success: true, data: note, message: 'Note saved' };
    }
    async listNotes(bookingId) {
        const notes = await this.prisma.clinicSessionNote.findMany({
            where: { bookingId, deletedAt: null },
            orderBy: [{ createdAt: 'desc' }],
        });
        return { success: true, data: notes };
    }
};
exports.BookingNotesService = BookingNotesService;
exports.BookingNotesService = BookingNotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingNotesService);
//# sourceMappingURL=booking-notes.service.js.map