import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manutencao } from './entities/manutencao.entity';
import { ManutencaoService } from './manutencao.service';
import { ManutencaoController } from './manutencao.controller';
import { EquipamentosModule } from '../equipamentos/equipamentos.module';  

@Module({
  imports: [
    TypeOrmModule.forFeature([Manutencao]), // Registra a entidade Manutencao
    EquipamentosModule,  // Importando EquipamentosModule
  ],
  providers: [ManutencaoService],
  controllers: [ManutencaoController],
})
export class ManutencaoModule {}
