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
exports.SessionsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_session_dto_1 = require("./dto/create-session.dto");
const query_session_dto_1 = require("./dto/query-session.dto");
const update_session_dto_1 = require("./dto/update-session.dto");
const sessions_service_1 = require("./sessions.service");
let SessionsController = class SessionsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(dto, req.user?.id);
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto, req) {
        return this.service.update(id, dto, req.user?.id);
    }
    remove(id, req) {
        return this.service.remove(id, req.user?.id);
    }
};
exports.SessionsController = SessionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create session' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Session created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_session_dto_1.CreateSessionDto, Object]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get sessions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of sessions' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_session_dto_1.QuerySessionDto]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get one session' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update session' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_session_dto_1.UpdateSessionDto, Object]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete session (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SessionsController.prototype, "remove", null);
exports.SessionsController = SessionsController = __decorate([
    (0, swagger_1.ApiTags)('Sessions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('sessions'),
    __metadata("design:paramtypes", [sessions_service_1.SessionsService])
], SessionsController);
//# sourceMappingURL=sessions.controller.js.map