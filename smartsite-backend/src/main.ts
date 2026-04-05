import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { PROGRESS_UPLOAD_DIR } from './jobs/multer-progress.config';

async function bootstrap() {
  const uploadsRoot = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsRoot)) {
    mkdirSync(uploadsRoot, { recursive: true });
  }
  if (!existsSync(PROGRESS_UPLOAD_DIR)) {
    mkdirSync(PROGRESS_UPLOAD_DIR, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(uploadsRoot, { prefix: '/uploads/' });

  // ✅ Active CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3200);
}
bootstrap();
