import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manutencao } from './entities/manutencao.entity';
import { ManutencaoService } from './maintenance.service';
import { ManutencaoController } from './maintenance.controller';
import { EquipamentosModule } from '../equipments/equipment.module';  
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Manutencao]), 
    AuthModule,
    UsersModule,
    JwtModule.register({ secret: 'secretKey', signOptions: { expiresIn: '1h' } }), 
    EquipamentosModule,
  ],
  providers: [ManutencaoService],
  controllers: [ManutencaoController],
})
export class ManutencaoModule {}
