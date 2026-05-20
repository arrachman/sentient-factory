"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    logger = new common_1.Logger(AllExceptionsFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let error = 'Internal Server Error';
        let message = 'An unexpected error occurred';
        let details = undefined;
        if (exception instanceof common_1.HttpException) {
            statusCode = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            }
            else if (typeof res === 'object' && res !== null) {
                const obj = res;
                message = obj.message || message;
                error = obj.error || common_1.HttpStatus[statusCode] || error;
                const { message: _m, error: _e, statusCode: _s, ...rest } = obj;
                if (Object.keys(rest).length > 0)
                    details = rest;
            }
        }
        else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            const prismaErr = this.mapPrismaError(exception);
            statusCode = prismaErr.statusCode;
            error = prismaErr.error;
            message = prismaErr.message;
            details = { prismaCode: exception.code, meta: exception.meta };
        }
        else if (exception instanceof client_1.Prisma.PrismaClientValidationError) {
            statusCode = common_1.HttpStatus.BAD_REQUEST;
            error = 'Validation Error';
            message = 'Invalid query parameters';
        }
        else if (exception instanceof Error) {
            message = exception.message;
        }
        const body = {
            success: false,
            statusCode,
            error,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
            ...(details ? { details } : {}),
        };
        if (statusCode >= 500) {
            this.logger.error(`[${request.method} ${request.url}] ${statusCode} ${message}`, exception instanceof Error ? exception.stack : undefined);
        }
        else {
            this.logger.warn(`[${request.method} ${request.url}] ${statusCode} ${message}`);
        }
        response.status(statusCode).json(body);
    }
    mapPrismaError(err) {
        switch (err.code) {
            case 'P2002':
                return {
                    statusCode: common_1.HttpStatus.CONFLICT,
                    error: 'Conflict',
                    message: `Unique constraint violated: ${err.meta?.target?.join(', ') || 'field'}`,
                };
            case 'P2025':
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: 'Record not found',
                };
            case 'P2003':
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    error: 'Bad Request',
                    message: `Foreign key constraint violated: ${err.meta?.field_name || 'reference'}`,
                };
            case 'P2014':
                return {
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    error: 'Bad Request',
                    message: 'Required relation violated',
                };
            default:
                return {
                    statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Database Error',
                    message: `Prisma error ${err.code}`,
                };
        }
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map