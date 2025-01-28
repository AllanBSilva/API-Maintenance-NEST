import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipamentoDto {
  @ApiProperty({
    description: 'Nome do equipamento',
    example: 'Equipamento Teste',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'Marca do equipamento',
    example: 'Marca A',
  })
  @IsString()
  @IsNotEmpty()
  marca: string;

  @ApiProperty({
    description: 'Modelo do equipamento',
    example: 'Modelo X',
  })
  @IsString()
  @IsNotEmpty()
  modelo: string;

  @ApiProperty({
    description: 'Setor onde o equipamento está alocado',
    example: 'Setor 1',
  })
  @IsString()
  @IsNotEmpty()
  setor: string;

  @ApiProperty({
    description: 'Número do patrimônio',
    example: 'PAT002',
  })
  @IsString()
  @IsNotEmpty()
  patrimonio: string;

  @ApiProperty({
    description: 'Número de série do equipamento',
    example: 'ABC123456',
  })
  @IsString()
  @IsNotEmpty()
  numeroSerie: string;
}
