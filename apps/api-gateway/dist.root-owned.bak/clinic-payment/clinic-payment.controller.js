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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicPaymentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const idempotency_interceptor_1 = require("../common/interceptors/idempotency.interceptor");
const clinic_payment_service_1 = require("./clinic-payment.service");
let ClinicPaymentController = class ClinicPaymentController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(dto, req.user?.sub ?? req.user?.id);
    }
    record(id, dto, req) {
        return this.service.record(id, dto, req.user?.sub ?? req.user?.id);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    findByBooking(bookingId) {
        return this.service.findByBooking(bookingId);
    }
    async receipt(id) {
        return this.service.receiptHtml(id);
    }
    async receiptPdf(id, res) {
        const buffer = await this.service.receiptPdf(id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="receipt-${id}.pdf"`,
            'Content-Length': buffer.length.toString(),
        });
        res.end(buffer);
    }
    sendReceipt(id, req) {
        return this.service.sendReceiptViaWa(id, req.user?.sub ?? req.user?.id);
    }
};
exports.ClinicPaymentController = ClinicPaymentController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-resepsionis'),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Create payment record untuk booking (supports Idempotency-Key)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClinicPaymentController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/record'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-resepsionis'),
    (0, common_1.UseInterceptors)(idempotency_interceptor_1.IdempotencyInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Record payment installment (DP atau lunas, supports Idempotency-Key)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], ClinicPaymentController.prototype, "record", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-resepsionis', 'clinic-owner'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClinicPaymentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('booking/:bookingId'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-resepsionis', 'clinic-owner'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('bookingId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClinicPaymentController.prototype, "findByBooking", null);
__decorate([
    (0, common_1.Get)(':id/receipt'),
    (0, common_1.Header)('Content-Type', 'text/html; charset=utf-8'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-resepsionis'),
    (0, swagger_1.ApiOperation)({ summary: 'Receipt HTML (untuk print atau preview)' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClinicPaymentController.prototype, "receipt", null);
__decorate([
    (0, common_1.Get)(':id/receipt.pdf'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-resepsionis'),
    (0, swagger_1.ApiOperation)({ summary: 'Receipt PDF (binary download via pdfkit)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ClinicPaymentController.prototype, "receiptPdf", null);
__decorate([
    (0, common_1.Post)(':id/send-receipt'),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-resepsionis'),
    (0, swagger_1.ApiOperation)({ summary: 'Send receipt notification to client via WhatsApp' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ClinicPaymentController.prototype, "sendReceipt", null);
exports.ClinicPaymentController = ClinicPaymentController = __decorate([
    (0, swagger_1.ApiTags)('Clinic — Payment'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('clinic/payment'),
    __metadata("design:paramtypes", [clinic_payment_service_1.ClinicPaymentService])
], ClinicPaymentController);
//# sourceMappingURL=clinic-payment.controller.js.map