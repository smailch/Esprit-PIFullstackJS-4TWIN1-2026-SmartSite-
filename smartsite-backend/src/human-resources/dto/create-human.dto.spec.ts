import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateHumanDto } from './create-human.dto';

describe('CreateHumanDto (validation)', () => {
  it('Given valid fields When validate Then no errors', async () => {
    const dto = plainToInstance(CreateHumanDto, {
      firstName: 'Jean',
      lastName: 'Dupont',
      cin: 'AB123456',
      birthDate: '1990-05-20T00:00:00.000Z',
      phone: '12345678',
      role: 'Ouvrier',
      availability: true,
      monthlySalaryDt: 0,
    });
    const errs = await validate(dto);
    expect(errs).toHaveLength(0);
  });

  it('Given negative monthlySalary When validate Then error', async () => {
    const dto = plainToInstance(CreateHumanDto, {
      firstName: 'Jean',
      lastName: 'Dupont',
      cin: 'AB12',
      birthDate: '1990-05-20T00:00:00.000Z',
      phone: '12345678',
      role: 'O',
      monthlySalaryDt: -1,
    });
    const errs = await validate(dto);
    expect(errs.length).toBeGreaterThan(0);
  });
});
