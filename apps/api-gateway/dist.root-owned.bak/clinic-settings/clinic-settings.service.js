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
exports.ClinicSettingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const SETTINGS_ID = 1;
let ClinicSettingsService = class ClinicSettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async get() {
        const settings = await this.prisma.clinicSettings.findUnique({
            where: { id: SETTINGS_ID },
        });
        if (!settings) {
            throw new common_1.NotFoundException('Clinic settings not initialized. Run db:seed:clinic untuk seed default.');
        }
        return { success: true, data: settings };
    }
    async update(dto, actorId) {
        const data = { updatedBy: actorId };
        if (dto.clinicName !== undefined)
            data.clinicName = dto.clinicName;
        if (dto.address !== undefined)
            data.address = dto.address;
        if (dto.timezone !== undefined)
            data.timezone = dto.timezone;
        if (dto.currency !== undefined)
            data.currency = dto.currency;
        if (dto.slotsOfDay !== undefined)
            data.slotsOfDay = dto.slotsOfDay;
        if (dto.closedDayOfWeek !== undefined)
            data.closedDayOfWeek = dto.closedDayOfWeek;
        if (dto.holidays !== undefined)
            data.holidays = dto.holidays;
        if (dto.taxEnabled !== undefined)
            data.taxEnabled = dto.taxEnabled;
        if (dto.taxPercentage !== undefined)
            data.taxPercentage = new client_1.Prisma.Decimal(dto.taxPercentage);
        if (dto.dpPercentage !== undefined)
            data.dpPercentage = new client_1.Prisma.Decimal(dto.dpPercentage);
        if (dto.waSendEnabled !== undefined)
            data.waSendEnabled = dto.waSendEnabled;
        if (dto.waCountryCode !== undefined)
            data.waCountryCode = dto.waCountryCode;
        const updated = await this.prisma.clinicSettings.upsert({
            where: { id: SETTINGS_ID },
            create: {
                id: SETTINGS_ID,
                clinicName: dto.clinicName ?? 'Althea Psychology',
                ...data,
            },
            update: data,
        });
        return { success: true, data: updated, message: 'Settings updated' };
    }
};
exports.ClinicSettingsService = ClinicSettingsService;
exports.ClinicSettingsService = ClinicSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClinicSettingsService);
//# sourceMappingURL=clinic-settings.service.js.map