import { Injectable, ConflictException } from '@nestjs/common';  // Adicionando a exceção de conflito
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';  // Importando a entidade de usuário

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,  // Injetando o repositório de usuários
  ) {}

  // Método para encontrar o usuário pelo nome de usuário
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });  // Busca o usuário com base no nome
  }

// Método para criar um novo usuário
async createUser(username: string, password: string, role?: number): Promise<User> {
  // Verificar se já existe um usuário com o mesmo nome de usuário
  const existingUser = await this.findByUsername(username);
  if (existingUser) {
    throw new ConflictException('Usuário já existe');  // Se o usuário já existir, lança um erro
  }

  // Se o role não for passado, define o valor padrão como 0 (usuário normal)
  const newUserData = {
    username,
    password,
    role: role ?? 0,  // Se o role não for passado, o valor padrão será 0 (normal)
  };

  // Criar um novo usuário
  const newUser = this.userRepository.create(newUserData);

  // O hash da senha será feito automaticamente pela função `BeforeInsert` na entidade
  await this.userRepository.save(newUser);  // Salva o novo usuário no banco de dados

  return newUser;
}
}
