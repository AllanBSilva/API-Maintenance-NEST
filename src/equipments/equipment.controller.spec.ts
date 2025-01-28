import { Test, TestingModule } from '@nestjs/testing';
import { EquipamentoController } from './equipment.controller';
import { EquipamentosService } from './equipment.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Equipamento } from './entities/equipamento.entity';
import { CreateEquipamentoDto } from './dto/create-equipment.dto';
import { UpdateEquipamentoDto } from './dto/update-equipment.dto';
import { Manutencao } from 'src/maintenance/entities/manutencao.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('EquipamentoController', () => {
  let controller: EquipamentoController;
  let service: EquipamentosService;
  let equipamentoRepository: Repository<Equipamento>;

  beforeEach(async () => {
    const mockEquipamentoRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipamentoController],
      providers: [
        EquipamentosService,
        {
          provide: getRepositoryToken(Equipamento),
          useValue: mockEquipamentoRepository,
        },
      ],
    }).compile();

    controller = module.get<EquipamentoController>(EquipamentoController);
    service = module.get<EquipamentosService>(EquipamentosService);
    equipamentoRepository = module.get<Repository<Equipamento>>(getRepositoryToken(Equipamento));
  });

  it('should create a new equipamento', async () => {
    const createEquipamentoDto: CreateEquipamentoDto = {
      nome: 'Equipamento de Teste',
      numeroSerie: '12345',
      patrimonio: 'AB-1234',
      marca: 'Marca Teste',
      modelo: 'Modelo Teste',
      setor: 'Setor Teste',
    };

    const mockManutencao: Manutencao = {
      id: 1,
      tipoManutencao: 'Corretiva',
      ocorrencia: 'Falha no sistema',
      causa: 'Problema de hardware',
      solucao: 'Substituição de peça',
      tecnicoExecutor: 'Carlos Silva',
      dataEntrada: '2025-02-02',
      dataSolucao: '2025-02-03',
      numeroManutencao: '',
      equipamento: new Equipamento(),
    };

    const mockEquipamento: Equipamento = {
      id: 1,
      manutencao: [mockManutencao],
      ...createEquipamentoDto,
    };

    jest.spyOn(service, 'findByNumeroSerieOrPatrimonio').mockResolvedValue(null);
    jest.spyOn(service, 'create').mockResolvedValue(mockEquipamento);

    const result = await controller.createEquipamento(createEquipamentoDto);
    expect(result).toEqual(mockEquipamento);
  });

  describe('update', () => {
    it('should update the equipamento', async () => {
      const id = 1;
      const updateEquipamentoDto: UpdateEquipamentoDto = {
        nome: 'Equipamento Atualizado',
      };

      const mockManutencao: Manutencao = {
        id: 1,
        tipoManutencao: 'Corretiva',
        ocorrencia: 'Falha no sistema',
        causa: 'Problema de hardware',
        solucao: 'Substituição de peça',
        tecnicoExecutor: 'Carlos Silva',
        dataEntrada: '2025-02-02',
        dataSolucao: '2025-02-03',
        numeroManutencao: '',
        equipamento: new Equipamento(),
      };

      const mockEquipamento: Equipamento = {
        id,
        manutencao: [mockManutencao],
        nome: updateEquipamentoDto.nome || '',
        numeroSerie: '12345',
        patrimonio: 'AB-1234',
        marca: 'Marca Teste',
        modelo: 'Modelo Teste',
        setor: 'Setor Teste',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockEquipamento);
      jest.spyOn(service, 'update').mockResolvedValue(mockEquipamento);

      const result = await controller.update(id, updateEquipamentoDto);
      expect(result).toEqual(mockEquipamento);
    });

    it('should throw NotFoundException if equipamento not found', async () => {
      const id = 999;
      const updateEquipamentoDto: UpdateEquipamentoDto = {
        nome: 'Equipamento Atualizado',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      try {
        await controller.update(id, updateEquipamentoDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Equipamento com ID ${id} não encontrado.`);
      }
    });
  });

  describe('remove', () => {
    it('should update the equipamento', async () => {
        const id = 1;
        const updateEquipamentoDto: UpdateEquipamentoDto = {
          nome: 'Equipamento Atualizado',
        };
  
        const mockManutencao: Manutencao = {
          id: 1,
          tipoManutencao: 'Corretiva',
          ocorrencia: 'Falha no sistema',
          causa: 'Problema de hardware',
          solucao: 'Substituição de peça',
          tecnicoExecutor: 'Carlos Silva',
          dataEntrada: '2025-02-02',
          dataSolucao: '2025-02-03',
          numeroManutencao: '',
          equipamento: new Equipamento(),
        };
  
        const mockEquipamento: Equipamento = {
          id,
          manutencao: [mockManutencao],
          nome: updateEquipamentoDto.nome || '',
          numeroSerie: '12345',
          patrimonio: 'AB-1234',
          marca: 'Marca Teste',
          modelo: 'Modelo Teste',
          setor: 'Setor Teste',
        };
  

      jest.spyOn(service, 'findOne').mockResolvedValue(mockEquipamento);
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove(id);
      expect(result).toEqual({ message: 'Equipamento excluído com sucesso' });
    });

    it('should throw NotFoundException if equipamento not found', async () => {
      const id = 999;

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      try {
        await controller.remove(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Erro ao excluir equipamento: Equipamento com ID ${id} não encontrado.`);
      }
    });
  });
});

