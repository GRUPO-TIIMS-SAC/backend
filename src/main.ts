import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app= await NestFactory.create(AppModule);

  app.use('/documents_upload', express.static(join(__dirname, 'files','uploads', 'documents_upload')));
  app.use('/images_upload', express.static(join(__dirname, 'files','uploads', 'images_upload')));

  const options = new DocumentBuilder()
  .setTitle('TIIMS Auth Methods')
  .setVersion('0.0.1')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(4000);
}
bootstrap();
