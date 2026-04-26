import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { JobsService } from './jobs.service';
import { Job } from './jobs.schema';
import { JobProgress } from './schemas/job-progress.schema';
import { Resource } from '../resources/schemas/resource.schema';
import { Equipment } from '../equipment-resources/schemas/equipment.schema';
import { Human } from '../human-resources/schemas/human.schema';
import { asFindByIdQuery, mockLeanExec } from '../test-helpers/mongoose-mock';
import { PROGRESS_UPLOAD_DIR } from './multer-progress.config';
import { join } from 'path';

jest.mock('fs/promises', () => ({
  unlink: jest.fn().mockResolvedValue(undefined),
}));

const { unlink } = require('fs/promises') as { unlink: jest.Mock };

const taskIdStr = '507f1f77bcf86cd799439011';
const humanIdStr = '507f1f77bcf86cd799439012';
const equipmentIdStr = '507f1f77bcf86cd799439013';

function jobModelWithConstructor(save: jest.Mock) {
  const Ctor: any = function (
    this: { save: jest.Mock; [k: string]: unknown },
    data: object,
  ) {
    Object.assign(this, data);
    this.save = save;
  };
  Ctor.find = jest.fn();
  Ctor.findById = jest.fn();
  Ctor.findByIdAndUpdate = jest.fn();
  Ctor.findByIdAndDelete = jest.fn();
  Ctor.exists = jest.fn();
  return Ctor;
}

async function buildJobsService(deps: {
  jobModel?: object;
  jobProgressModel?: object;
  humanModel?: object;
  equipmentModel?: object;
}): Promise<JobsService> {
  const mod = await Test.createTestingModule({
    providers: [
      JobsService,
      { provide: getModelToken(Job.name), useValue: deps.jobModel ?? {} },
      {
        provide: getModelToken(JobProgress.name),
        useValue: deps.jobProgressModel ?? {},
      },
      { provide: getModelToken(Resource.name), useValue: {} },
      {
        provide: getModelToken(Equipment.name),
        useValue: deps.equipmentModel ?? { findById: jest.fn() },
      },
      {
        provide: getModelToken(Human.name),
        useValue: deps.humanModel ?? { findById: jest.fn() },
      },
    ],
  }).compile();
  return mod.get<JobsService>(JobsService);
}

