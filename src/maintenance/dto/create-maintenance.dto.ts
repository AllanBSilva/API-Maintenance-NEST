import { IsString, IsNumber, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManutencaoDto {
  @ApiProperty({
    description: 'Tipo da manutenção (preventiva, corretiva, etc.)',
    example: 'Corretiva',
  })
  @IsString()
  @IsNotEmpty()
  tipoManutencao: string;

  @ApiProperty({
    description: 'Descrição da ocorrência',
    example: 'Verificação de sistema',
  })
  @IsString()
  @IsNotEmpty()
  ocorrencia: string;

  @ApiProperty({
    description: 'Causa do problema identificado',
    example: 'Problema de software',
  })
  @IsString()
  @IsNotEmpty()
  causa: string;

  @ApiProperty({
    description: 'Solução aplicada',
    example: 'Atualização do sistema',
    required: false,
  })
  @IsOptional()
  @IsString()
  solucao?: string;

  @ApiProperty({
    description: 'Data de entrada do equipamento para manutenção',
    example: '2025-01-23',
  })
  @IsDateString()
  @IsNotEmpty()
  dataEntrada: string;

  @ApiProperty({
    description: 'Data de solução da manutenção',
    example: '2025-01-24',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dataSolucao?: string;

  @ApiProperty({
    description: 'Nome do técnico responsável pela execução',
    example: 'Carlos Silva',
  })
  @IsString()
  @IsNotEmpty()
  tecnicoExecutor: string;

  @ApiProperty({
    description: 'ID do equipamento associado à manutenção',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  equipamentoId: number;
}
