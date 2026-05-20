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
exports.ErpJwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const ERP_COOKIE = 'erp_token';
function extractErpCookieToken(req) {
    if (!req)
        return null;
    const cookieHeader = typeof req.headers?.cookie === 'string' ? req.headers.cookie : '';
    if (!cookieHeader)
        return null;
    const part = cookieHeader
        .split(';')
        .map((p) => p.trim())
        .find((p) => p.startsWith(`${ERP_COOKIE}=`));
    return part ? part.slice(`${ERP_COOKIE}=`.length) || null : null;
}
let ErpJwtStrategy = class ErpJwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'erp-jwt') {
    configService;
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                extractErpCookieToken,
                passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') ?? 'super-secret-key-change-in-production',
            passReqToCallback: false,
        });
        this.configService = configService;
    }
    async validate(payload) {
        return {
            id: payload.sub,
            email: payload.email,
            username: payload.username,
            erpLevel: payload.erpLevel,
            sid: payload.sid,
        };
    }
};
exports.ErpJwtStrategy = ErpJwtStrategy;
exports.ErpJwtStrategy = ErpJwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ErpJwtStrategy);
//# sourceMappingURL=erp-jwt.strategy.js.map