describe('JobsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('Given valid DTO and existing Human+Equipment When create Then save resolves and assigned names are resolved', async () => {
      const save = jest
        .fn()
        .mockResolvedValue({ _id: new Types.ObjectId(), title: 'T1' });
      const jobModel = jobModelWithConstructor(save);
      const service = await buildJobsService({
        jobModel,
        humanModel: {
          findById: jest
            .fn()
            .mockReturnValue(
              asFindByIdQuery({ firstName: 'Jane', lastName: 'Doe' }),
            ),
        },
        equipmentModel: {
          findById: jest
            .fn()
            .mockReturnValue(
              asFindByIdQuery({ _id: equipmentIdStr, name: 'Crane' }),
            ),
        },
      });
      const out = await service.create({
        taskId: taskIdStr,
        title: 'T1',
        startTime: '2026-01-01T10:00:00.000Z',
        endTime: '2026-01-02T10:00:00.000Z',
        status: 'Planifié',
        assignedResources: [
          { resourceId: humanIdStr, type: 'Human' },
          { resourceId: equipmentIdStr, type: 'Equipment' },
        ],
      });
      expect(save).toHaveBeenCalled();
      expect(out).toBeDefined();
    });

    it('Given missing Human id When create Then throws BadRequestException', async () => {
      const save = jest.fn();
      const service = await buildJobsService({
        jobModel: jobModelWithConstructor(save),
        humanModel: {
          findById: jest.fn().mockReturnValue(asFindByIdQuery(null)),
        },
        equipmentModel: { findById: jest.fn() },
      });
      await expect(
        service.create({
          taskId: taskIdStr,
          title: 'T',
          startTime: '2026-01-01T10:00:00.000Z',
          endTime: '2026-01-02T10:00:00.000Z',
          assignedResources: [{ resourceId: humanIdStr, type: 'Human' }],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('Given no jobs When findAll Then returns []', async () => {
      const jm: any = jobModelWithConstructor(jest.fn());
      jm.find = jest.fn().mockReturnValue(mockLeanExec([]));
      const service = await buildJobsService({
        jobModel: jm,
        jobProgressModel: { find: jest.fn().mockReturnValue(mockLeanExec([])) },
      });
      const out = await service.findAll();
      expect(out).toEqual([]);
    });

    it('Given jobs and progress When findAll Then progressPercentage is computed', async () => {
      const j1 = new Types.ObjectId();
      const start = new Date('2026-01-01');
      const end = new Date('2026-01-02');
      const jobDoc = {
        _id: j1,
        taskId: new Types.ObjectId(),
        title: 'J',
        startTime: start,
        endTime: end,
        assignedResources: [],
      };
      const jm: any = jobModelWithConstructor(jest.fn());
      jm.find = jest.fn().mockReturnValue(mockLeanExec([jobDoc]));
      const progress = {
        jobId: j1,
        steps: [
          { step: 'Préparation', completed: true, date: new Date() },
          { step: 'Exécution', completed: false, date: new Date() },
          { step: 'Finalisation', completed: false, date: new Date() },
        ],
      };
      const service = await buildJobsService({
        jobModel: jm,
        jobProgressModel: {
          find: jest.fn().mockReturnValue(mockLeanExec([progress])),
        },
      });
      const out = await service.findAll();
      expect(out[0].progressPercentage).toBe(33);
    });
  });

  describe('findOne', () => {
    it('Given missing id When findOne Then NotFoundException', async () => {
      const jm: any = jobModelWithConstructor(jest.fn());
      jm.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const service = await buildJobsService({ jobModel: jm });
      await expect(service.findOne('bad')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('Given existing id When findOne Then returns job', async () => {
      const job = { _id: 'x', title: 'T' };
      const jm: any = jobModelWithConstructor(jest.fn());
      jm.findById = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(job) });
      const service = await buildJobsService({ jobModel: jm });
      const out = await service.findOne('x');
      expect(out).toEqual(job);
    });
  });

  describe('update / remove', () => {
    it('Given no document When update Then NotFoundException', async () => {
      const jm: any = jobModelWithConstructor(jest.fn());
      jm.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      const service = await buildJobsService({ jobModel: jm });
      await expect(service.update('id', { title: 'x' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('When remove Then calls deleteMany on progress', async () => {
      const del = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockResolvedValue({}) });
      const jm: any = jobModelWithConstructor(jest.fn());
      jm.findByIdAndDelete = jest.fn().mockResolvedValue({ _id: '1' });
      const service = await buildJobsService({
        jobModel: jm,
        jobProgressModel: { deleteMany: del },
      });
      await service.remove('507f1f77bcf86cd79943901a');
      expect(del).toHaveBeenCalled();
    });

    it('Given nothing deleted When remove Then NotFoundException', async () => {
      const jm: any = jobModelWithConstructor(jest.fn());
      jm.findByIdAndDelete = jest.fn().mockResolvedValue(null);
      const service = await buildJobsService({
        jobModel: jm,
        jobProgressModel: { deleteMany: jest.fn() },
      });
      await expect(
        service.remove('507f1f77bcf86cd79943901a'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('getJobProgress', () => {
    it('Given no progress document When getJobProgress Then creates and returns 0%', async () => {
      const oid = new Types.ObjectId();
      const created = {
        jobId: oid,
        steps: [
          { step: 'Préparation', completed: false, date: new Date() },
          { step: 'Exécution', completed: false, date: new Date() },
          { step: 'Finalisation', completed: false, date: new Date() },
        ],
      };
      const jm: any = jobModelWithConstructor(jest.fn());
      jm.exists = jest.fn().mockResolvedValue({ _id: oid });
      const jpm: any = {
        find: jest.fn(),
        findOne: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
        create: jest.fn().mockResolvedValue(created),
      };
      const service = await buildJobsService({
        jobModel: jm,
        jobProgressModel: jpm,
      });
      const res = await service.getJobProgress(oid.toString());
      expect(res.percentage).toBe(0);
      expect(jpm.create).toHaveBeenCalled();
    });
  });

  describe('updateJobProgress', () => {
    it('Given empty steps array When updateJobProgress Then BadRequestException', async () => {
      const jobId = '507f1f77bcf86cd7994390aa';
      const oid = new Types.ObjectId(jobId);
      const doc = {
        jobId: oid,
        steps: [
          { step: 'Préparation', completed: false, date: new Date() },
          { step: 'Exécution', completed: false, date: new Date() },
          { step: 'Finalisation', completed: false, date: new Date() },
        ],
        set: jest.fn(),
        save: jest.fn().mockResolvedValue(undefined),
      };
      const jm: any = jobModelWithConstructor(jest.fn());
      jm.exists = jest.fn().mockResolvedValue({ _id: oid });
      const jpm: any = {
        find: jest.fn(),
        findOne: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(doc) }),
        create: jest.fn(),
      };
      const service = await buildJobsService({
        jobModel: jm,
        jobProgressModel: jpm,
      });
      await expect(
        service.updateJobProgress(jobId, { steps: [] }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('uploadProgressPhoto', () => {
    it('Given step index out of range When uploadProgressPhoto Then BadRequest', async () => {
      const jobId = '507f1f77bcf86cd7994390ab';
      const oid = new Types.ObjectId(jobId);
      const doc = {
        jobId: oid,
        steps: [
          { step: 'A', completed: false, date: new Date() },
          { step: 'B', completed: false, date: new Date() },
          { step: 'C', completed: false, date: new Date() },
        ],
        set: jest.fn(),
        save: jest.fn().mockResolvedValue(undefined),
      };
      const jm: any = jobModelWithConstructor(jest.fn());
      jm.exists = jest.fn().mockResolvedValue({ _id: oid });
      const jpm: any = {
        findOne: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(doc) }),
      };
      const service = await buildJobsService({
        jobModel: jm,
        jobProgressModel: jpm,
      });
      const analysis = {
        dangerLevel: 'LOW' as const,
        detectedObjects: [] as string[],
        safetyStatus: { helmet: true, vest: true },
        message: 'ok',
      };
      await expect(
        service.uploadProgressPhoto(jobId, 5, '/uploads/progress/x', analysis),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('removeProgressPhoto', () => {
    it('Given photo on step When removeProgressPhoto Then unlinks file', async () => {
      const jobId = '507f1f77bcf86cd7994390ac';
      const oid = new Types.ObjectId(jobId);
      const doc = {
        jobId: oid,
        steps: [
          {
            step: 'A',
            completed: true,
            date: new Date(),
            photoUrl: '/uploads/progress/p.png',
          },
          { step: 'B', completed: false, date: new Date() },
          { step: 'C', completed: false, date: new Date() },
        ],
        set: jest.fn(),
        save: jest.fn().mockResolvedValue(undefined),
      };
      const jm: any = jobModelWithConstructor(jest.fn());
      jm.exists = jest.fn().mockResolvedValue({ _id: oid });
      const jpm: any = {
        findOne: jest
          .fn()
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(doc) }),
      };
      const service = await buildJobsService({
        jobModel: jm,
        jobProgressModel: jpm,
      });
      await service.removeProgressPhoto(jobId, 0);
      expect(unlink).toHaveBeenCalledWith(join(PROGRESS_UPLOAD_DIR, 'p.png'));
    });
  });
});
