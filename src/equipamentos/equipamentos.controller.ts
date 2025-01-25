// No controller de Equipamentos (equipamento.controller.ts)
import { Controller, Response,Post, Get, Body, Param, Put, Delete, Query, NotFoundException, BadRequestException, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { EquipamentosService } from './equipamentos.service';
import { CreateEquipamentoDto } from '../dto/create-equipamento.dto';
import { Equipamento } from './entities/equipamento.entity';
import { UpdateEquipamentoDto } from '../dto/update-equipamento.dto';

@Controller('equipamentos')
export class EquipamentoController {
  constructor(private readonly equipamentoService: EquipamentosService) {}

  @Post()
  async createEquipamento(@Body() createEquipamentoDto: CreateEquipamentoDto) {
    // Validação do DTO já é feita automaticamente pelo NestJS via class-validator

    // Verificar se o equipamento com o número de série ou patrimônio já existe
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
      // Organize os filtros
      const filters = {};

      // Verifique cada parâmetro recebido e adicione ao filtro
      for (const [key, value] of Object.entries(query)) {
        if (value) {
          filters[key] = value;
        }
      }

      // Chama o serviço para encontrar equipamentos com os filtros
      const equipamentos = await this.equipamentoService.findWithFilters(filters);

      // Verifica se a pesquisa retornou resultados
      if (equipamentos.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Nenhum equipamento encontrado para os filtros fornecidos.',
        });
      }

      // Retorna os equipamentos encontrados com status 200
      return res.status(HttpStatus.OK).json(equipamentos);

    } catch (error) {
      // Logando o erro para depuração
      console.error('Erro ao buscar equipamentos:', error);

      // Retornando o erro via resposta personalizada
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Erro ao buscar equipamentos: ${error.message}`,
        error: error.stack, // Detalhamento da pilha de erro
      });
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEquipamentoDto: UpdateEquipamentoDto,
  ): Promise<Equipamento> {
    try {
      // Verifique se o equipamento existe antes de tentar atualizá-lo
      const equipamentoExistente = await this.equipamentoService.findOne(id);
      if (!equipamentoExistente) {
        // Se o equipamento não for encontrado, lança a exceção com a mensagem apropriada
        throw new NotFoundException(`Equipamento com ID ${id} não encontrado.`);
      }
  
      // Se o equipamento existir, faça a atualização
      return await this.equipamentoService.update(id, updateEquipamentoDto);
    } catch (error) {
      // Se ocorrer um erro, relance a exceção original sem adicionar um prefixo extra
      if (error instanceof NotFoundException) {
        throw error;  // Re-lança o erro sem modificá-lo
      }
      // Para outros erros, você pode lançar uma exceção genérica
      throw new Error(`Erro ao atualizar equipamento: ${error.message}`);
    }
  }
  

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    try {
      // Verifique se o equipamento existe
      const equipamentoExistente = await this.equipamentoService.findOne(id);
      if (!equipamentoExistente) {
        throw new NotFoundException(`Equipamento com ID ${id} não encontrado.`);
      }
  
      // Exclua o equipamento se ele existir
      await this.equipamentoService.remove(id);
  
      // Retorne a mensagem de sucesso
      return { message: 'Equipamento excluído com sucesso' };
    } catch (error) {
      // Lança um erro detalhado caso o equipamento não seja encontrado ou outro erro ocorra
      throw new NotFoundException(`Erro ao excluir equipamento: ${error.message}`);
    }
  }
}
