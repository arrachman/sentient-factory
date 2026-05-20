"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicClientModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const clinic_wa_module_1 = require("../clinic-wa/clinic-wa.module");
const clinic_client_controller_1 = require("./clinic-client.controller");
const clinic_client_service_1 = require("./clinic-client.service");
let ClinicClientModule = class ClinicClientModule {
};
exports.ClinicClientModule = ClinicClientModule;
exports.ClinicClientModule = ClinicClientModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, clinic_wa_module_1.ClinicWaModule],
        controllers: [clinic_client_controller_1.ClinicClientController],
        providers: [clinic_client_service_1.ClinicClientService],
        exports: [clinic_client_service_1.ClinicClientService],
    })
], ClinicClientModule);
//# sourceMappingURL=clinic-client.module.js.map