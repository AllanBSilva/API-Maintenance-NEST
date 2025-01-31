import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { UsersModule } from 'src/users/users.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, User]),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    ScheduleModule.forRoot(),
    UsersModule,
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
})
export class AuthModule { }
