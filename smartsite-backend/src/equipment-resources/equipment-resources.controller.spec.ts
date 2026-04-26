import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentController } from './equipment-resources.controller';
import { EquipmentService } from './equipment-resources.service';

describe('EquipmentController', () => {
  let controller: EquipmentController;
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
      controllers: [EquipmentController],
      providers: [{ provide: EquipmentService, useValue: mockService }],
    }).compile();
    controller = module.get<EquipmentController>(EquipmentController);
  });

  it('When create Then delegates to service', async () => {
    mockService.create.mockResolvedValue({ _id: '1', name: 'Crane' });
    const res = await controller.create({ name: 'Crane' } as any);
    expect(mockService.create).toHaveBeenCalledWith({ name: 'Crane' });
    expect(res.name).toBe('Crane');
  });

  it('When findAll Then delegates', async () => {
    mockService.findAll.mockResolvedValue([]);
    const out = await controller.findAll();
    expect(out).toEqual([]);
  });

  it('When get by id Then delegates', async () => {
    mockService.findOne.mockResolvedValue({ _id: '1' });
    await controller.findOne('1');
    expect(mockService.findOne).toHaveBeenCalledWith('1');
  });

  it('When update Then delegates', async () => {
    mockService.update.mockResolvedValue({ _id: '1' });
    await controller.update('1', { name: 'N' } as any);
    expect(mockService.update).toHaveBeenCalledWith('1', { name: 'N' });
  });

  it('When remove Then delegates', async () => {
    mockService.remove.mockResolvedValue({ message: 'ok' });
    const out = await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith('1');
    expect(out).toEqual({ message: 'ok' });
  });
});
