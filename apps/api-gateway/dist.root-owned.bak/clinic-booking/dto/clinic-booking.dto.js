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
exports.CreatePackageBookingDto = exports.PackageSessionDto = exports.QueryBookingDto = exports.CancelBookingDto = exports.RescheduleBookingDto = exports.UpdateBookingDto = exports.CreateBookingDto = exports.BOOKING_STATUSES = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
exports.BOOKING_STATUSES = [
    'checked_in',
    'in_progress',
    'completed',
    'cancelled',
];
class CreateBookingDto {
    clientId;
    serviceId;
    psikologUserId;
    roomId;
    scheduledStart;
    scheduledEnd;
    sessionN;
    sessionTotal;
    packageGroupId;
    createdViaWalkIn;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { clientId: { required: true, type: () => Number }, serviceId: { required: true, type: () => Number }, psikologUserId: { required: true, type: () => Number }, roomId: { required: true, type: () => Number }, scheduledStart: { required: true, type: () => String }, scheduledEnd: { required: true, type: () => String }, sessionN: { required: false, type: () => Number, minimum: 1 }, sessionTotal: { required: false, type: () => Number, minimum: 1 }, packageGroupId: { required: false, type: () => String }, createdViaWalkIn: { required: false, type: () => Boolean }, notes: { required: false, type: () => String, maxLength: 2000 } };
    }
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 147, description: 'User ID dari psikolog (clinic-psikolog role)' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "psikologUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-15T09:00:00+07:00', description: 'ISO datetime jadwal mulai' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "scheduledStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-15T10:00:00+07:00', description: 'ISO datetime jadwal selesai' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "scheduledEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "sessionN", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, default: 1, description: 'Total sesi paket' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "sessionTotal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Group ID untuk multi-session package (UUID)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "packageGroupId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false, description: 'Walk-in booking (resepsionis)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateBookingDto.prototype, "createdViaWalkIn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "notes", void 0);
class UpdateBookingDto extends (0, swagger_1.PartialType)(CreateBookingDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateBookingDto = UpdateBookingDto;
class RescheduleBookingDto {
    scheduledStart;
    scheduledEnd;
    roomId;
    psikologUserId;
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { scheduledStart: { required: true, type: () => String }, scheduledEnd: { required: true, type: () => String }, roomId: { required: false, type: () => Number }, psikologUserId: { required: false, type: () => Number }, reason: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.RescheduleBookingDto = RescheduleBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-15T11:00:00+07:00' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RescheduleBookingDto.prototype, "scheduledStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-15T12:00:00+07:00' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RescheduleBookingDto.prototype, "scheduledEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'New room (optional, default: keep existing)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], RescheduleBookingDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 147, description: 'New psikolog (optional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], RescheduleBookingDto.prototype, "psikologUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], RescheduleBookingDto.prototype, "reason", void 0);
class CancelBookingDto {
    reason;
    static _OPENAPI_METADATA_FACTORY() {
        return { reason: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.CancelBookingDto = CancelBookingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CancelBookingDto.prototype, "reason", void 0);
class QueryBookingDto {
    page = 1;
    limit = 50;
    status;
    date;
    dateFrom;
    dateTo;
    psikologUserId;
    clientId;
    roomId;
    includeCancelled;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, default: 1, minimum: 1 }, limit: { required: false, type: () => Number, default: 50, minimum: 1, maximum: 500 }, status: { required: false, type: () => Object, enum: exports.BOOKING_STATUSES }, date: { required: false, type: () => String }, dateFrom: { required: false, type: () => String }, dateTo: { required: false, type: () => String }, psikologUserId: { required: false, type: () => Number }, clientId: { required: false, type: () => Number }, roomId: { required: false, type: () => Number }, includeCancelled: { required: false, type: () => Boolean } };
    }
}
exports.QueryBookingDto = QueryBookingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryBookingDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], QueryBookingDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: exports.BOOKING_STATUSES }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.BOOKING_STATUSES),
    __metadata("design:type", String)
], QueryBookingDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ISO date — filter booking pada hari ini (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryBookingDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter booking dari tanggal (YYYY-MM-DD), inklusif' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryBookingDto.prototype, "dateFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter booking sampai tanggal (YYYY-MM-DD), inklusif' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryBookingDto.prototype, "dateTo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by psikolog user id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QueryBookingDto.prototype, "psikologUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by client id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QueryBookingDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by room id' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], QueryBookingDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string') {
            const v = value.trim().toLowerCase();
            if (v === 'true')
                return true;
            if (v === 'false')
                return false;
        }
        return value;
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], QueryBookingDto.prototype, "includeCancelled", void 0);
class PackageSessionDto {
    scheduledStart;
    scheduledEnd;
    psikologUserId;
    roomId;
    static _OPENAPI_METADATA_FACTORY() {
        return { scheduledStart: { required: true, type: () => String }, scheduledEnd: { required: true, type: () => String }, psikologUserId: { required: false, type: () => Number }, roomId: { required: false, type: () => Number } };
    }
}
exports.PackageSessionDto = PackageSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-15T09:00:00+07:00' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PackageSessionDto.prototype, "scheduledStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-05-15T10:00:00+07:00' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PackageSessionDto.prototype, "scheduledEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Override psikolog (default: base)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PackageSessionDto.prototype, "psikologUserId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Override room (default: base)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PackageSessionDto.prototype, "roomId", void 0);
class CreatePackageBookingDto {
    clientId;
    serviceId;
    psikologUserId;
    roomId;
    sessions;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { clientId: { required: true, type: () => Number }, serviceId: { required: true, type: () => Number }, psikologUserId: { required: true, type: () => Number }, roomId: { required: true, type: () => Number }, sessions: { required: true, type: () => [require("./clinic-booking.dto").PackageSessionDto] }, notes: { required: false, type: () => String, maxLength: 2000 } };
    }
}
exports.CreatePackageBookingDto = CreatePackageBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePackageBookingDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePackageBookingDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 147, description: 'Default psikolog untuk semua sesi' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePackageBookingDto.prototype, "psikologUserId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Default room untuk semua sesi' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePackageBookingDto.prototype, "roomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [PackageSessionDto],
        description: 'Array sesi (length harus = service.sessionCount)',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.ArrayMaxSize)(50),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PackageSessionDto),
    __metadata("design:type", Array)
], CreatePackageBookingDto.prototype, "sessions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], CreatePackageBookingDto.prototype, "notes", void 0);
//# sourceMappingURL=clinic-booking.dto.js.map