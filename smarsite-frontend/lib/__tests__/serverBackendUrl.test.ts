import { afterEach, describe, expect, it, vi } from "vitest";
import { getServerBackendBaseUrl } from "../serverBackendUrl";

describe("getServerBackendBaseUrl", () => {
  afterEach(() => {
    delete process.env.INTERNAL_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  it("utilise INTERNAL_API_URL en priorité", () => {
    process.env.INTERNAL_API_URL = "https://api.example.com/";
    expect(getServerBackendBaseUrl()).toBe("https://api.example.com");
  });

  it("retombe sur NEXT_PUBLIC_API_URL", () => {
    process.env.NEXT_PUBLIC_API_URL = "http://127.0.0.1:9999";
    expect(getServerBackendBaseUrl()).toBe("http://127.0.0.1:9999");
  });

  it("repli local si aucune variable", () => {
    expect(getServerBackendBaseUrl()).toBe("http://127.0.0.1:3200");
  });
});
