"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigIntSerializerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const rxjs_1 = require("rxjs");
let BigIntSerializerInterceptor = class BigIntSerializerInterceptor {
    intercept(_context, next) {
        return next.handle().pipe((0, rxjs_1.map)((data) => serializePrismaTypes(data)));
    }
};
exports.BigIntSerializerInterceptor = BigIntSerializerInterceptor;
exports.BigIntSerializerInterceptor = BigIntSerializerInterceptor = __decorate([
    (0, common_1.Injectable)()
], BigIntSerializerInterceptor);
function serializePrismaTypes(value) {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    if (value instanceof client_1.Prisma.Decimal) {
        return Number(value.toString());
    }
    if (Array.isArray(value)) {
        return value.map((item) => serializePrismaTypes(item));
    }
    if (value instanceof Date || value === null || value === undefined) {
        return value;
    }
    if (typeof value === 'object') {
        const obj = value;
        if (typeof obj.s === 'number' &&
            typeof obj.e === 'number' &&
            Array.isArray(obj.d) &&
            Object.keys(obj).length === 3) {
            try {
                return Number(new client_1.Prisma.Decimal(obj).toString());
            }
            catch {
                return value;
            }
        }
        const entries = Object.entries(obj);
        return Object.fromEntries(entries.map(([key, item]) => [key, serializePrismaTypes(item)]));
    }
    return value;
}
//# sourceMappingURL=bigint-serializer.interceptor.js.map