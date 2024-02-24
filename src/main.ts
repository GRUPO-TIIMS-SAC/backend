import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  console.log(join(__dirname, '..', 'uploads', 'documents_upload'));

  app.use('/documents_upload', express.static(join(__dirname, '..', 'uploads', 'documents_upload')));
  app.use('/images_upload', express.static(join(__dirname, '..', 'uploads', 'images_upload')));

  app.useStaticAssets(join(__dirname, 'view'));
  app.setViewEngine('ejs');

  const options = new DocumentBuilder()
    .setTitle('TIIMS Auth Methods')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(4000);
}
bootstrap();
