import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipamento } from './entities/equipamento.entity';
import { CreateEquipamentoDto } from './dto/create-equipment.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateEquipamentoDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipamentosService {
    constructor(
        @InjectRepository(Equipamento)
        private readonly equipamentoRepository: Repository<Equipamento>,
      ) {}

    async findAll(): Promise<Equipamento[]> {
    return this.equipamentoRepository.find();
    }

    async findWithFilters(filters: any): Promise<Equipamento[]> {
        const queryBuilder = this.equipamentoRepository.createQueryBuilder('equipamento');
      
        for (const [key, value] of Object.entries(filters)) {
          if (value) {
            // Se o valor for string, faz uma comparação com LIKE
            if (typeof value === 'string') {
              queryBuilder.andWhere(`equipamento.${key} LIKE :${key}`, { [key]: `%${value}%` });
            } else {
              // Caso contrário, faz uma comparação exata
              queryBuilder.andWhere(`equipamento.${key} = :${key}`, { [key]: value });
            }
          }
        }
        const result = await queryBuilder.getMany();
      
        return result;
      }

    async findOne(id: number): Promise<Equipamento | null>{
    const equipamento = await this.equipamentoRepository.findOne({
        where: { id },
    });
    if (!equipamento) {
        throw new NotFoundException(`Equipamento com id ${id} não encontrado`);
    }
    return equipamento;
    }

    async findByNumeroSerieOrPatrimonio(
      numeroSerie: string,
      patrimonio: string,
    ): Promise<Equipamento | null> {
      return this.equipamentoRepository.findOne({
        where: [{ numeroSerie }, { patrimonio }],
      });
    }

    async create(createEquipamentoDto: CreateEquipamentoDto) {
    const equipamento = this.equipamentoRepository.create(createEquipamentoDto);
    return this.equipamentoRepository.save(equipamento);
    }

    async update(id: number, updateEquipamentoDto: UpdateEquipamentoDto): Promise<Equipamento> {
        const equipamento = await this.equipamentoRepository.findOne({ where: { id } });
    
        if (!equipamento) {
          throw new NotFoundException(`Equipamento com ID ${id} não encontrado`);
        }
    
        Object.assign(equipamento, updateEquipamentoDto);
    
        return this.equipamentoRepository.save(equipamento);
      }

      async remove(id: number): Promise<void> {
        const equipamento = await this.equipamentoRepository.findOne({ where: { id } });
    
        if (!equipamento) {
          throw new NotFoundException(`Equipamento com ID ${id} não encontrado`);
        }
    
        await this.equipamentoRepository.remove(equipamento);
      }

}
