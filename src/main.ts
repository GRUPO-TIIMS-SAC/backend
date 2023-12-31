import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app= await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
  .setTitle('TIIMS Auth Methods')
  .setVersion('0.0.1')
  .build();

  const document = SwaggerModule.createDocument(app, options);
  
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(4000);
}
bootstrap();
