import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Nome de usuário do usuário', example: 'testuser' })
  username: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'testpassword', type: String })
  password: string;
}