import { describe, expect, it } from "vitest";
import { projectsStore } from "../projectsStore";

describe("projectsStore", () => {
  it("exports seed projects with ids", () => {
    expect(projectsStore.length).toBeGreaterThanOrEqual(5);
    expect(projectsStore.every((p) => p._id && p.name)).toBe(true);
  });
});
