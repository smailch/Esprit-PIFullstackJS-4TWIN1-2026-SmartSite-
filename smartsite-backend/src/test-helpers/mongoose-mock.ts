/**
 * Helpers for unit tests that mock Mongoose model queries (lean/exec/await).
 */
export function mockLeanExec<T>(value: T): {
  lean: () => { exec: () => Promise<T> };
} {
  return {
    lean: () => ({
      exec: jest.fn().mockResolvedValue(value),
    }),
  };
}

/** `Model.findById` — supports both `await model.findById(id)` and `.exec()`. */
export function asFindByIdQuery<T>(value: T | null) {
  const exec = jest.fn().mockResolvedValue(value);
  const p = Promise.resolve(value) as Promise<T | null>;
  return {
    exec,
    then: (
      onFulfilled: (v: T | null) => unknown,
      onRejected?: (e: unknown) => unknown,
    ) => p.then(onFulfilled, onRejected),
  };
}

export function asFindOneQuery<T>(value: T | null) {
  return asFindByIdQuery(value);
}
