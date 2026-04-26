import { describe, expect, it, vi, afterEach } from "vitest";
import { createConversationId } from "../conversationId";

describe("createConversationId", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("préfixe le résultat de randomUUID", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    vi.stubGlobal("crypto", { randomUUID: () => uuid });
    expect(createConversationId()).toBe(`conv_${uuid}`);
  });

  it("repli heuristique si randomUUID absent", () => {
    vi.stubGlobal("crypto", {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    const id = createConversationId();
    expect(id).toMatch(/^conv_\d+_[a-z0-9]+$/);
  });
});
