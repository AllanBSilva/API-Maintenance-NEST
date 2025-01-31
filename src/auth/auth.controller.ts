import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Realiza o login de um usuário e retorna o token JWT' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido', type: Object })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }
}
