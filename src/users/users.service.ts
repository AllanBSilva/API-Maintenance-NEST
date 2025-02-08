import { Injectable, ConflictException, NotFoundException, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';  // Importando o DTO
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, role, email } = createUserDto;

    const existingUser = await this.findByName(username);
    if (existingUser) {
      throw new ConflictException('Usuário já existe');
    }

    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('Email já está em uso');
    }

    const newUser = this.userRepository.create({
      username,
      password,
      role: role ?? 0,  // Se o role não for fornecido, o valor padrão será 0 (normal)
      email,
    });

    await this.userRepository.save(newUser);
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByName(name: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username: name } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findWithFilters(filters: any): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        if (typeof value === 'string') {
          queryBuilder.andWhere(`user.${key} LIKE :${key}`, { [key]: `%${value}%` });
        } else {
          queryBuilder.andWhere(`user.${key} = :${key}`, { [key]: value });
        }
      }
    }
    return queryBuilder.getMany();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { username, password, email, role } = updateUserDto;
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role !== undefined) user.role = role;

    await this.userRepository.save(user);

    return user;
  }

  async deleteUser(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return null;
    }

    await this.userRepository.remove(user);
    return user;
  }

  generatePasswordRecoveryToken(user: User): string {
    const payload = { email: user.email };
    return jwt.sign(payload, 'secretKey', { expiresIn: '1h' });
  }

  async sendPasswordRecoveryEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const token = this.generatePasswordRecoveryToken(user);
    await this.emailService.sendRecoveryEmail(user.email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<User | null> {
    try {
      const decoded: any = jwt.verify(token, 'secretKey');
      const email = decoded.email;
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new NotFoundException('Token inválido ou expirado');
    }
  }
}
