"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bigint_serializer_interceptor_1 = require("./common/interceptors/bigint-serializer.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: configService.get('CORS_ORIGIN', '*'),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalInterceptors(new bigint_serializer_interceptor_1.BigIntSerializerInterceptor());
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