import { afterEach, describe, expect, it, vi } from "vitest";
import { generateTasksFromProject } from "../geminiTasks";
import type { Project } from "../types";

const project: Project = {
  _id: "p1",
  name: "Test",
  description: "d",
  type: "Construction",
  status: "En cours",
};

describe("generateTasksFromProject", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("When HTTP error Then throws with message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: "fail", details: { x: 1 } }),
      }),
    );

    await expect(generateTasksFromProject(project)).rejects.toThrow(/fail/);
  });

  it("When no tasks Then throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ tasks: [] }),
      }),
    );

    await expect(generateTasksFromProject(project)).rejects.toThrow(
      /Aucune tâche/,
    );
  });

  it("When ok Then normalizes tasks", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          tasks: [
            {
              title: "T",
              description: "D",
              duration: 2,
              priority: "HIGH",
              status: "À faire",
              progress: 0,
              startDate: "2026-01-01T00:00:00",
              endDate: "2026-01-10",
              dependsOnIndices: [0, 1],
            },
          ],
          meta: { taskCount: 1 },
        }),
      }),
    );

    const out = await generateTasksFromProject(project);
    expect(out.tasks).toHaveLength(1);
    expect(out.tasks[0].startDate).toBe("2026-01-01");
    expect(out.tasks[0].endDate).toBe("2026-01-10");
    expect(out.tasks[0].dependsOnIndices).toEqual([0, 1]);
    expect(out.meta?.taskCount).toBe(1);
  });
});
