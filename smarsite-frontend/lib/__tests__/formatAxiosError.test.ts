import { describe, expect, it } from "vitest";
import { formatAxiosError } from "../formatAxiosError";

describe("formatAxiosError", () => {
  it("When message is string Then returns it", () => {
    expect(
      formatAxiosError({
        response: { data: { message: "Not found" } },
      }),
    ).toBe("Not found");
  });

  it("When message is array Then joins", () => {
    expect(
      formatAxiosError({
        response: { data: { message: ["a", "", "b"] } },
      }),
    ).toBe("a · b");
  });

  it("When no response Then uses ax.message", () => {
    expect(formatAxiosError({ message: "network" })).toBe("network");
  });

  it("When empty Then Request failed", () => {
    expect(formatAxiosError({})).toBe("Request failed");
  });
});
