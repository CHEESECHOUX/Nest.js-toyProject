import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { HttpLoggingInterceptor } from './common/http-logging.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new AllExceptionsFilter());

    app.useGlobalInterceptors(new HttpLoggingInterceptor());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            transformOptions: { enableImplicitConversion: true },
            disableErrorMessages: false,
        }),
    );
    await app.listen(3000);
}
bootstrap();
