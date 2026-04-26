import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  const mockService = {
    create: jest.fn(),
    findAllForRequestUser: jest.fn(),
    findOne: jest.fn(),
    assertRequestCanAccessProject: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const adminReq = {
    user: { sub: '65cfa1a7cf3f4e38dc1db100', roleName: 'Admin' },
  };
  const clientReq = {
    user: { sub: '65cfa1a7cf3f4e38dc1db101', roleName: 'Client' },
  };
  const badReq = {
    user: { roleName: 'Admin' } as { sub?: string; roleName?: string },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [{ provide: ProjectsService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ProjectsController);
  });

  describe('Given a valid JWT payload', () => {
    it('When Client creates project Then ForbiddenException', () => {
      expect(() =>
        controller.create(clientReq, {
          name: 'A',
          type: 'Construction',
          createdBy: 'x',
          clientId: 'y',
        } as never),
      ).toThrow(ForbiddenException);
    });

    it('When create without createdBy Then BadRequestException', () => {
      expect(() =>
        controller.create(adminReq, {
          name: 'A',
          type: 'Construction',
          clientId: '65cfa1a7cf3f4e38dc1db102',
        } as never),
      ).toThrow(BadRequestException);
    });

    it('When Admin creates with createdBy Then service.create is called', async () => {
      mockService.create.mockResolvedValue({ _id: '1' });
      const dto = {
        name: 'N',
        type: 'Construction' as const,
        createdBy: '65cfa1a7cf3f4e38dc1db103',
        clientId: '65cfa1a7cf3f4e38dc1db104',
      };
      const out = await controller.create(adminReq, dto as never);
      expect(out).toEqual({ _id: '1' });
      expect(mockService.create).toHaveBeenCalled();
    });

    it('When findAll Then delegates to findAllForRequestUser', async () => {
      mockService.findAllForRequestUser.mockResolvedValue([]);
      const r = await controller.findAll(adminReq);
      expect(r).toEqual([]);
      expect(mockService.findAllForRequestUser).toHaveBeenCalledWith({
        sub: '65cfa1a7cf3f4e38dc1db100',
        roleName: 'Admin',
      });
    });

    it('When findOne Then asserts access and returns project', async () => {
      mockService.assertRequestCanAccessProject.mockResolvedValue({});
      mockService.findOne.mockResolvedValue({ name: 'P' });
      const p = await controller.findOne(adminReq, '65cfa1a7cf3f4e38dc1db200');
      expect(p).toMatchObject({ name: 'P' });
    });

    it('When Client updates Then ForbiddenException', () => {
      expect(() =>
        controller.update(clientReq, '65cfa1a7cf3f4e38dc1db200', {
          name: 'X',
        } as never),
      ).toThrow(ForbiddenException);
    });

    it('When Client removes Then ForbiddenException', () => {
      expect(() =>
        controller.remove(clientReq, '65cfa1a7cf3f4e38dc1db200'),
      ).toThrow(ForbiddenException);
    });
  });

  describe('Given invalid auth payload (no sub)', () => {
    it('When create Then BadRequestException', () => {
      expect(() =>
        controller.create(badReq, {
          name: 'A',
          type: 'Construction',
          createdBy: '65cfa1a7cf3f4e38dc1db103',
          clientId: '65cfa1a7cf3f4e38dc1db104',
        } as never),
      ).toThrow(BadRequestException);
    });
  });
});
