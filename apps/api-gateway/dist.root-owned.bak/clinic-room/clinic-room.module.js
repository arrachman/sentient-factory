"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicRoomModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const clinic_room_controller_1 = require("./clinic-room.controller");
const clinic_room_service_1 = require("./clinic-room.service");
let ClinicRoomModule = class ClinicRoomModule {
};
exports.ClinicRoomModule = ClinicRoomModule;
exports.ClinicRoomModule = ClinicRoomModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [clinic_room_controller_1.ClinicRoomController],
        providers: [clinic_room_service_1.ClinicRoomService],
        exports: [clinic_room_service_1.ClinicRoomService],
    })
], ClinicRoomModule);
//# sourceMappingURL=clinic-room.module.js.map