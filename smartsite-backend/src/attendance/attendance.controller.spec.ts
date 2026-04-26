import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  const mockService = {
    create: jest.fn(),
    findByJob: jest.fn(),
    findByResource: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [{ provide: AttendanceService, useValue: mockService }],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
  });

  it('POST create forwards to service', async () => {
    const dto = {
      jobId: 'j1',
      resourceId: 'r1',
      date: '2026-01-01',
    };
    const created = { _id: 'a1' };
    mockService.create.mockResolvedValue(created);

    const out = await controller.create(dto as never);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(out).toBe(created);
  });

  it('GET job/:jobId forwards', async () => {
    mockService.findByJob.mockResolvedValue([]);
    await controller.listByJob('jid');
    expect(mockService.findByJob).toHaveBeenCalledWith('jid');
  });

  it('GET resource/:id forwards', async () => {
    mockService.findByResource.mockResolvedValue([]);
    await controller.listByResource('rid');
    expect(mockService.findByResource).toHaveBeenCalledWith('rid');
  });
});
