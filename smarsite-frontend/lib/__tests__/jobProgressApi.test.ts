import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const httpMocks = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPut: vi.fn(),
  mockPost: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: httpMocks.mockGet,
      put: httpMocks.mockPut,
      post: httpMocks.mockPost,
      delete: httpMocks.mockDelete,
      interceptors: { request: { use: vi.fn() } },
    })),
  },
}));

vi.mock("../api", () => ({
  getApiBaseUrl: () => "http://localhost:3200/",
  getApiRootAbsoluteUrl: () => "http://localhost:3200",
}));

import {
  deleteProgressPhoto,
  fetchJobProgress,
  resolveProgressPhotoUrl,
  updateJobProgress,
  uploadProgressPhoto,
} from "../jobProgressApi";

describe("jobProgressApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetchJobProgress normalizes steps and aiAnalysis", async () => {
    httpMocks.mockGet.mockResolvedValue({
      data: {
        percentage: 40,
        steps: [
          { step: "a", completed: true, aiAnalysis: { dangerLevel: "INVALID" } },
        ],
      },
    });

    const out = await fetchJobProgress("jid");
    expect(out.percentage).toBe(40);
    expect(out.steps[0].aiAnalysis?.dangerLevel).toBe("LOW");
  });

  it("updateJobProgress puts steps", async () => {
    httpMocks.mockPut.mockResolvedValue({
      data: { percentage: 0, steps: [] },
    });

    await updateJobProgress("jid", [{ step: "s", completed: false }]);
    expect(httpMocks.mockPut).toHaveBeenCalledWith("/jobs/jid/progress", {
      steps: [{ step: "s", completed: false }],
    });
  });

  it("uploadProgressPhoto requires photoUrl", async () => {
    httpMocks.mockPost.mockResolvedValue({ data: {} });

    await expect(
      uploadProgressPhoto("jid", 0, new File([], "p.jpg")),
    ).rejects.toThrow(/No photo URL/);
  });

  it("uploadProgressPhoto returns normalized ai", async () => {
    httpMocks.mockPost.mockResolvedValue({
      data: {
        photoUrl: "http://x/uploads/a.jpg",
        aiAnalysis: { dangerLevel: "HIGH", message: "m" },
      },
    });

    const out = await uploadProgressPhoto("jid", 1, new File([], "p.jpg"));
    expect(out.photoUrl).toContain("uploads");
    expect(out.aiAnalysis.dangerLevel).toBe("HIGH");
  });

  it("deleteProgressPhoto", async () => {
    httpMocks.mockDelete.mockResolvedValue({ data: { steps: [], percentage: 0 } });

    const out = await deleteProgressPhoto("jid", 2);
    expect(out.steps).toEqual([]);
  });

  describe("resolveProgressPhotoUrl", () => {
    it("returns undefined for empty", () => {
      expect(resolveProgressPhotoUrl(undefined)).toBeUndefined();
    });

    it("rewrites absolute uploads URL with api root", () => {
      expect(
        resolveProgressPhotoUrl("http://host:3200/uploads/x/y.jpg"),
      ).toBe("http://localhost:3200/uploads/x/y.jpg");
    });
  });
});
