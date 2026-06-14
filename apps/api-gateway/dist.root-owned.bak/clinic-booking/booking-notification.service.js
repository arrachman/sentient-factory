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
var BookingNotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingNotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const clinic_wa_service_1 = require("../clinic-wa/clinic-wa.service");
let BookingNotificationService = BookingNotificationService_1 = class BookingNotificationService {
    wa;
    prisma;
    logger = new common_1.Logger(BookingNotificationService_1.name);
    constructor(wa, prisma) {
        this.wa = wa;
        this.prisma = prisma;
    }
    async templateTargetsPsikolog(templateName) {
        const tpl = await this.prisma.clinicWaTemplate.findFirst({
            where: { name: templateName, isActive: true, deletedAt: null },
            select: { recipients: true },
        });
        return tpl?.recipients?.includes('psikolog') ?? false;
    }
    async notify(booking, templateName, extraVars = {}) {
        if (!booking.client.phoneWa) {
            return;
        }
        try {
            const tanggalFormatted = booking.scheduledStart.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                timeZone: 'Asia/Jakarta',
            });
            const waktuFormatted = booking.scheduledStart.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Jakarta',
            });
            const totalFormatted = new Intl.NumberFormat('id-ID').format(Number(booking.service.basePrice));
            const variables = {
                nama_klien: booking.client.name,
                nama_psikolog: booking.psikolog.fullName ?? 'Psikolog Althea',
                psikolog: booking.psikolog.fullName ?? 'Psikolog Althea',
                tanggal: tanggalFormatted,
                waktu: `${waktuFormatted} WIB`,
                ruang: booking.room.name,
                layanan: booking.service.name,
                total: totalFormatted,
                ...extraVars,
            };
            await this.wa.dispatch({
                templateName,
                recipientType: 'klien',
                recipientPhone: booking.client.phoneWa,
                variables,
                bookingId: booking.id,
            });
            if (booking.psikolog.phone && (await this.templateTargetsPsikolog(templateName))) {
                try {
                    await this.wa.dispatch({
                        templateName,
                        recipientType: 'psikolog',
                        recipientPhone: booking.psikolog.phone,
                        variables,
                        bookingId: booking.id,
                    });
                }
                catch (errPsikolog) {
                    this.logger.warn(`[BookingNotification] psikolog fan-out failed template=${templateName} bookingId=${booking.id}: ${errPsikolog instanceof Error ? errPsikolog.message : errPsikolog}`);
                }
            }
        }
        catch (err) {
            console.error(`[BookingNotification] template=${templateName} bookingId=${booking.id}:`, err);
        }
    }
    async notifyPsikologInfo(booking) {
        if (!booking.client.phoneWa)
            return;
        try {
            const profile = booking.psikolog.clinicPsikologProfile;
            await this.wa.dispatch({
                templateName: 'Info Psikolog',
                recipientType: 'klien',
                recipientPhone: booking.client.phoneWa,
                variables: {
                    nama_psikolog: booking.psikolog.fullName ?? 'Psikolog Althea',
                    title: profile?.title ?? '',
                    spesialisasi: profile?.specialty?.join(', ') ?? '',
                    pendidikan: '',
                    lisensi: profile?.license ?? '',
                },
                bookingId: booking.id,
            });
        }
        catch (err) {
            console.error(`[BookingNotification] template=Info Psikolog bookingId=${booking.id}:`, err);
        }
    }
    async sendManualReminder(booking, templateName) {
        if (booking.status === 'cancelled' || booking.status === 'completed') {
            throw new common_1.BadRequestException(`Booking ${booking.status} — reminder hanya untuk booking aktif`);
        }
        const phone = booking.client?.phoneWa;
        if (!phone) {
            throw new common_1.BadRequestException('Klien tidak punya nomor WhatsApp');
        }
        return this.wa.dispatch({
            templateName,
            recipientType: 'klien',
            recipientPhone: phone,
            variables: {
                nama_klien: booking.client?.name ?? '',
                layanan: booking.service?.name ?? '',
                psikolog: booking.psikolog?.fullName ?? '',
                ruang: booking.room?.name ?? '',
                tanggal: new Date(booking.scheduledStart).toLocaleString('id-ID', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                }),
                waktu: new Date(booking.scheduledStart).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            },
            bookingId: booking.id,
        });
    }
};
exports.BookingNotificationService = BookingNotificationService;
exports.BookingNotificationService = BookingNotificationService = BookingNotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clinic_wa_service_1.ClinicWaService,
        prisma_service_1.PrismaService])
], BookingNotificationService);
//# sourceMappingURL=booking-notification.service.js.map