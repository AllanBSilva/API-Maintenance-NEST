import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS para permitir Authorization headers
  app.enableCors({
    origin: '*', // Ou defina o domínio exato, se necessário
    allowedHeaders: 'Authorization, Content-Type', // Permite o cabeçalho Authorization
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Manutenção de Equipamentos')
    .setDescription('Documentação da API para gerenciamento de equipamentos e manutenções.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
