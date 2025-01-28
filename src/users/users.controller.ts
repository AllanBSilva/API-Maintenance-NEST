import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Rota para criar um usuário
  @Post('create')
  @ApiOperation({ summary: 'Cria um novo usuário no sistema' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: CreateUserDto })
  @ApiBody({ type: CreateUserDto }) // DTO de criação de usuário
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
