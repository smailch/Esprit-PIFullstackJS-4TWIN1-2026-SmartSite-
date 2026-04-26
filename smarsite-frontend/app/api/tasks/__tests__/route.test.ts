import { describe, expect, it } from "vitest";
import { GET } from "../route";

describe("api/tasks", () => {
  it("GET retourne la liste mock", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
