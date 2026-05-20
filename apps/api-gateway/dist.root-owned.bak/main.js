"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const bigint_serializer_interceptor_1 = require("./common/interceptors/bigint-serializer.interceptor");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const sentry_1 = require("./common/sentry");
const vault_1 = require("./config/vault");
async function bootstrap() {
    await (0, vault_1.loadVaultSecrets)();
    (0, sentry_1.initSentry)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: configService.get('NODE_ENV') === 'production' ? undefined : false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }));
    const corsOriginEnv = configService.get('CORS_ORIGIN', '');
    const explicitOrigins = corsOriginEnv
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
    app.enableCors({
        origin: (origin, cb) => {
            if (!origin)
                return cb(null, true);
            if (explicitOrigins.length > 0 && explicitOrigins.includes(origin)) {
                return cb(null, true);
            }
            const devAllowed = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin);
            const prodAllowed = /^https?:\/\/(althea|erp)\.fr-labs\.my\.id(:\d+)?$/.test(origin);
            if (devAllowed || prodAllowed)
                return cb(null, true);
            return cb(new Error(`CORS: origin ${origin} not allowed`), false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new bigint_serializer_interceptor_1.BigIntSerializerInterceptor());
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Sentient Factory API')
        .setDescription('The API Gateway for Sentient Factory')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('PORT', 3103);
    await app.listen(port);
    console.log(`API Gateway running on port ${port}`);
    console.log(`Swagger Docs available at http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map