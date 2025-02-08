import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manutencao } from './entities/manutencao.entity';
import { Equipamento } from '../equipments/entities/equipamento.entity';
import { CreateManutencaoDto } from './dto/create-maintenance.dto';
import { UpdateManutencaoDto } from './dto/update-maintenance.dto';

@Injectable()
export class ManutencaoService {
  [x: string]: any;
  constructor(
    @InjectRepository(Manutencao)
    private readonly manutencaoRepository: Repository<Manutencao>,
    @InjectRepository(Equipamento)
    private readonly equipamentoRepository: Repository<Equipamento>,
  ) { }

  async createManutencaoParaEquipamento(
    equipamentoId: number,
    createManutencaoDto: CreateManutencaoDto,
  ) {
    try {
      const equipamento = await this.equipamentoRepository.findOne({
        where: { id: equipamentoId },
      });

      if (!equipamento) {
        throw new NotFoundException(`Equipamento com ID ${equipamentoId} não encontrado`);
      }

      const anoAtual = new Date().getFullYear().toString();
      const ultimoNumeroManutencao = await this.manutencaoRepository
        .createQueryBuilder('manutencao')
        .select('MAX(CAST(SUBSTR(manutencao.numeroManutencao, 5) AS INTEGER))', 'max')
        .where('manutencao.numeroManutencao LIKE :ano', { ano: `${anoAtual}%` })
        .getRawOne();

      const sequencial = ultimoNumeroManutencao?.max ? ultimoNumeroManutencao.max + 1 : 1;

      // Formatar o número da manutenção, ex: 2025000001
      const numeroManutencao = `${anoAtual}${sequencial.toString().padStart(7, '0')}`;

      const manutencao = this.manutencaoRepository.create(createManutencaoDto);
      manutencao.equipamento = equipamento;
      manutencao.numeroManutencao = numeroManutencao;

      return this.manutencaoRepository.save(manutencao);
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao criar manutenção: ${error.message}`);
    }
  }

  async updateManutencao(id: number, updateManutencaoDto: UpdateManutencaoDto): Promise<Manutencao> {
    try {
      const manutencao = await this.manutencaoRepository.findOne({ where: { id } });

      if (!manutencao) {
        throw new NotFoundException(`Manutenção com ID ${id} não encontrada`);
      }
      Object.assign(manutencao, updateManutencaoDto);

      return this.manutencaoRepository.save(manutencao);
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao atualizar manutenção: ${error.message}`);
    }
  }

  async deleteManutencao(id: number): Promise<void> {
    try {
      const manutencao = await this.manutencaoRepository.findOne({ where: { id } });

      if (!manutencao) {
        throw new NotFoundException(`Manutenção com ID ${id} não encontrada`);
      }

      await this.manutencaoRepository.remove(manutencao);
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao excluir manutenção: ${error.message}`);
    }
  }

  async findManutencaoById(id: number): Promise<Manutencao> {
    try {
      const manutencao = await this.manutencaoRepository.findOne({
        where: { id },
        relations: ['equipamento'],
      });

      if (!manutencao) {
        throw new NotFoundException(`Manutenção com ID ${id} não encontrada`);
      }

      return manutencao;
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao buscar manutenção: ${error.message}`);
    }
  }

  async findManutencaoByEquipamento(equipamentoId: number): Promise<Manutencao[] | { message: string }> {
    try {
      const equipamento = await this.equipamentoRepository.findOne({
        where: { id: equipamentoId },
      });

      if (!equipamento) {
        throw new NotFoundException(`Equipamento com ID ${equipamentoId} não encontrado`);
      }

      const manutencoes = await this.manutencaoRepository.find({ where: { equipamento } });

      if (manutencoes.length === 0) {
        return { message: `Ainda não há manutenções registradas para o equipamento com ID ${equipamentoId}` };
      }

      return manutencoes;
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao buscar manutenções: ${error.message}`);
    }
  }

  async findWithFilters(filters: any): Promise<Manutencao[]> {
    const queryBuilder = this.manutencaoRepository.createQueryBuilder('manutencao');

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        if (typeof value === 'string') {
          queryBuilder.andWhere(`manutencao.${key} LIKE :${key}`, { [key]: `%${value}%` });
        } else {
          queryBuilder.andWhere(`manutencao.${key} = :${key}`, { [key]: value });
        }
      }
    }
    queryBuilder.leftJoinAndSelect('manutencao.equipamento', 'equipamento');

    return queryBuilder.getMany();
  }
  async findAll(): Promise<Manutencao[]> {
    return this.manutencaoRepository.find({
      relations: ['equipamento'], 
    });
  }
}

