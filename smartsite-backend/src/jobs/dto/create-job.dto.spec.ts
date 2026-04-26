import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateJobDto, AssignedResourceDto } from '../create-job.dto';

describe('CreateJobDto / AssignedResourceDto (validation)', () => {
  it('Given complete valid payload When validate Then no errors', async () => {
    const dto = plainToInstance(CreateJobDto, {
      taskId: '507f1f77bcf86cd799439011',
      title: 'Titre',
      description: '',
      startTime: '2026-01-01T00:00:00.000Z',
      endTime: '2026-01-02T00:00:00.000Z',
      status: 'Planifié',
      assignedResources: [
        { resourceId: '507f1f77bcf86cd799439012', type: 'Human' },
      ],
    });
    const errs = await validate(dto);
    expect(errs).toHaveLength(0);
  });

  it('Given missing taskId When validate Then has errors', async () => {
    const dto = plainToInstance(CreateJobDto, {
      title: 'T',
      startTime: '2026-01-01T00:00:00.000Z',
      endTime: '2026-01-02T00:00:00.000Z',
    });
    const errs = await validate(dto);
    expect(errs.length).toBeGreaterThan(0);
  });

  it('Given invalid resource type When AssignedResourceDto Then errors', async () => {
    const dto = plainToInstance(AssignedResourceDto, {
      resourceId: '507f1f77bcf86cd799439012',
      type: 'Alien' as any,
    });
    const errs = await validate(dto);
    expect(errs.length).toBeGreaterThan(0);
  });
});
