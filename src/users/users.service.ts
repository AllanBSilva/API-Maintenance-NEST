import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';  // Importando o DTO
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Método para criar um novo usuário
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;

    // Verificar se o nome de usuário já existe
    const existingUser = await this.findByName(username);
    if (existingUser) {
      throw new ConflictException('Usuário já existe');
    }

    // Criação do novo usuário
    const newUser = this.userRepository.create({
      username,
      password,
      role: role ?? 0,  // Se o role não for fornecido, o valor padrão será 0 (normal)
    });

    // Salvar o novo usuário
    await this.userRepository.save(newUser);

    return newUser;
  }
   // Método para buscar todos os usuários
   async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Método para buscar usuário pelo nome
  async findByName(name: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username: name } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Método para atualizar os dados do usuário
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { username, password, role } = updateUserDto;

    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Se a senha for alterada, chama o hashPassword para gerar um hash da nova senha
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Atualizando o nome de usuário e o papel (role), se fornecidos
    if (username) user.username = username;
    if (role !== undefined) user.role = role;

    // Salvando as alterações no banco de dados
    await this.userRepository.save(user);

    return user;
  }

  // Método para deletar um usuário
  async deleteUser(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      return null; // Retorna null se o usuário não for encontrado
    }
    
    await this.userRepository.remove(user); // Deleta o usuário
    return user; // Retorna o usuário deletado
  }
}
