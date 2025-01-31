import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Manutencao } from '../../maintenance/entities/manutencao.entity';

@Entity()
export class Equipamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numeroSerie: string;

  @Column()
  patrimonio: string;

  @Column()
  nome: string;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column()
  setor: string;

  @OneToMany(() => Manutencao, (manutencao) => manutencao.equipamento)
  manutencao: Manutencao[];

}
