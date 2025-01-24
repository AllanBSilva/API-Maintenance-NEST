import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';

export class CreateManutencaoDto {
  @IsString()
  @IsNotEmpty()
  tipoManutencao: string;

  @IsString()
  @IsNotEmpty()
  ocorrencia: string;

  @IsString()
  @IsNotEmpty()
  causa: string;

  @IsString()
  solucao: string;

  @IsDate()
  @IsNotEmpty()
  dataEntrada: string;

  @IsDate()
  dataSolucao: string;

  @IsString()
  tecnicoExecutor: string;

  @IsNumber()
  @IsNotEmpty()
  equipamentoId: number;
}
