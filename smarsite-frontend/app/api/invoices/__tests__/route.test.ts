import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "../route";

describe("GET /api/invoices", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        text: async () => JSON.stringify([{ _id: "1" }]),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("proxifie la liste factures depuis le backend", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([{ _id: "1" }]);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/invoices$/),
    );
  });
});

describe("POST /api/invoices", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        status: 201,
        text: async () => JSON.stringify({ ok: true }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("transmet le corps au backend", async () => {
    const body = { title: "Inv" };
    const req = new Request("http://localhost/api/invoices", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(fetch).toHaveBeenCalled();
  });
});
