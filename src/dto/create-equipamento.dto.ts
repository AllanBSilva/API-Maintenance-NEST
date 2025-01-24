import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateEquipamentoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsString()
  @IsNotEmpty()
  setor: string;

  @IsNumber()
  @IsNotEmpty()
  patrimonio: string;

  @IsNumber()
  @IsNotEmpty()
  numeroSerie: string;
}
