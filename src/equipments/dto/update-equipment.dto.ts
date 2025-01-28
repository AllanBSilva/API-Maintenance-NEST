import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEquipamentoDto {
  @ApiPropertyOptional({
    description: 'Número de série do equipamento',
    example: 'ABC123456',
  })
  @IsOptional()
  @IsString()
  numeroSerie?: string;

  @ApiPropertyOptional({
    description: 'Número do patrimônio',
    example: 'PAT001',
  })
  @IsOptional()
  @IsString()
  patrimonio?: string;

  @ApiPropertyOptional({
    description: 'Nome do equipamento',
    example: 'Equipamento Atualizado',
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({
    description: 'Marca do equipamento',
    example: 'Marca A',
  })
  @IsOptional()
  @IsString()
  marca?: string;

  @ApiPropertyOptional({
    description: 'Modelo do equipamento',
    example: 'Modelo X',
  })
  @IsOptional()
  @IsString()
  modelo?: string;

  @ApiPropertyOptional({
    description: 'Setor onde o equipamento está alocado',
    example: 'Setor 1',
  })
  @IsOptional()
  @IsString()
  setor?: string;
}
