// update-manutencao.dto.ts
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateManutencaoDto {
  @IsOptional()
  @IsString()
  tipoManutencao?: string;

  @IsOptional()
  @IsString()
  ocorrencia?: string;

  @IsOptional()
  @IsString()
  causa?: string;

  @IsOptional()
  @IsString()
  solucao?: string;

  @IsOptional()
  @IsDateString()
  dataEntrada?: string;

  @IsOptional()
  @IsDateString()
  dataSolucao?: string;

  @IsOptional()
  @IsString()
  tecnicoExecutor?: string;
}
