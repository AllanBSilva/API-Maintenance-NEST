import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity'; // Importando a entidade User

@Entity('auth')
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  token: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })  // Criando o campo createdAt
  createdAt: Date;

  // Relação com a entidade User
  @ManyToOne(() => User, (user) => user.auths, { eager: true })
  @JoinColumn({ name: 'user_id' })  // Relaciona com a coluna 'user_id'
  user: User;
}
