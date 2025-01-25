import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipamentosModule } from './equipamentos/equipamentos.module';
import { ManutencaoModule } from './manutencao/manutencao.module';
import { Equipamento } from './equipamentos/entities/equipamento.entity';  // Importe a entidade Equipamento
import { Manutencao } from './manutencao/entities/manutencao.entity';  // Importe a entidade Manutencao
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'manutencao_db', 
      entities: [Equipamento, Manutencao], 
      synchronize: true, 
    }),
    EquipamentosModule,
    ManutencaoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
