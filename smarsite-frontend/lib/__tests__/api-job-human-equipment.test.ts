import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getJobsKey,
  getJobKey,
  getJobProgressKey,
  createJob,
  deleteJob,
  getHumansKey,
  getHumans,
  getEquipmentsKey,
  createEquipment,
} from "@/lib/api";
import { ApiError } from "@/lib/types";

describe("api — keys (Job / Human / Equipment)", () => {
  it("getJobsKey returns /jobs", () => {
    expect(getJobsKey()).toBe("/jobs");
  });
  it("getJobKey embeds id", () => {
    expect(getJobKey("abc")).toBe("/jobs/abc");
  });
  it("getJobProgressKey returns progress path", () => {
    expect(getJobProgressKey("j1")).toBe("/jobs/j1/progress");
  });
  it("getHumansKey without role returns /humans", () => {
    expect(getHumansKey()).toBe("/humans");
  });
  it("getHumansKey with role adds query", () => {
    expect(getHumansKey("chef")).toBe("/humans?role=chef");
  });
  it("getEquipmentsKey returns /equipment", () => {
    expect(getEquipmentsKey()).toBe("/equipment");
  });
});

describe("api — fetch Job / Human / Equipment (mocked fetch)", () => {
  const origEnv = { ...process.env };
  const origFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = { ...origEnv, NODE_ENV: "development" };
    delete process.env.NEXT_PUBLIC_API_URL;
    globalThis.fetch = vi.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    process.env = origEnv;
    globalThis.fetch = origFetch;
    vi.restoreAllMocks();
  });

  it("When createJob POST Then body contains title", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ _id: "1", title: "J" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );
    await createJob({
      title: "T",
      taskId: "507f1f77bcf86cd799439011",
      startTime: "2026-01-01T00:00:00.000Z",
      endTime: "2026-01-02T00:00:00.000Z",
      description: "",
      status: "Planifié",
      assignedResources: [],
    });
    const init = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1] as RequestInit;
    expect(init?.method).toBe("POST");
    const body = JSON.parse(init?.body as string);
    expect(body.title).toBe("T");
  });

  it("When getHumans returns 200 Then parses list", async () => {
    const list = [{ _id: "h1", firstName: "A", lastName: "B" }];
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify(list), { status: 200, headers: { "Content-Type": "application/json" } }),
    );
    const out = await getHumans();
    expect(out).toEqual(list);
  });

  it("When createEquipment Then POST /equipment", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ _id: "e1", name: "Pelle" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const out = await createEquipment({ name: "Pelle", availability: true });
    expect(out.name).toBe("Pelle");
  });

  it("When deleteJob returns 204 Then resolves", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(new Response(null, { status: 204 }));
    await expect(deleteJob("j1")).resolves.toBeUndefined();
  });

  it("When API returns 500 Then ApiError", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ message: "err" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    );
    await expect(getHumans()).rejects.toBeInstanceOf(ApiError);
  });
});
