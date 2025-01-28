import { Injectable, ConflictException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';  // Importando o DTO

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Método para encontrar o usuário pelo nome de usuário
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  // Método para criar um novo usuário
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role } = createUserDto;

    // Verificar se o nome de usuário já existe
    const existingUser = await this.findByUsername(username);
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
}
