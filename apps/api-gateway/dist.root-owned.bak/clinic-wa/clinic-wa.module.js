"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicWaModule = exports.WA_PROVIDER = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const prisma_module_1 = require("../prisma/prisma.module");
const clinic_wa_controller_1 = require("./clinic-wa.controller");
const clinic_wa_service_1 = require("./clinic-wa.service");
const fonnte_provider_1 = require("./providers/fonnte.provider");
const mock_provider_1 = require("./providers/mock.provider");
const wa_tokens_1 = require("./wa.tokens");
Object.defineProperty(exports, "WA_PROVIDER", { enumerable: true, get: function () { return wa_tokens_1.WA_PROVIDER; } });
const wa_queue_constants_1 = require("./queue/wa-queue.constants");
const wa_queue_processor_1 = require("./queue/wa-queue.processor");
function parseRedisUrl(url) {
    if (!url)
        return { host: 'localhost', port: 6379 };
    try {
        const u = new URL(url);
        return {
            host: u.hostname || 'localhost',
            port: Number(u.port || 6379),
            password: u.password || undefined,
            username: u.username || undefined,
        };
    }
    catch {
        return { host: 'localhost', port: 6379 };
    }
}
let ClinicWaModule = class ClinicWaModule {
};
exports.ClinicWaModule = ClinicWaModule;
exports.ClinicWaModule = ClinicWaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            prisma_module_1.PrismaModule,
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    connection: parseRedisUrl(config.get('REDIS_URL')),
                }),
                inject: [config_1.ConfigService],
            }),
            bullmq_1.BullModule.registerQueue({ name: wa_queue_constants_1.WA_QUEUE_NAME }),
        ],
        controllers: [clinic_wa_controller_1.ClinicWaController],
        providers: [
            mock_provider_1.MockWAProvider,
            fonnte_provider_1.FonnteProvider,
            {
                provide: wa_tokens_1.WA_PROVIDER,
                useFactory: (config, mock, fonnte) => {
                    const token = config.get('FONNTE_API_TOKEN');
                    return token ? fonnte : mock;
                },
                inject: [config_1.ConfigService, mock_provider_1.MockWAProvider, fonnte_provider_1.FonnteProvider],
            },
            clinic_wa_service_1.ClinicWaService,
            wa_queue_processor_1.WaQueueProcessor,
        ],
        exports: [wa_tokens_1.WA_PROVIDER, clinic_wa_service_1.ClinicWaService],
    })
], ClinicWaModule);
//# sourceMappingURL=clinic-wa.module.js.map