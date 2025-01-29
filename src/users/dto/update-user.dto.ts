import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Nome de usuário', example: 'updateduser', required: false })
  username?: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'newpassword', required: false })
  password?: string;

  @ApiProperty({
    description: 'Papel do usuário. 0 = Usuário normal, 1 = Administrador, 2 = Superusuário',
    example: 1,
    required: false,
  })
  role?: number;
}
