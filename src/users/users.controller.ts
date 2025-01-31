import { Controller, Post, Body, Delete, Param, Put, Get, ConflictException, NotFoundException, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('create')
  @ApiOperation({ summary: 'Cria um novo usuário no sistema' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: CreateUserDto })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.createUser(createUserDto);
    } catch (error) {
      throw new ConflictException('Usuário já existe');
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Busca todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários'})
  @ApiResponse({ status: 404, description: 'Nenhum usuário encontrado' })
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    if (!users.length) {
      throw new NotFoundException('Nenhum usuário encontrado');
    }
    return users;
  }

  @Get(':name')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Busca um usuário pelo nome de usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado'})
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findByName(@Param('name') name: string): Promise<User> {
    const user = await this.usersService.findByName(name);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Atualiza os dados de um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado'})
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiBody({ type: UpdateUserDto }) 
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
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

  @Post('recover-password')
  @ApiOperation({ summary: 'Envia um e-mail de recuperação de senha' })
  @ApiResponse({ status: 200, description: 'E-mail de recuperação enviado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async sendPasswordRecoveryEmail(@Body('email') email: string): Promise<{ message: string }> {
    try {
      await this.usersService.sendPasswordRecoveryEmail(email);
      return { message: 'E-mail enviado com sucesso' };
    } catch (error) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  @Patch('reset-password')
  @ApiOperation({ summary: 'Reseta a senha do usuário com o token' })
  @ApiResponse({ status: 200, description: 'Senha resetada com sucesso' })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;
    try {
      // Chama o serviço de reset de senha
      await this.usersService.resetPassword(token, newPassword);
      return { message: 'Senha resetada com sucesso' };
    } catch (error) {
      throw new NotFoundException('Token inválido ou expirado');
    }
  }
}
