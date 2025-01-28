import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule'; // Importando a funcionalidade de agendamento de tarefas

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  // Método de login
  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const payload = { username: user.username, sub: user.id.toString() };

    // Gera o token JWT com a expiração de 1 hora
    const access_token = this.jwtService.sign(payload, {
      secret: 'secretKey',
      expiresIn: '1h',
      algorithm: 'HS256',
    });

    // Salva o token gerado no banco de dados
    const auth = new Auth();
    auth.token = access_token;
    auth.user = user; // Relacionando o token com o usuário autenticado
    auth.active = true; // Marque o token como ativo

    // Salva o token na tabela 'auth'
    await this.authRepository.save(auth);

    return {
      access_token,
    };
  }

// Método para excluir tokens expirados (pode ser chamado periodicamente)
@Cron(CronExpression.EVERY_HOUR)  // Verifica a cada hora
async removeExpiredTokens() {
  const currentDate = new Date();
  const expiredTokens = await this.authRepository.find();

  // Usar for...of para lidar com async/await corretamente
  const removalPromises = expiredTokens.map(async (auth) => {
    const tokenExpirationTime = this.jwtService.decode(auth.token)['exp'] * 1000; // Converte expiração para milissegundos
    if (tokenExpirationTime < currentDate.getTime()) {
      // Se o token estiver expirado, vamos desativá-lo
      await this.authRepository.remove(auth); // Remove o token expirado
    }
  });

  // Espera todas as promessas de remoção serem concluídas
  await Promise.all(removalPromises);

  console.log('Tokens expirados removidos');
}
}
