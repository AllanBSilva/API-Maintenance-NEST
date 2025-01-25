import { Test, TestingModule } from '@nestjs/testing';
import { EquipamentosService } from './equipamentos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Equipamento } from './entities/equipamento.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateEquipamentoDto } from '../dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from '../dto/update-equipamento.dto';

describe('EquipamentosService', () => {
  let service: EquipamentosService;
  let repository: Repository<Equipamento>;

  beforeEach(async () => {
    const mockEquipamentoRepository = {
        save: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(), 
        delete: jest.fn(), 
      };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipamentosService,
        {
          provide: getRepositoryToken(Equipamento),
          useValue: mockEquipamentoRepository,
        },
      ],
    }).compile();

    service = module.get<EquipamentosService>(EquipamentosService);
    repository = module.get<Repository<Equipamento>>(getRepositoryToken(Equipamento));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new equipamento', async () => {
      const createEquipamentoDto: CreateEquipamentoDto = {
        numeroSerie: '12345',
        patrimonio: 'AB-1234',
        nome: 'Equipamento 1',
        marca: '',
        modelo: '',
        setor: '',
      };

      const mockEquipamento = {
        id: 1,
        manutencao: [], // Adicionando a propriedade 'manutencao'
        ...createEquipamentoDto,
      };

      jest.spyOn(repository, 'save').mockResolvedValue(mockEquipamento);

      const result = await service.create(createEquipamentoDto);
      expect(result).toEqual(mockEquipamento);
    });
  });

  describe('findOne', () => {
    it('should return a single equipamento', async () => {
      const mockEquipamento = {
        id: 1,
        numeroSerie: '12345',
        patrimonio: 'AB-1234',
        nome: 'Equipamento 1',
        marca: '',        // Adicionando a propriedade 'marca'
        modelo: '',       // Adicionando a propriedade 'modelo'
        setor: '',        // Adicionando a propriedade 'setor'
        manutencao: [],   // Adicionando a propriedade 'manutencao'
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockEquipamento);

      const result = await service.findOne(1);
      expect(result).toEqual(mockEquipamento);
    });

    it('should throw NotFoundException if equipamento does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOne(999);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Equipamento com id 999 não encontrado');
      }
    });
  });

  describe('update', () => {
    it('should update an existing equipamento', async () => {
      const id = 1;
      const updateEquipamentoDto: UpdateEquipamentoDto = {
        nome: 'Equipamento Atualizado',
      };

      const mockEquipamento = {
        id,
        nome: updateEquipamentoDto.nome || '',
        numeroSerie: '12345',
        patrimonio: 'AB-1234',
        marca: '',          // Adicionando a propriedade 'marca'
        modelo: '',         // Adicionando a propriedade 'modelo'
        setor: '',          // Adicionando a propriedade 'setor'
        manutencao: [],     // Garantindo que a propriedade 'manutencao' seja incluída
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockEquipamento); // Simula encontrar o equipamento
      jest.spyOn(repository, 'save').mockResolvedValue(mockEquipamento); // Simula a atualização

      const result = await service.update(id, updateEquipamentoDto);
      expect(result).toEqual(mockEquipamento);
    });

    it('should throw NotFoundException if equipamento not found', async () => {
      const id = 999;
      const updateEquipamentoDto: UpdateEquipamentoDto = {
        nome: 'Equipamento Atualizado',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null); // Simula que o equipamento não existe

      try {
        await service.update(id, updateEquipamentoDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Equipamento com ID ${id} não encontrado`);
      }
    });
  });

  describe('remove', () => {
    it('should remove an existing equipamento', async () => {
      const id = 1;
      const mockEquipamento = {
        id,
        numeroSerie: '12345',
        patrimonio: 'AB-1234',
        nome: 'Equipamento 1',
        marca: '',          
        modelo: '',         
        setor: '',          
        manutencao: [],     
      };
  
      // Simula que o equipamento é encontrado
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockEquipamento);
      
      // Mock do método delete
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: {} });
  
      // Chama o método de remoção
      await service.remove(id);
  
      // Verifica se o método delete foi chamado com o id correto
      expect(repository.remove).toHaveBeenCalledWith(mockEquipamento);
  });
  
    it('should throw NotFoundException if equipamento not found', async () => {
      const id = 999;
  
      // Simula que o equipamento não existe
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
  
      try {
        // Tenta remover o equipamento
        await service.remove(id);
      } catch (error) {
        // Verifica se o erro lançado é um NotFoundException
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Equipamento com ID ${id} não encontrado`);
      }
    });
  });
  
  
});
