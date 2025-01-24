import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipamento } from './entities/equipamento.entity';
import { EquipamentosService } from './equipamentos.service';
import { EquipamentoController } from './equipamentos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Equipamento])],
  providers: [EquipamentosService],
  controllers: [EquipamentoController],
  exports: [EquipamentosService, TypeOrmModule],
})
export class EquipamentosModule {}
