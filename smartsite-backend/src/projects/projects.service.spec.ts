import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { getModelToken } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

const PID = 'aaaaaaaaaaaaaaaaaaaaaaaa';
const USER_ID = 'bbbbbbbbbbbbbbbbbbbbbbbb';

const mockProjectDoc = (overrides: Record<string, unknown> = {}) => ({
  _id: PID,
  name: 'Projet test',
  description: 'Description',
  startDate: null,
  endDate: null,
  status: 'En cours',
  type: 'Construction',
  budget: 10000,
  spentBudget: 0,
  location: 'Alger',
  createdBy: USER_ID,
  clientId: undefined,
  createdAt: new Date(),
  toObject: () => ({ ...mockProjectDoc(overrides) }),
  ...overrides,
});

const mockProjectModel = {
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockTasksService = {
  markAllTasksCompletedForProject: jest.fn().mockResolvedValue(0),
  deleteByProjectId: jest.fn().mockResolvedValue(0),
  recalculateProjectSpentBudget: jest.fn().mockResolvedValue(0),
};

const mockUsersService = {
  addUserProjectId: jest.fn().mockResolvedValue(undefined),
  removeUserProjectId: jest.fn().mockResolvedValue(undefined),
};

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getModelToken(Project.name), useValue: mockProjectModel },
        { provide: TasksService, useValue: mockTasksService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Given isClientRole helper', () => {
    it('When roleName is Client Then returns true', () => {
      expect(ProjectsService.isClientRole('Client')).toBe(true);
    });
    it('When roleName is undefined or other Then returns false', () => {
      expect(ProjectsService.isClientRole(undefined)).toBe(false);
      expect(ProjectsService.isClientRole('Admin')).toBe(false);
    });
  });

  describe('findAll', () => {
    it('When DB returns projects Then startDate/endDate are normalised', async () => {
      const doc = {
        ...mockProjectDoc(),
        startDate: null,
        endDate: null,
        toObject: () => ({
          ...mockProjectDoc(),
          startDate: null,
          endDate: null,
        }),
      };
      mockProjectModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([doc]),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].startDate).toBeNull();
      expect(result[0].endDate).toBeNull();
    });
  });

  describe('findAllForRequestUser', () => {
    it('When user is Client Then filters by clientId', async () => {
      const cid = new Types.ObjectId().toHexString();
      mockProjectModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockProjectDoc({ clientId: cid })]),
      });

      const result = await service.findAllForRequestUser({
        sub: cid,
        roleName: 'Client',
      });

      expect(mockProjectModel.find).toHaveBeenCalledWith({ clientId: cid });
      expect(result).toHaveLength(1);
    });

    it('When user is not Client Then delegates to findAll', async () => {
      const doc = { ...mockProjectDoc(), toObject: () => mockProjectDoc() };
      mockProjectModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([doc]),
      });

      const result = await service.findAllForRequestUser({
        sub: USER_ID,
        roleName: 'Admin',
      });

      expect(mockProjectModel.find).toHaveBeenCalledWith();
      expect(result).toHaveLength(1);
    });

    it('When client sub is invalid ObjectId Then throws', async () => {
      await expect(
        service.findAllForRequestUser({ sub: 'bad', roleName: 'Client' }),
      ).rejects.toThrow();
    });
  });

  describe('assertRequestCanAccessProject', () => {
    it('When Client accesses another users project Then ForbiddenException', async () => {
      const other = new Types.ObjectId().toHexString();
      mockProjectModel.findById.mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(
            mockProjectDoc({ clientId: new Types.ObjectId() }),
          ),
      });

      await expect(
        service.assertRequestCanAccessProject(
          { sub: other, roleName: 'Client' },
          PID,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('When Client accesses own project Then returns mapped project', async () => {
      const clientOid = new Types.ObjectId();
      mockProjectModel.findById.mockReturnValue({
        exec: jest
          .fn()
          .mockResolvedValue(mockProjectDoc({ clientId: clientOid })),
      });

      const p = await service.assertRequestCanAccessProject(
        { sub: String(clientOid), roleName: 'Client' },
        PID,
      );

      expect(p).toMatchObject({ name: 'Projet test' });
    });
  });

  describe('create', () => {
    it('When saved project has clientId Then addUserProjectId is called', async () => {
      const cid = new Types.ObjectId();
      const savedDoc = {
        ...mockProjectDoc(),
        _id: new Types.ObjectId(PID),
        clientId: cid,
        toObject: () => mockProjectDoc({ clientId: cid }),
      };
      const ProjectModelCtor = Object.assign(
        jest.fn().mockImplementation(() => ({
          save: jest.fn().mockResolvedValue(savedDoc),
        })),
        {
          find: jest.fn(),
          findById: jest.fn(),
          findByIdAndUpdate: jest.fn(),
          findByIdAndDelete: jest.fn(),
        },
      );

      const mod = await Test.createTestingModule({
        providers: [
          ProjectsService,
          { provide: getModelToken(Project.name), useValue: ProjectModelCtor },
          { provide: TasksService, useValue: mockTasksService },
          { provide: UsersService, useValue: mockUsersService },
        ],
      }).compile();
      const svc = mod.get(ProjectsService);

      await svc.create({
        name: 'P',
        type: 'Construction',
        createdBy: USER_ID,
        clientId: String(cid),
      } as import('./dto/create-project.dto').CreateProjectDto);

      expect(mockUsersService.addUserProjectId).toHaveBeenCalledWith(
        String(cid),
        String(savedDoc._id),
      );
    });
  });

  describe('findOne', () => {
    it('When project exists Then returns it', async () => {
      const doc = mockProjectDoc();
      mockProjectModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(doc),
      });

      const result = await service.findOne(PID);
      expect(result).toBeDefined();
    });

    it('When project does not exist Then NotFoundException', async () => {
      mockProjectModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(PID)).rejects.toThrow(NotFoundException);
    });

    it('When id is invalid Then BadRequestException', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow();
    });
  });

  describe('update', () => {
    beforeEach(() => {
      const existing = mockProjectDoc();
      mockProjectModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(existing),
      });
    });

    it('When patching name Then uses $set', async () => {
      const doc = mockProjectDoc({ status: 'En cours', spentBudget: 5000 });
      mockProjectModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(doc),
      });

      await service.update(PID, { name: 'Nouveau nom' });

      expect(mockProjectModel.findByIdAndUpdate).toHaveBeenCalledWith(
        PID,
        { $set: { name: 'Nouveau nom' } },
        { new: true },
      );
    });

    it('When status becomes Terminé Then markAllTasksCompletedForProject', async () => {
      const doc = mockProjectDoc({ status: 'Terminé' });
      mockProjectModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(doc),
      });

      await service.update(PID, { status: 'Terminé' });

      expect(
        mockTasksService.markAllTasksCompletedForProject,
      ).toHaveBeenCalledWith(PID);
    });

    it('When status not Terminé Then no mass-complete', async () => {
      const doc = mockProjectDoc({ status: 'En cours' });
      mockProjectModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(doc),
      });

      await service.update(PID, { status: 'En cours' });

      expect(
        mockTasksService.markAllTasksCompletedForProject,
      ).not.toHaveBeenCalled();
    });

    it('When findById finds nothing Then NotFoundException', async () => {
      mockProjectModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(PID, { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('When findByIdAndUpdate returns null Then NotFoundException', async () => {
      mockProjectModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProjectDoc()),
      });
      mockProjectModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(PID, { name: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('When project exists Then deletes tasks and project', async () => {
      const doc = mockProjectDoc();
      mockProjectModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(doc),
      });
      mockProjectModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(doc),
      });

      await service.remove(PID);

      expect(mockTasksService.deleteByProjectId).toHaveBeenCalledWith(PID);
    });

    it('When project not found Then NotFoundException', async () => {
      mockProjectModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove(PID)).rejects.toThrow(NotFoundException);
    });
  });
});
