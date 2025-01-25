import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Manutencao } from './entities/manutencao.entity';
import { Equipamento } from '../equipamentos/entities/equipamento.entity';
import { CreateManutencaoDto } from '../dto/create-manutencao.dto';
import { UpdateManutencaoDto } from '../dto/update-manutencao.dto';

@Injectable()
export class ManutencaoService {
  [x: string]: any;
  constructor(
    @InjectRepository(Manutencao)
    private readonly manutencaoRepository: Repository<Manutencao>,
    @InjectRepository(Equipamento)
    private readonly equipamentoRepository: Repository<Equipamento>,
  ) {}

  async createManutencaoParaEquipamento(
    equipamentoId: number,
    createManutencaoDto: CreateManutencaoDto,
  ) {
    try {
      // Verificar se o equipamento existe
      const equipamento = await this.equipamentoRepository.findOne({
        where: { id: equipamentoId },
      });

      if (!equipamento) {
        throw new NotFoundException(`Equipamento com ID ${equipamentoId} não encontrado`);
      }

      // Gerar o número da manutenção
      const anoAtual = new Date().getFullYear().toString();
      const ultimoNumeroManutencao = await this.manutencaoRepository
        .createQueryBuilder('manutencao')
        .select('MAX(CAST(SUBSTR(manutencao.numeroManutencao, 5) AS INTEGER))', 'max')
        .where('manutencao.numeroManutencao LIKE :ano', { ano: `${anoAtual}%` })
        .getRawOne();

      // Definir o número sequencial
      const sequencial = ultimoNumeroManutencao?.max ? ultimoNumeroManutencao.max + 1 : 1;

      // Formatar o número da manutenção, ex: 2025000001
      const numeroManutencao = `${anoAtual}${sequencial.toString().padStart(7, '0')}`;

      // Criar a manutenção e associar ao equipamento
      const manutencao = this.manutencaoRepository.create(createManutencaoDto);
      manutencao.equipamento = equipamento;
      manutencao.numeroManutencao = numeroManutencao;

      // Salvar a manutenção associada ao equipamento
      return this.manutencaoRepository.save(manutencao);
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao criar manutenção: ${error.message}`);
    }
  }

  // Editando manutenção
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


// Excluir manutenção
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


// Buscar manutenção por ID
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

  // Buscar manutenções de um equipamento
  async findManutencaoByEquipamento(equipamentoId: number): Promise<Manutencao[] | { message: string }> {
    try {
      // Verifica se o equipamento existe
      const equipamento = await this.equipamentoRepository.findOne({
        where: { id: equipamentoId },
      });
  
      if (!equipamento) {
        throw new NotFoundException(`Equipamento com ID ${equipamentoId} não encontrado`);
      }
  
      // Buscar as manutenções associadas ao equipamento
      const manutencoes = await this.manutencaoRepository.find({ where: { equipamento } });
  
      // Se não houver manutenções associadas, retorna uma mensagem dizendo que o equipamento ainda não tem manutenção
      if (manutencoes.length === 0) {
        return { message: `Ainda não há manutenções registradas para o equipamento com ID ${equipamentoId}` };
      }
  
      // Caso contrário, retorna as manutenções encontradas
      return manutencoes;
    } catch (error) {
      throw new InternalServerErrorException(`Erro ao buscar manutenções: ${error.message}`);
    }
  }
}

