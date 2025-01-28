import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateManutencaoDto {
  @ApiPropertyOptional({
    description: 'Tipo da manutenção (exemplo: corretiva, preventiva, etc.)',
    example: 'Corretiva',
  })
  @IsOptional()
  @IsString()
  tipoManutencao?: string;

  @ApiPropertyOptional({
    description: 'Descrição da ocorrência relacionada ao problema',
    example: 'Verificação de sistema',
  })
  @IsOptional()
  @IsString()
  ocorrencia?: string;

  @ApiPropertyOptional({
    description: 'Causa do problema identificado',
    example: 'Problema de software',
  })
  @IsOptional()
  @IsString()
  causa?: string;

  @ApiPropertyOptional({
    description: 'Solução aplicada para resolver o problema',
    example: 'Atualização do sistema',
  })
  @IsOptional()
  @IsString()
  solucao?: string;

  @ApiPropertyOptional({
    description: 'Data de entrada do equipamento para manutenção',
    example: '2025-01-23',
  })
  @IsOptional()
  @IsDateString()
  dataEntrada?: string;

  @ApiPropertyOptional({
    description: 'Data de solução da manutenção',
    example: '2025-01-24',
  })
  @IsOptional()
  @IsDateString()
  dataSolucao?: string;

  @ApiPropertyOptional({
    description: 'Nome do técnico responsável pela execução da manutenção',
    example: 'Carlos Silva',
  })
  @IsOptional()
  @IsString()
  tecnicoExecutor?: string;
}
