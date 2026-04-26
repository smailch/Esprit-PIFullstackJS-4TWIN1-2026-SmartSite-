import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { HumanResourcesController } from './human-resources.controller';
import { HumanResourcesService } from './human-resources.service';

describe('HumanResourcesController', () => {
  let controller: HumanResourcesController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HumanResourcesController],
      providers: [{ provide: HumanResourcesService, useValue: mockService }],
    }).compile();
    controller = module.get<HumanResourcesController>(HumanResourcesController);
  });

  it('When findAll with role Then forwards to service', async () => {
    mockService.findAll.mockResolvedValue([]);
    const out = await controller.findAll('plombier');
    expect(mockService.findAll).toHaveBeenCalledWith('plombier');
    expect(out).toEqual([]);
  });

  it('When findOne Then forwards id', async () => {
    mockService.findOne.mockResolvedValue({ _id: '1' });
    await controller.findOne('1');
    expect(mockService.findOne).toHaveBeenCalledWith('1');
  });

  it('Given invalid birthDate When create Then throws BadRequestException', async () => {
    await expect(
      controller.create(
        {
          firstName: 'Jean',
          lastName: 'D',
          cin: 'AB123',
          birthDate: 'not-a-date',
          phone: '12345678',
          role: 'Ouvrier',
        },
        undefined,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(mockService.create).not.toHaveBeenCalled();
  });

  it('Given valid body When create Then service receives validated instance', async () => {
    mockService.create.mockResolvedValue({ _id: '1', firstName: 'Jean' });
    const res = await controller.create(
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        cin: 'AB123',
        birthDate: '1990-05-20T00:00:00.000Z',
        phone: '12345678',
        role: 'Ouvrier',
        availability: 'true',
        monthlySalaryDt: '1200.50',
      },
      undefined,
    );
    expect(mockService.create).toHaveBeenCalled();
    const dto = mockService.create.mock.calls[0][0];
    expect(dto.firstName).toBe('Jean');
    expect(dto.lastName).toBe('Dupont');
    expect(dto.availability).toBe(true);
    expect(res).toEqual(expect.objectContaining({ firstName: 'Jean' }));
  });
});
