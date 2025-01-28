import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Equipamento } from '../../equipments/entities/equipamento.entity';

@Entity()
export class Manutencao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numeroManutencao: string;

  @Column()
  tipoManutencao: string;

  @Column('text')
  ocorrencia: string;

  @Column('text')
  causa: string;

  @Column('text')
  solucao: string;

  @Column('text')
  dataEntrada: string;

  @Column('text')
  dataSolucao: string;

  @Column()
  tecnicoExecutor: string;

  @ManyToOne(() => Equipamento, equipamento => equipamento.manutencao)
  equipamento: Equipamento;

}


