import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { HttpLoggingInterceptor } from './common/http-logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new AllExceptionsFilter());

    app.useGlobalInterceptors(new HttpLoggingInterceptor());

    await app.listen(3000);
}
bootstrap();
