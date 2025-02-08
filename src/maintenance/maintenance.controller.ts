import { Controller, Response, Post, Body, Param, Put, Delete, Get, NotFoundException, InternalServerErrorException, UseGuards, HttpStatus, Query } from '@nestjs/common';
import { ManutencaoService } from './maintenance.service';
import { CreateManutencaoDto } from './dto/create-maintenance.dto';
import { UpdateManutencaoDto } from './dto/update-maintenance.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Manutencao } from './entities/manutencao.entity';

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

  @Get('equipment/:equipmentId')
  async findAllByEquipamento(@Param('equipamentoId') equipamentoId: number) {
    try {
      return await this.manutencaoService.findManutencaoByEquipamento(equipamentoId);
    } catch (error) {
      throw new NotFoundException(`Equipamento com ID ${equipamentoId} não encontrado: ${error.message}`);
    }
  }
  @Get()
  async findAll(@Query() query: any, @Response() res): Promise<Manutencao[]> {
    try {
      const filters = {};

      for (const [key, value] of Object.entries(query)) {
        if (value) {
          filters[key] = value;
        }
      }

      const manutenções = await this.manutencaoService.findWithFilters(filters);

      if (manutenções.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Nenhuma manutenção encontrada para os filtros fornecidos.',
        });
      }

      const formattedManutencoes = manutenções.map(manutencao => {
        const { equipamento, ...rest } = manutencao;
        return {
          ...rest,
          equipamentoId: equipamento?.id,
        };
      });
      return res.status(HttpStatus.OK).json(formattedManutencoes);

    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Erro ao buscar manutenções: ${error.message}`,
        error: error.stack,
      });

      throw new Error(`Erro ao buscar manutenções: ${error.message}`);
    }
  }
}