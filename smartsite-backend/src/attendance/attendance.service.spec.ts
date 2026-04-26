import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { AttendanceService } from './attendance.service';
import { Attendance } from './schemas/attendance.schema';
import { Job } from '../jobs/jobs.schema';
import { Human } from '../human-resources/schemas/human.schema';

describe('AttendanceService', () => {
  let service: AttendanceService;

  const mockExec = jest.fn();
  const mockFindChain = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnValue({ exec: mockExec }),
  };

  const mockAttendanceModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnValue(mockFindChain),
  };

  const mockJobModel = {
    findById: jest.fn(),
    exists: jest.fn(),
  };

  const mockHumanModel = {
    findById: jest.fn(),
  };

  const jobId = new Types.ObjectId().toString();
  const resourceId = new Types.ObjectId().toString();

  beforeEach(async () => {
    jest.clearAllMocks();
    mockExec.mockResolvedValue([]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getModelToken(Attendance.name),
          useValue: mockAttendanceModel,
        },
        { provide: getModelToken(Job.name), useValue: mockJobModel },
        { provide: getModelToken(Human.name), useValue: mockHumanModel },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  describe('create', () => {
    it('When job missing Then NotFoundException', async () => {
      mockJobModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.create({
          jobId,
          resourceId,
          date: '2026-01-01',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('When human missing Then NotFoundException', async () => {
      mockJobModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          assignedResources: [{ type: 'Human', resourceId }],
        }),
      });
      mockHumanModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.create({ jobId, resourceId, date: '2026-01-01' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('When human not assigned to job Then BadRequestException', async () => {
      mockJobModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ assignedResources: [] }),
      });
      mockHumanModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: resourceId }),
      });

      await expect(
        service.create({ jobId, resourceId, date: '2026-01-01' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('When valid Then creates attendance', async () => {
      mockJobModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          assignedResources: [{ type: 'Human', resourceId }],
        }),
      });
      mockHumanModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: resourceId }),
      });
      const created = { _id: 'att1' };
      mockAttendanceModel.create.mockResolvedValue(created);

      const out = await service.create({
        jobId,
        resourceId,
        date: '2026-01-15T12:00:00.000Z',
        checkIn: '08:00',
        checkOut: '17:00',
        status: 'present',
      });

      expect(out).toBe(created);
      expect(mockAttendanceModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          checkIn: '08:00',
          checkOut: '17:00',
          status: 'present',
        }),
      );
    });

    it('When duplicate key Then BadRequestException', async () => {
      mockJobModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          assignedResources: [{ type: 'Human', resourceId }],
        }),
      });
      mockHumanModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: resourceId }),
      });
      mockAttendanceModel.create.mockRejectedValue({ code: 11000 });

      await expect(
        service.create({ jobId, resourceId, date: '2026-01-01' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByJob', () => {
    it('When job does not exist Then NotFoundException', async () => {
      mockJobModel.exists.mockResolvedValue(null);

      await expect(service.findByJob(jobId)).rejects.toThrow(NotFoundException);
    });

    it('When job exists Then returns list', async () => {
      mockJobModel.exists.mockResolvedValue({ _id: jobId });
      const rows = [{ _id: '1' }];
      mockExec.mockResolvedValue(rows);

      const out = await service.findByJob(jobId);
      expect(out).toEqual(rows);
      expect(mockAttendanceModel.find).toHaveBeenCalled();
    });
  });

  describe('findByResource', () => {
    it('When human missing Then NotFoundException', async () => {
      mockHumanModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findByResource(resourceId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('When human exists Then returns list', async () => {
      mockHumanModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: resourceId }),
      });
      const rows = [{ _id: '2' }];
      mockExec.mockResolvedValue(rows);

      const out = await service.findByResource(resourceId);
      expect(out).toEqual(rows);
    });
  });
});
