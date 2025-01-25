import { Controller, Post, Body, Param, Put, Delete, Get, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ManutencaoService } from './manutencao.service';
import { CreateManutencaoDto } from '../dto/create-manutencao.dto';
import { UpdateManutencaoDto } from '../dto/update-manutencao.dto';

@Controller('manutencao')
export class ManutencaoController {
  constructor(private readonly manutencaoService: ManutencaoService) {}

  // POST para criar manutenção associada a um equipamento
  @Post(':equipamentoId')
  async createManutencao(
    @Param('equipamentoId') equipamentoId: number,
    @Body() createManutencaoDto: CreateManutencaoDto,
  ) {
    try {
      return await this.manutencaoService.createManutencaoParaEquipamento(
        equipamentoId,
        createManutencaoDto,
      );
    } catch (error) {
      // Lançando exceção com mensagem customizada e código 400 para erro de requisição
      throw new InternalServerErrorException(`Erro ao criar manutenção: ${error.message}`);
    }
  }
  // Editar manutenção
  @Put(':id')
  async updateManutencao(
    @Param('id') id: number,
    @Body() updateManutencaoDto: UpdateManutencaoDto,
  ) {
    try {
      return await this.manutencaoService.updateManutencao(id, updateManutencaoDto);
    } catch (error) {
      // Lançando exceção com código 404 caso manutenção não seja encontrada
      throw new NotFoundException(`Manutenção com ID ${id} não encontrada ou erro ao atualizar: ${error.message}`);
    }
  }

  // Excluir manutenção
  @Delete(':id')
  async deleteManutencao(@Param('id') id: number): Promise<{ message: string }> {
    try {
      // Verifique se a manutenção existe
      const manutencaoExistente = await this.manutencaoService.findManutencaoById(id);
      if (!manutencaoExistente) {
        throw new NotFoundException(`Manutenção com ID ${id} não encontrada.`);
      }
      // Exclua a manutenção se ela existir
      await this.manutencaoService.deleteManutencao(id);

      // Retorne a mensagem de sucesso
      return { message: 'Manutenção excluída com sucesso' };
    } catch (error) {
      // Lança um erro detalhado caso a manutenção não seja encontrada ou outro erro ocorra
      throw new NotFoundException(`Erro ao excluir manutenção: ${error.message}`);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.manutencaoService.findManutencaoById(id);
    } catch (error) {
      // Lançando erro 404, caso manutenção não seja encontrada
      throw new NotFoundException(`Manutenção com ID ${id} não encontrada: ${error.message}`);
    }
  }
    // Buscar manutenções de um equipamento
    @Get('equipamento/:equipamentoId')
    async findAllByEquipamento(@Param('equipamentoId') equipamentoId: number) {
      try {
        return await this.manutencaoService.findManutencaoByEquipamento(equipamentoId);
      } catch (error) {
        // Lançando erro 404, caso o equipamento não seja encontrado
        throw new NotFoundException(`Equipamento com ID ${equipamentoId} não encontrado: ${error.message}`);
      }
    }
}
