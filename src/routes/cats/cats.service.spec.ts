import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

// Used to mock other modules in a generic way
const moduleMocker = new ModuleMocker(global);

const mockCreateCat: CreateCatDto = {
  color: 'black',
  eyes_color: 'blue',
  name: 'boris',
  weight: '95kg',
};

const mockUpdateCat: UpdateCatDto = {
  color: 'red',
};

const mockCat: Cat = {
  id: 1,
  color: 'black',
  eyes_color: 'blue',
  name: 'boris',
  weight: '95kg',
};

const mockCats: Cat[] = [];

const mockPrisma = {
  cats: {
    findMany: jest.fn((selectors?) => Promise.resolve(mockCats)),
    create: jest.fn((createData) => Promise.resolve(mockCat)),
    update: jest.fn((updateData) => Promise.resolve(mockCat)),
    findUnique: jest.fn((selectors) => Promise.resolve(mockCat)),
    delete: jest.fn((selectors) => Promise.resolve(mockCat)),
  },
};

describe('CatsService', () => {
  let service: CatsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return mockPrisma;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<CatsService>(CatsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('FindAll', () => {
    it('should return an array of cats', async () => {
      const findManySpy = jest.spyOn(prisma.cats, 'findMany');

      expect(service.findAll()).resolves.toBe(mockCats);
      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith();
    });
  });

  describe('Create', () => {
    it('should return a new Cat', async () => {
      const createSpy = jest.spyOn(prisma.cats, 'create');

      expect(service.create(mockCreateCat)).resolves.toBe(mockCat);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith({ data: mockCreateCat });
    });
  });

  describe('FindOne', () => {
    it('should return a Cat', async () => {
      const findOneSpy = jest.spyOn(prisma.cats, 'findUnique');

      expect(service.findOne(1)).resolves.toBe(mockCat);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('Update', () => {
    it('should return an updated Cat', async () => {
      const updateSpy = jest.spyOn(prisma.cats, 'update');

      expect(service.update(1, mockUpdateCat)).resolves.toBe(mockCat);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith({ where: { id: 1 }, data: mockUpdateCat });
    });
  });

  describe('Remove', () => {
    it('should return a deleted Cat', async () => {
      const removeSpy = jest.spyOn(prisma.cats, 'delete');

      expect(service.remove(1)).resolves.toBe(mockCat);
      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
