import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';

describe('AuditLogController', () => {
  let controller: AuditLogController;
  const mockService = {
    findAll: jest.fn(),
    countUnreadSuspicious: jest.fn(),
    getAiSummary: jest.fn(),
    markAllAsRead: jest.fn(),
    markOneAsRead: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditLogController],
      providers: [{ provide: AuditLogService, useValue: mockService }],
    }).compile();

    controller = module.get<AuditLogController>(AuditLogController);
  });

  it('findAll passes suspicious flag', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll('true');
    expect(mockService.findAll).toHaveBeenCalledWith(true);
    await controller.findAll(undefined);
    expect(mockService.findAll).toHaveBeenCalledWith(false);
  });

  it('countUnread delegates', async () => {
    mockService.countUnreadSuspicious.mockResolvedValue(3);
    await expect(controller.countUnread()).resolves.toBe(3);
  });

  it('getAiSummary delegates', async () => {
    mockService.getAiSummary.mockResolvedValue({ summary: 'ok' });
    await expect(controller.getAiSummary()).resolves.toEqual({ summary: 'ok' });
  });

  it('markAllAsRead delegates', async () => {
    mockService.markAllAsRead.mockResolvedValue({ updated: 1 });
    await controller.markAllAsRead();
    expect(mockService.markAllAsRead).toHaveBeenCalled();
  });

  it('markOneAsRead passes id', async () => {
    mockService.markOneAsRead.mockResolvedValue({});
    await controller.markOneAsRead('abc');
    expect(mockService.markOneAsRead).toHaveBeenCalledWith('abc');
  });
});
