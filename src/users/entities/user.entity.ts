import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;  // Novo campo para o e-mail

  @Column({ type: 'int', default: 0 })
  role: number;  // 0 = usuário normal, 1 = administrador, 2 = superusuário

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @OneToMany(() => Auth, (auth) => auth.user)
  auths: Auth[];

  // Método para verificar se o usuário é superusuário
  isSuperUser(): boolean {
    return this.role === 2;
  }

  // Método para verificar se o usuário é administrador
  isAdmin(): boolean {
    return this.role === 1;
  }

  // Método para verificar se o usuário é normal
  isNormalUser(): boolean {
    return this.role === 0;
  }
}
