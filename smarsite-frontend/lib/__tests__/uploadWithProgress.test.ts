import axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { postFormDataWithUploadProgress } from "../uploadWithProgress";

vi.mock("axios", () => ({
  default: { post: vi.fn() },
}));

vi.mock("../api", () => ({
  getApiBaseUrl: () => "http://localhost:3200",
  getAuthHeaderInit: () => ({ Authorization: "Bearer x" }),
}));

describe("postFormDataWithUploadProgress", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns response data and calls onUploadProgress", async () => {
    const onUploadProgress = vi.fn();
    vi.mocked(axios.post).mockResolvedValue({ data: { ok: true } });

    const fd = new FormData();
    const out = await postFormDataWithUploadProgress("/upload", fd, {
      onUploadProgress,
    });

    expect(out).toEqual({ ok: true });
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3200/upload",
      fd,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer x" }),
        onUploadProgress: expect.any(Function),
      }),
    );

    const cfg = vi.mocked(axios.post).mock.calls[0][2] as {
      onUploadProgress: (ev: { loaded: number; total: number }) => void;
    };
    cfg.onUploadProgress({ loaded: 50, total: 100 });
    expect(onUploadProgress).toHaveBeenCalledWith(50);
  });

  it("wraps errors", async () => {
    vi.mocked(axios.post).mockRejectedValue({
      response: { data: { message: "nope" } },
    });

    await expect(
      postFormDataWithUploadProgress("/x", new FormData()),
    ).rejects.toThrow("nope");
  });
});
