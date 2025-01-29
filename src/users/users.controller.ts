import { Controller, Post, Body, Delete, Param, Put, Get, ConflictException, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Rota para criar um usuário
  @Post('create')
  @ApiOperation({ summary: 'Cria um novo usuário no sistema' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: CreateUserDto })
  @ApiBody({ type: CreateUserDto }) // DTO de criação de usuário
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      throw new ConflictException('Usuário já existe');
    }
  }

  // Rota para buscar todos os usuários
  @Get()
  @ApiOperation({ summary: 'Busca todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [User] })
  @ApiResponse({ status: 404, description: 'Nenhum usuário encontrado' })
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    if (!users.length) {
      throw new NotFoundException('Nenhum usuário encontrado');
    }
    return users;
  }

  // Rota para buscar um usuário pelo nome (username)
  @Get(':name')
  @ApiOperation({ summary: 'Busca um usuário pelo nome de usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findByName(@Param('name') name: string): Promise<User> {
    const user = await this.usersService.findByName(name);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  // Rota para atualizar os dados de um usuário
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiBody({ type: UpdateUserDto })  // DTO de atualização de usuário
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return updatedUser;
  }

  // Rota para excluir um usuário
  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    const user = await this.usersService.deleteUser(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return { message: 'Usuário deletado com sucesso' };
  }
}
