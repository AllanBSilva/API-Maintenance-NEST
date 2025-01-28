import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Rota para criar um usuário
  @Post('create')
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('role') _role?: number,  // Adicionando o role como opcional
  ) {
    return this.usersService.createUser(username, password, _role);
  }
}
