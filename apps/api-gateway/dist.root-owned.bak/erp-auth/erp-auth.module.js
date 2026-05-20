"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErpAuthModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("../prisma/prisma.module");
const erp_auth_service_1 = require("./erp-auth.service");
const erp_auth_controller_1 = require("./erp-auth.controller");
const erp_jwt_strategy_1 = require("./strategies/erp-jwt.strategy");
let ErpAuthModule = class ErpAuthModule {
};
exports.ErpAuthModule = ErpAuthModule;
exports.ErpAuthModule = ErpAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            prisma_module_1.PrismaModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'super-secret-key-change-in-production',
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN') || '1d',
                    },
                }),
            }),
        ],
        providers: [erp_auth_service_1.ErpAuthService, erp_jwt_strategy_1.ErpJwtStrategy],
        controllers: [erp_auth_controller_1.ErpAuthController],
        exports: [erp_auth_service_1.ErpAuthService],
    })
], ErpAuthModule);
//# sourceMappingURL=erp-auth.module.js.map