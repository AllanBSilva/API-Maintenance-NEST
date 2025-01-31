import { ForbiddenException, Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];

    if (!authHeader) {
      throw new ForbiddenException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
      throw new ForbiddenException('Token not found');
    }

    try {
      // Verifique se o token tem o formato esperado
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new ForbiddenException('Invalid token format');
      }

      // Verificando o token
      const payload = this.jwtService.verify(token, { secret: 'secretKey', algorithms: ['HS256'] });

      // Verificando o conteúdo do payload
      if (!payload || !payload.sub) {
        throw new ForbiddenException('Token payload is invalid');
      }

      // Verifica se o usuário associado ao token existe
      const user = await this.userRepository.findOne({ where: { id: payload.sub.toString() } });

      if (!user) {
        throw new ForbiddenException('User not found');
      }

      // Atribuindo o usuário autenticado à requisição
      request.user = user;

      return true;
    } catch (error) {
      throw new ForbiddenException('Invalid token or user not found');
    }
  }
}
