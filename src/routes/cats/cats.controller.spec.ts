import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './entities/cat.entity';

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

const mockCatsService = {
  findAll: jest.fn(() => Promise.resolve(mockCats)),
  create: jest.fn((createData: CreateCatDto) => Promise.resolve(mockCat)),
  update: jest.fn((id: number, updateData: UpdateCatDto) => Promise.resolve(mockCat)),
  findOne: jest.fn((id: number) => Promise.resolve(mockCat)),
  remove: jest.fn((id: number) => Promise.resolve(mockCat)),
};

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: mockCatsService,
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  describe('FindAll', () => {
    it('should return an array of cats', async () => {
      const findAllSpy = jest.spyOn(service, 'findAll');

      expect(controller.findAll()).resolves.toBe(mockCats);
      expect(findAllSpy).toHaveBeenCalledTimes(1);
      expect(findAllSpy).toHaveBeenCalledWith();
    });
  });

  describe('Create', () => {
    it('should return a new Cat', async () => {
      const createSpy = jest.spyOn(service, 'create');

      expect(controller.create(mockCreateCat)).resolves.toBe(mockCat);
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(mockCreateCat);
    });
  });

  describe('FindOne', () => {
    it('should return a Cat', async () => {
      const findOneSpy = jest.spyOn(service, 'findOne');

      expect(controller.findOne('1')).resolves.toBe(mockCat);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('Update', () => {
    it('should return an updated Cat', async () => {
      const updateSpy = jest.spyOn(service, 'update');

      expect(controller.update('1', mockUpdateCat)).resolves.toBe(mockCat);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledWith(1, mockUpdateCat);
    });
  });

  describe('Remove', () => {
    it('should return a deleted Cat', async () => {
      const removeSpy = jest.spyOn(service, 'remove');

      expect(controller.remove('1')).resolves.toBe(mockCat);
      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy).toHaveBeenCalledWith(1);
    });
  });
});
