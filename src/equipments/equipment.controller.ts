import { Controller, Response, Post, Get, Body, Param, Put, Delete, Query, NotFoundException, BadRequestException, ConflictException, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { EquipamentosService } from './equipment.service';
import { CreateEquipamentoDto } from './dto/create-equipment.dto';
import { Equipamento } from './entities/equipamento.entity';
import { UpdateEquipamentoDto } from './dto/update-equipment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('equipment')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class EquipamentoController {
  constructor(private readonly equipamentoService: EquipamentosService) { }

  @Post()
  async createEquipamento(@Body() createEquipamentoDto: CreateEquipamentoDto) {
    const equipamentoExistente = await this.equipamentoService.findByNumeroSerieOrPatrimonio(
      createEquipamentoDto.numeroSerie,
      createEquipamentoDto.patrimonio,
    );

    if (equipamentoExistente) {
      throw new ConflictException('Equipamento com o número de série ou patrimônio já existe.');
    }

    try {
      return await this.equipamentoService.create(createEquipamentoDto);
    } catch (error) {
      throw new BadRequestException('Erro ao criar o equipamento: ' + error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Equipamento> {
    const equipamento = await this.equipamentoService.findOne(id);

    if (!equipamento) {
      throw new NotFoundException(`Equipamento com ID ${id} não encontrado.`);
    }
    return equipamento;
  }

  @Get()
  async findAll(@Query() query: any, @Response() res): Promise<Equipamento[]> {
    try {
      const filters = {};

      for (const [key, value] of Object.entries(query)) {
        if (value) {
          filters[key] = value;
        }
      }
      const equipamentos = await this.equipamentoService.findWithFilters(filters);

      if (equipamentos.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Nenhum equipamento encontrado para os filtros fornecidos.',
        });
      }
      
      return res.status(HttpStatus.OK).json(equipamentos);

    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Erro ao buscar equipamentos: ${error.message}`,
        error: error.stack,
      });
      throw new Error(`Erro ao buscar equipamentos: ${error.message}`);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEquipamentoDto: UpdateEquipamentoDto,
  ): Promise<Equipamento> {
    try {
      const equipamentoExistente = await this.equipamentoService.findOne(id);
      if (!equipamentoExistente) {
        throw new NotFoundException(`Equipamento com ID ${id} não encontrado.`);
      }

      return await this.equipamentoService.update(id, updateEquipamentoDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Erro ao atualizar equipamento: ${error.message}`);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    try {
      const equipamentoExistente = await this.equipamentoService.findOne(id);
      if (!equipamentoExistente) {
        throw new NotFoundException(`Equipamento com ID ${id} não encontrado.`);
      }
      await this.equipamentoService.remove(id);
      return { message: 'Equipamento excluído com sucesso' };
    } catch (error) {
      throw new NotFoundException(`Erro ao excluir equipamento: ${error.message}`);
    }
  }
}