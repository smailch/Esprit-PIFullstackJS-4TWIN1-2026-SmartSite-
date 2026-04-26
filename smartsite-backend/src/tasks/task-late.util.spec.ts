import { isTaskLateAt } from './task-late.util';

describe('isTaskLateAt', () => {
  const now = new Date('2026-04-10T12:00:00.000Z');

  it('When status is Terminé Then not late', () => {
    expect(isTaskLateAt('2026-04-01', 'Terminé', now)).toBe(false);
  });

  it('When endDate is null Then not late', () => {
    expect(isTaskLateAt(null, 'En cours', now)).toBe(false);
  });

  it('When endDate is past and not done Then late', () => {
    expect(isTaskLateAt('2026-04-01T00:00:00.000Z', 'En cours', now)).toBe(
      true,
    );
  });

  it('When endDate is in future Then not late', () => {
    expect(isTaskLateAt('2026-12-01', 'En cours', now)).toBe(false);
  });
});
