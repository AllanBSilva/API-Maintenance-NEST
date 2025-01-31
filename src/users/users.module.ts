import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), 
  JwtModule.register({ secret: 'secretKey', signOptions: { expiresIn: '1h' } })
],
  providers: [UsersService, AuthGuard, EmailService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
