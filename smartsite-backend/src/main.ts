import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Origines locales (Next.js : 3000 par défaut ; 3001 si port personnalisé)
  const devOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];
  const corsEnv = process.env.CORS_ORIGINS;
  const extra = corsEnv
    ? corsEnv.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  app.enableCors({
    origin: [...new Set([...devOrigins, ...extra])],
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
