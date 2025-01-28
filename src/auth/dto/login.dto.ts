import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  codigoEquipamento: string;  // Chave única ou código do equipamento

  @ApiProperty()
  senha: string;  // Senha do equipamento (caso tenha essa validação)
}
