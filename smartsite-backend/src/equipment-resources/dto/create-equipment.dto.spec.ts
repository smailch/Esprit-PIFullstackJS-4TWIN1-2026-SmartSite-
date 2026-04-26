import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateEquipmentDto } from './create-equipment.dto';

describe('CreateEquipmentDto (validation)', () => {
  it('Given name only When validate Then no errors (optional fields)', async () => {
    const dto = plainToInstance(CreateEquipmentDto, { name: 'Pelle' });
    const errs = await validate(dto);
    expect(errs).toHaveLength(0);
  });

  it('Given missing name When validate Then error', async () => {
    const dto = plainToInstance(CreateEquipmentDto, {});
    const errs = await validate(dto);
    expect(errs.length).toBeGreaterThan(0);
  });
});
