import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as process from 'process';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';

async function bootstrap() {
    const port = 3000;
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            transports: [
                new winston.transports.Console({
                    level: process.env.STAGE === 'prod' ? 'info' : 'debug',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        utilities.format.nestLike('LEECODER', { prettyPrint: true }),
                    ),
                }),
            ],
        }),
    });

    // Swagger
    const config = new DocumentBuilder()
        .setTitle('NestJS project')
        .setDescription('NestJS project API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const customOption: SwaggerCustomOptions = {
        swaggerOptions: {
            persistAuthorization: true,
        },
    };
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, customOption);

    // ValidationPipe 전역 적용
    app.useGlobalPipes(
        new ValidationPipe({
            // class-transformer 적용
            transform: true,
        }),
    );

    // Intercepter 전역 적용
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.listen(port);
    Logger.log(`STAGE: ${process.env.STAGE}`);
    Logger.log(`listening on port ${port}`);
}

bootstrap();
