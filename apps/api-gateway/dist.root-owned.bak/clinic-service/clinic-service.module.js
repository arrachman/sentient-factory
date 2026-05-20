"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicServiceModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const clinic_service_controller_1 = require("./clinic-service.controller");
const clinic_service_service_1 = require("./clinic-service.service");
let ClinicServiceModule = class ClinicServiceModule {
};
exports.ClinicServiceModule = ClinicServiceModule;
exports.ClinicServiceModule = ClinicServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [clinic_service_controller_1.ClinicServiceController],
        providers: [clinic_service_service_1.ClinicServiceService],
        exports: [clinic_service_service_1.ClinicServiceService],
    })
], ClinicServiceModule);
//# sourceMappingURL=clinic-service.module.js.map