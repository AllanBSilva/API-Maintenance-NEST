import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Manutencao } from '../../manutencao/entities/manutencao.entity'; // Corrigido import

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
