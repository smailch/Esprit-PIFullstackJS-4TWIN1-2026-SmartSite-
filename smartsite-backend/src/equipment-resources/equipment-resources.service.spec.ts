import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { EquipmentService } from './equipment-resources.service';
import { Equipment } from './schemas/equipment.schema';
import { asFindByIdQuery } from '../test-helpers/mongoose-mock';

function buildEquipmentService(equipmentModel: object) {
  return Test.createTestingModule({
    providers: [
      EquipmentService,
      { provide: getModelToken(Equipment.name), useValue: equipmentModel },
    ],
  }).compile();
}

describe('EquipmentService', () => {
  it('When create Then save returns equipment', async () => {
    const saved = { _id: '1', name: 'Excavator' };
    const save = jest.fn().mockResolvedValue(saved);
    const Ctor: any = function (
      this: { save: typeof save } & object,
      d: object,
    ) {
      Object.assign(this, d);
      this.save = save;
    };
    const mod = await buildEquipmentService(Ctor);
    const service = mod.get<EquipmentService>(EquipmentService);
    const out = await service.create({
      name: 'Excavator',
      availability: true,
    } as any);
    expect(save).toHaveBeenCalled();
    expect(out.name).toBe('Excavator');
  });

  it('When findAll Then returns list', async () => {
    const list = [{ name: 'E1' }];
    const find = jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(list) });
    const mod = await buildEquipmentService({
      find,
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    });
    const service = mod.get<EquipmentService>(EquipmentService);
    const out = await service.findAll();
    expect(out).toEqual(list);
  });

  it('Given missing id When findOne Then NotFoundException', async () => {
    const mod = await buildEquipmentService({
      find: jest.fn(),
      findById: jest.fn().mockReturnValue(asFindByIdQuery(null)),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    });
    const service = mod.get<EquipmentService>(EquipmentService);
    await expect(service.findOne('bad')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('When update returns null Then NotFoundException', async () => {
    const mod = await buildEquipmentService({
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
      findByIdAndDelete: jest.fn(),
    });
    const service = mod.get<EquipmentService>(EquipmentService);
    await expect(service.update('x', { name: 'N' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('When remove succeeds Then returns message', async () => {
    const mod = await buildEquipmentService({
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn().mockResolvedValue({ _id: '1' }),
    });
    const service = mod.get<EquipmentService>(EquipmentService);
    const out = await service.remove('507f1f77bcf86cd799439011');
    expect(out.message).toContain('deleted');
  });

  it('When remove and null Then NotFoundException', async () => {
    const mod = await buildEquipmentService({
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn().mockResolvedValue(null),
    });
    const service = mod.get<EquipmentService>(EquipmentService);
    await expect(service.remove('x')).rejects.toBeInstanceOf(NotFoundException);
  });
});
