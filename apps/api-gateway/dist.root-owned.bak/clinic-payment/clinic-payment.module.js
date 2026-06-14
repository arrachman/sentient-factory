"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicPaymentModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const clinic_wa_module_1 = require("../clinic-wa/clinic-wa.module");
const idempotency_interceptor_1 = require("../common/interceptors/idempotency.interceptor");
const clinic_payment_controller_1 = require("./clinic-payment.controller");
const clinic_payment_service_1 = require("./clinic-payment.service");
let ClinicPaymentModule = class ClinicPaymentModule {
};
exports.ClinicPaymentModule = ClinicPaymentModule;
exports.ClinicPaymentModule = ClinicPaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, clinic_wa_module_1.ClinicWaModule],
        controllers: [clinic_payment_controller_1.ClinicPaymentController],
        providers: [clinic_payment_service_1.ClinicPaymentService, idempotency_interceptor_1.IdempotencyInterceptor],
        exports: [clinic_payment_service_1.ClinicPaymentService],
    })
], ClinicPaymentModule);
//# sourceMappingURL=clinic-payment.module.js.map