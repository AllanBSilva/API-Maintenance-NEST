import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';  // Importando o AuthGuard
import { User } from 'src/users/entities/user.entity';  // Importando a entidade User
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';  // Importando a entidade Auth
import { UsersModule } from 'src/users/users.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, User]),  // Adicionando as entidades necessárias
    JwtModule.register({
      secret: 'secretKey',  // Aqui você pode configurar sua chave secreta
      signOptions: { expiresIn: '1h' },  // Definindo a expiração do token
    }),
    ScheduleModule.forRoot(), // Registrando o módulo de agendamento
    UsersModule,
  ],
  providers: [AuthService, AuthGuard],  // Adicionando AuthService e AuthGuard aos providers
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],  // Expondo AuthService e AuthGuard para outros módulos
})
export class AuthModule {}
