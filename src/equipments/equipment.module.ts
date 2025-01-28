import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipamento } from './entities/equipamento.entity';
import { EquipamentosService } from './equipment.service';
import { EquipamentoController } from './equipment.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Equipamento]),
    AuthModule,
    UsersModule,
    JwtModule.register({ secret: 'secretKey', signOptions: { expiresIn: '1h' } }),  // Certifique-se de registrar o JwtModule corretamente
  ],
  providers: [EquipamentosService],
  controllers: [EquipamentoController],
  exports: [EquipamentosService, TypeOrmModule],
})
export class EquipamentosModule {}
