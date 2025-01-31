import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome de usuário', example: 'updateduser', required: false })
  username?: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'newpassword', required: false })
  password?: string;

  @ApiProperty({ description: 'Email do usuário', example: 'newuser@example.com', required: false })
  email?: string;  // Novo campo para o e-mail

  @ApiProperty({
    description: 'Papel do usuário. 0 = Usuário normal, 1 = Administrador, 2 = Superusuário',
    example: 1,
    required: false,
  })
  role?: number;
}
