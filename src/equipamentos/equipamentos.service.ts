import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipamento } from './entities/equipamento.entity';
import { Manutencao } from 'src/manutencao/entities/manutencao.entity';
import { CreateEquipamentoDto } from '../dto/create-equipamento.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateEquipamentoDto } from '../dto/update-equipamento.dto';

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
      
        // Adiciona condições de filtro para cada campo recebido
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

    async findOne(id: number): Promise<Equipamento> {
    const equipamento = await this.equipamentoRepository.findOne({
        where: { id },
    });
    if (!equipamento) {
        throw new NotFoundException(`Equipamento com id ${id} não encontrado`);
    }
    return equipamento;
    }

    // Função para verificar se já existe equipamento com o mesmo número de série ou patrimônio
    async findByNumeroSerieOrPatrimonio(
      numeroSerie: string,
      patrimonio: string,
    ): Promise<Equipamento | null> {
      return this.equipamentoRepository.findOne({
        where: [{ numeroSerie }, { patrimonio }],
      });
    }

    // Método para criar o equipamento
    async create(createEquipamentoDto: CreateEquipamentoDto) {
    const equipamento = this.equipamentoRepository.create(createEquipamentoDto);
    return this.equipamentoRepository.save(equipamento);
    }

    async update(id: number, updateEquipamentoDto: UpdateEquipamentoDto): Promise<Equipamento> {
        const equipamento = await this.equipamentoRepository.findOne({ where: { id } });
    
        if (!equipamento) {
          throw new NotFoundException(`Equipamento com ID ${id} não encontrado`);
        }
    
        // Atualiza o equipamento com os dados recebidos
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
