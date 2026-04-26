import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { HumanResourcesService } from './human-resources.service';
import { Human } from './schemas/human.schema';
import { asFindByIdQuery } from '../test-helpers/mongoose-mock';

function buildHumanService(humanModel: object) {
  return Test.createTestingModule({
    providers: [
      HumanResourcesService,
      { provide: getModelToken(Human.name), useValue: humanModel },
    ],
  }).compile();
}

describe('HumanResourcesService', () => {
  it('When create Then delegates to model save', async () => {
    const save = jest.fn().mockResolvedValue({ _id: '1', firstName: 'A' });
    const Ctor: any = function (
      this: { save: typeof save } & object,
      d: object,
    ) {
      Object.assign(this, d);
      this.save = save;
    };
    const mod = await buildHumanService(Ctor);
    const service = mod.get<HumanResourcesService>(HumanResourcesService);
    const out = await service.create({
      firstName: 'A',
      lastName: 'B',
      cin: 'C1',
      birthDate: '1990-01-15',
      phone: '12345678',
      role: 'Worker',
    });
    expect(save).toHaveBeenCalled();
    expect(out.firstName).toBe('A');
  });

  it('Given role filter When findAll Then queries by role', async () => {
    const find = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });
    const mod = await buildHumanService({
      find,
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    });
    const service = mod.get<HumanResourcesService>(HumanResourcesService);
    await service.findAll('  Plombier  ');
    expect(find).toHaveBeenCalledWith({ role: 'Plombier' });
  });

  it('Given no role When findAll Then finds all', async () => {
    const find = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue([]) });
    const mod = await buildHumanService({
      find,
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    });
    const service = mod.get<HumanResourcesService>(HumanResourcesService);
    await service.findAll();
    expect(find).toHaveBeenCalledWith();
  });

  it('Given id missing When findOne Then NotFoundException', async () => {
    const mod = await buildHumanService({
      find: jest.fn(),
      findById: jest.fn().mockReturnValue(asFindByIdQuery(null)),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    });
    const service = mod.get<HumanResourcesService>(HumanResourcesService);
    await expect(service.findOne('bad')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('When update and null document Then NotFoundException', async () => {
    const mod = await buildHumanService({
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
      findByIdAndDelete: jest.fn(),
    });
    const service = mod.get<HumanResourcesService>(HumanResourcesService);
    await expect(
      service.update('x', { firstName: 'A' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('When remove and nothing deleted Then NotFoundException', async () => {
    const mod = await buildHumanService({
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn().mockResolvedValue(null),
    });
    const service = mod.get<HumanResourcesService>(HumanResourcesService);
    await expect(service.remove('x')).rejects.toBeInstanceOf(NotFoundException);
  });
});
