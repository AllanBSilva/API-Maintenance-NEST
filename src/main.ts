import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS para permitir Authorization headers
  app.enableCors({
    origin: 'http://localhost:3001', // Permite requisições apenas de localhost:3001 (frontend React)
    allowedHeaders: 'Authorization, Content-Type', // Permite cabeçalhos Authorization e Content-Type
    methods: 'GET, POST, PUT, DELETE, PATCH', // Métodos permitidos
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
