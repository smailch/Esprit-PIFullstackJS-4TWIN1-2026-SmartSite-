import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { AiAnalysisService } from './ai-analysis.service';

describe('JobsController', () => {
  let controller: JobsController;
  const mockJobs = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getJobProgress: jest.fn(),
    updateJobProgress: jest.fn(),
    uploadProgressPhoto: jest.fn(),
    removeProgressPhoto: jest.fn(),
  };
  const mockAi = { analyzeImageFile: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        { provide: JobsService, useValue: mockJobs },
        { provide: AiAnalysisService, useValue: mockAi },
      ],
    }).compile();
    controller = module.get<JobsController>(JobsController);
  });

  it('When create Then delegates to service', async () => {
    const job = { _id: '1', title: 'J' } as any;
    mockJobs.create.mockResolvedValue(job);
    const dto = {
      taskId: '507f1f77bcf86cd799439011',
      title: 'J',
      startTime: '2026-01-01T00:00:00.000Z',
      endTime: '2026-01-02T00:00:00.000Z',
    };
    const out = await controller.create(dto as any);
    expect(mockJobs.create).toHaveBeenCalledWith(dto);
    expect(out).toBe(job);
  });

  it('When findAll Then delegates', async () => {
    mockJobs.findAll.mockResolvedValue([]);
    await expect(controller.findAll()).resolves.toEqual([]);
  });

  it('When get progress Then delegates', async () => {
    mockJobs.getJobProgress.mockResolvedValue({ steps: [], percentage: 0 });
    const out = await controller.getProgress('1');
    expect(mockJobs.getJobProgress).toHaveBeenCalledWith('1');
    expect(out.percentage).toBe(0);
  });

  it('When put progress Then delegates', async () => {
    mockJobs.updateJobProgress.mockResolvedValue({
      steps: [],
      percentage: 100,
    });
    const out = await controller.putProgress('1', {
      steps: [{ step: 'A', completed: true }],
    } as any);
    expect(mockJobs.updateJobProgress).toHaveBeenCalled();
    expect(out.percentage).toBe(100);
  });

  it('Given no file When uploadProgressPhoto Then BadRequest', async () => {
    await expect(
      controller.uploadProgressPhoto('1', 0, undefined as any),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(mockAi.analyzeImageFile).not.toHaveBeenCalled();
  });

  it('When uploadProgressPhoto with file Then runs AI and service', async () => {
    mockAi.analyzeImageFile.mockResolvedValue({
      dangerLevel: 'LOW',
      detectedObjects: [],
      safetyStatus: { helmet: true, vest: true },
      message: 'ok',
    });
    mockJobs.uploadProgressPhoto.mockResolvedValue({
      photoUrl: '/u',
      aiAnalysis: {},
    });
    const file = {
      filename: 'a.jpg',
      originalname: 'a.jpg',
    } as Express.Multer.File;
    await controller.uploadProgressPhoto('1', 0, file);
    expect(mockAi.analyzeImageFile).toHaveBeenCalled();
    expect(mockJobs.uploadProgressPhoto).toHaveBeenCalled();
  });

  it('When deleteProgressPhoto Then delegates', async () => {
    mockJobs.removeProgressPhoto.mockResolvedValue({
      steps: [],
      percentage: 0,
    });
    await controller.deleteProgressPhoto('1', 0);
    expect(mockJobs.removeProgressPhoto).toHaveBeenCalledWith('1', 0);
  });

  it('When findOne Then delegates', async () => {
    mockJobs.findOne.mockResolvedValue({ _id: '1' });
    await controller.findOne('1');
    expect(mockJobs.findOne).toHaveBeenCalledWith('1');
  });

  it('When update Then delegates', async () => {
    mockJobs.update.mockResolvedValue({ _id: '1' });
    await controller.update('1', { title: 'N' } as any);
    expect(mockJobs.update).toHaveBeenCalledWith('1', { title: 'N' });
  });

  it('When remove Then returns success message', async () => {
    mockJobs.remove.mockResolvedValue(undefined);
    const out = await controller.remove('1');
    expect(mockJobs.remove).toHaveBeenCalledWith('1');
    expect(out).toEqual({ message: 'Job deleted successfully' });
  });
});
