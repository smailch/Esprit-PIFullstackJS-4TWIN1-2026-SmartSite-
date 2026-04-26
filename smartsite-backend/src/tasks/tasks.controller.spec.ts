import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByProject: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockService }],
    }).compile();

    controller = module.get(TasksController);
  });

  it('When POST create Then service receives DTO', async () => {
    const dto = {
      title: 'T',
      projectId: '65cfa1a7cf3f4e38dc1db201',
      duration: 2,
      priority: 'MEDIUM',
    };
    mockService.create.mockResolvedValue({ _id: 'tid' });
    const r = await controller.create(dto as never);
    expect(r).toEqual({ _id: 'tid' });
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('When GET all Then list from service', async () => {
    mockService.findAll.mockResolvedValue([]);
    await expect(controller.findAll()).resolves.toEqual([]);
  });

  it('When GET by id Then service.findOne', async () => {
    mockService.findOne.mockResolvedValue({ title: 'X' });
    const r = await controller.findOne('65cfa1a7cf3f4e38dc1db201');
    expect(r).toMatchObject({ title: 'X' });
  });

  it('When GET projects/:projectId Then findByProject', async () => {
    mockService.findByProject.mockResolvedValue([]);
    const r = await controller.findByProject('65cfa1a7cf3f4e38dc1db200');
    expect(r).toEqual([]);
    expect(mockService.findByProject).toHaveBeenCalledWith(
      '65cfa1a7cf3f4e38dc1db200',
    );
  });

  it('When PATCH Then partialUpdate delegates to service.update', async () => {
    mockService.update.mockResolvedValue({ ok: 1 });
    const r = await controller.partialUpdate('65cfa1a7cf3f4e38dc1db201', {
      progress: 50,
    } as never);
    expect(r).toEqual({ ok: 1 });
  });

  it('When PUT Then update delegates to service.update', async () => {
    mockService.update.mockResolvedValue({ progress: 100 });
    const r = await controller.update('65cfa1a7cf3f4e38dc1db201', {
      status: 'Terminé',
    } as never);
    expect(r).toMatchObject({ progress: 100 });
  });

  it('When DELETE Then remove', async () => {
    mockService.remove.mockResolvedValue({ _id: 'x' });
    const r = await controller.remove('65cfa1a7cf3f4e38dc1db201');
    expect(r).toMatchObject({ _id: 'x' });
  });
});
