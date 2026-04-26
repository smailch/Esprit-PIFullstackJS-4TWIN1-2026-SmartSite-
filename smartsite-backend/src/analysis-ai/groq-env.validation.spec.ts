import { validateGroqEnv } from './groq-env.validation';

describe('validateGroqEnv', () => {
  it('When keys valid Then merges with config', () => {
    const base = { OTHER: 'x', GROQ_API_KEY: ' k ', GROQ_MODEL: 'custom' };
    const out = validateGroqEnv(base);
    expect(out.GROQ_API_KEY).toBe('k');
    expect(out.GROQ_MODEL).toBe('custom');
    expect(out.OTHER).toBe('x');
    expect(out.GROQ_TIMEOUT_MS).toBe(10_000);
  });

  it('When GROQ_API_KEY missing Then empty string is allowed', () => {
    const out = validateGroqEnv({});
    expect(out.GROQ_API_KEY).toBe('');
  });

  it('When invalid timeout Then throws', () => {
    expect(() =>
      validateGroqEnv({ GROQ_API_KEY: 'a', GROQ_TIMEOUT_MS: 0 }),
    ).toThrow(/Invalid environment/);
  });
});
