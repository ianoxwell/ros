import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomLogger } from '@services/logger.service';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger()
  });
  app.enableCors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || [] }); // TODO lock down the cors locations
  app.use(compression());
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Recipe Ordering Simplified')
    .setDescription('Collection of API endpoints for hobby projects')
    .setVersion('1.0.0')
    .addTag('reference')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Enter JWT token bearer', in: 'header' }, 'JWT-auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
