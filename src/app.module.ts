import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipamentosModule } from './equipments/equipment.module';
import { ManutencaoModule } from './maintenance/maintenance.module';
import { Equipamento } from './equipments/entities/equipamento.entity';  // Importe a entidade Equipamento
import { Manutencao } from './maintenance/entities/manutencao.entity';  // Importe a entidade Manutencao
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';  // Adicionando a entidade User
import { AuthModule } from './auth/auth.module';
import { Auth } from './auth/entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'manutencao_db',  // Nome do banco de dados
      entities: [Equipamento, Manutencao, User, Auth],  // Incluindo a entidade User
      synchronize: true,  // Desabilitando a sincronização automática (para evitar a perda de dados)
    }),
    EquipamentosModule,
    ManutencaoModule,
    UsersModule,
    AuthModule,
    JwtModule.register({ secret: 'secretKey', signOptions: { expiresIn: '1h' } }),  // Certifique-se de que o JwtModule está registrado

  ],
  controllers: [AppController],
})
export class AppModule {}
