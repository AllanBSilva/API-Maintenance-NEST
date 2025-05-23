import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome de usuário único para o usuário', example: 'testuser' })
  username: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'testpassword' })
  password: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'user@example.com',
    required: true,
  })
  email: string;


  @ApiProperty({
    description: 'Papel do usuário. 0 = Usuário normal, 1 = Administrador',
    example: 0,
    required: false,
    default: 0,
  })
  role?: number;  // Papel do usuário (0 = normal, 1 = admin)
}
