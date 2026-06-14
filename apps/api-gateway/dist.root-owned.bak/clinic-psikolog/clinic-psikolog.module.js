"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicPsikologModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const clinic_wa_module_1 = require("../clinic-wa/clinic-wa.module");
const clinic_psikolog_controller_1 = require("./clinic-psikolog.controller");
const clinic_psikolog_service_1 = require("./clinic-psikolog.service");
const psikolog_dashboard_service_1 = require("./psikolog-dashboard.service");
const psikolog_availability_service_1 = require("./psikolog-availability.service");
let ClinicPsikologModule = class ClinicPsikologModule {
};
exports.ClinicPsikologModule = ClinicPsikologModule;
exports.ClinicPsikologModule = ClinicPsikologModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, clinic_wa_module_1.ClinicWaModule],
        controllers: [clinic_psikolog_controller_1.ClinicPsikologController],
        providers: [clinic_psikolog_service_1.ClinicPsikologService, psikolog_dashboard_service_1.PsikologDashboardService, psikolog_availability_service_1.PsikologAvailabilityService],
        exports: [clinic_psikolog_service_1.ClinicPsikologService],
    })
], ClinicPsikologModule);
//# sourceMappingURL=clinic-psikolog.module.js.map