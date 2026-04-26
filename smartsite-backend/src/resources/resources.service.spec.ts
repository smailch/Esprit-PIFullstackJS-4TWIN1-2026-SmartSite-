import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ResourcesService } from './resources.service';
import { Resource } from './schemas/resource.schema';

describe('ResourcesService', () => {
  let service: ResourcesService;
  const mockModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourcesService,
        { provide: getModelToken(Resource.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
