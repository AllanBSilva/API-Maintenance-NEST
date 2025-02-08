import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) { }

  // Método de login
  async login(username: string, password: string) {
    const user = await this.usersService.findByName(username);
    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const payload = { username: user.username, sub: user.id.toString() };

    const access_token = this.jwtService.sign(payload, {
      secret: 'secretKey',
      expiresIn: '1h',
      algorithm: 'HS256',
    });

    const auth = new Auth();
    auth.token = access_token;
    auth.user = user;
    auth.active = true;

    await this.authRepository.save(auth);

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role, 
      },
    };
  }

  @Cron(CronExpression.EVERY_HOUR)
  async removeExpiredTokens() {
    const currentDate = new Date();
    const expiredTokens = await this.authRepository.find();

    const removalPromises = expiredTokens.map(async (auth) => {
      const tokenExpirationTime = this.jwtService.decode(auth.token)['exp'] * 1000;
      if (tokenExpirationTime < currentDate.getTime()) {
        await this.authRepository.remove(auth);
      }
    });

    await Promise.all(removalPromises);

  }
}
