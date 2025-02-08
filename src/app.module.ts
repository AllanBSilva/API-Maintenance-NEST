import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipamentosModule } from './equipments/equipment.module';
import { ManutencaoModule } from './maintenance/maintenance.module';
import { Equipamento } from './equipments/entities/equipamento.entity';
import { Manutencao } from './maintenance/entities/manutencao.entity';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { Auth } from './auth/entities/auth.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'manutencao_db', 
      entities: [Equipamento, Manutencao, User, Auth],
      synchronize: true,
    }),
    EquipamentosModule,
    ManutencaoModule,
    UsersModule,
    AuthModule,
    JwtModule.register({ secret: 'secretKey', signOptions: { expiresIn: '1h' } }),

  ],
  controllers: [AppController],
})
export class AppModule { }
