import { NestFactory } from '@nestjs/core';
import { CoreContainer } from 'infrastructure/di/containers/core/container';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'infrastructure/config/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(CoreContainer);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true, // optional: transforms payloads to DTO class instances
        }),
    );
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', '*');

        if (req.method === 'OPTIONS') {
            return res.sendStatus(204);
        }

        next();
    });
    app.enableCors({
        origin: true,                // ✅ allow any origin
        methods: '*',                // ✅ allow all methods
        allowedHeaders: '*',         // ✅ allow all headers
        credentials: false,          // ⚠️ MUST be false with origin:true
        optionsSuccessStatus: 204,   // preflight OK
    });
    app.useStaticAssets(join(process.cwd(), 'storage'), {
        prefix: '/storage/',
    });
    console.log('port: ', config.port);
    await app.listen(config.port, '0.0.0.0');
}

bootstrap();
