import { Controller, Post, Body, Param, Put, Delete, Get, NotFoundException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { ManutencaoService } from './maintenance.service';
import { CreateManutencaoDto } from './dto/create-maintenance.dto';
import { UpdateManutencaoDto } from './dto/update-maintenance.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('maintenance')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class ManutencaoController {
  constructor(private readonly manutencaoService: ManutencaoService) { }

  @Post(':equipmentId')
  async createManutencao(
    @Param('equipmentId') equipamentoId: number,
    @Body() createManutencaoDto: CreateManutencaoDto,
  ) {
    try {
      return await this.manutencaoService.createManutencaoParaEquipamento(
        equipamentoId,
        createManutencaoDto,
      );
    } catch (error) {
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
      throw new NotFoundException(`Manutenção com ID ${id} não encontrada ou erro ao atualizar: ${error.message}`);
    }
  }

  // Excluir manutenção
  @Delete(':id')
  async deleteManutencao(@Param('id') id: number): Promise<{ message: string }> {
    try {
      const manutencaoExistente = await this.manutencaoService.findManutencaoById(id);
      if (!manutencaoExistente) {
        throw new NotFoundException(`Manutenção com ID ${id} não encontrada.`);
      }
      await this.manutencaoService.deleteManutencao(id);

      return { message: 'Manutenção excluída com sucesso' };
    } catch (error) {
      throw new NotFoundException(`Erro ao excluir manutenção: ${error.message}`);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.manutencaoService.findManutencaoById(id);
    } catch (error) {
      throw new NotFoundException(`Manutenção com ID ${id} não encontrada: ${error.message}`);
    }
  }
  // Buscar manutenções de um equipamento
  @Get('equipment/:equipmentId')
  async findAllByEquipamento(@Param('equipamentoId') equipamentoId: number) {
    try {
      return await this.manutencaoService.findManutencaoByEquipamento(equipamentoId);
    } catch (error) {
      throw new NotFoundException(`Equipamento com ID ${equipamentoId} não encontrado: ${error.message}`);
    }
  }
}