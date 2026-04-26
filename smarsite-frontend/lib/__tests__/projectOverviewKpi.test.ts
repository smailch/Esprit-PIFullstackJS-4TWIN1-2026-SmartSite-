import { describe, expect, it } from "vitest";
import {
  computeAverageProgress,
  computeTasksDoneCount,
  getBlockedTasksCount,
  getCriticalPathTaskIds,
  getOverdueTasks,
  projectBudgetDelta,
} from "../projectOverviewKpi";
import type { BackendTask, Project } from "../types";

const baseTask = (over: Partial<BackendTask>): BackendTask => ({
  _id: "t1",
  title: "T",
  projectId: "p1",
  duration: 1,
  priority: "LOW",
  status: "À faire",
  progress: 0,
  createdAt: "2020-01-01",
  ...over,
});

describe("projectOverviewKpi", () => {
  it("computeAverageProgress", () => {
    expect(computeAverageProgress([])).toBe(0);
    const tasks = [
      baseTask({ _id: "1", progress: 0 }),
      baseTask({ _id: "2", progress: 100 }),
    ];
    expect(computeAverageProgress(tasks)).toBe(50);
  });

  it("computeTasksDoneCount", () => {
    const tasks = [
      baseTask({ _id: "1", status: "Terminé" }),
      baseTask({ _id: "2", status: "En cours" }),
    ];
    expect(computeTasksDoneCount(tasks)).toEqual({ done: 1, total: 2 });
  });

  it("getOverdueTasks exclut Terminé", () => {
    const d = "2020-01-01";
    const now = new Date("2025-01-01");
    const late = getOverdueTasks(
      [baseTask({ endDate: d, status: "En cours" })],
      now,
    );
    expect(late).toHaveLength(1);
    expect(
      getOverdueTasks(
        [baseTask({ endDate: d, status: "Terminé" })],
        now,
      ),
    ).toHaveLength(0);
  });

  it("getBlockedTasksCount compte les dépendances non terminées", () => {
    const tasks: BackendTask[] = [
      baseTask({ _id: "a", status: "Terminé" }),
      baseTask({ _id: "b", status: "En cours", dependsOn: ["a"] }),
    ];
    expect(getBlockedTasksCount(tasks)).toBe(0);
    const tasks2: BackendTask[] = [
      baseTask({ _id: "a2", status: "En cours" }),
      baseTask({ _id: "b2", status: "En cours", dependsOn: ["a2"] }),
    ];
    expect(getBlockedTasksCount(tasks2)).toBe(1);
  });

  it("getCriticalPathTaskIds retourne [] sans tâches", () => {
    expect(getCriticalPathTaskIds([])).toEqual([]);
  });

  it("getCriticalPathTaskIds sur une simple chaîne", () => {
    const tasks: BackendTask[] = [
      baseTask({ _id: "x1", duration: 2, dependsOn: [] }),
      baseTask({ _id: "x2", duration: 3, dependsOn: ["x1"] }),
    ];
    const path = getCriticalPathTaskIds(tasks);
    expect(path.length).toBeGreaterThan(0);
    expect(path).toContain("x2");
  });

  it("projectBudgetDelta", () => {
    const p: Project = {
      _id: "1",
      name: "N",
      description: "d",
      startDate: "2020-01-01",
      status: "En cours",
      type: "Autre",
      createdBy: "u1",
      budget: 100,
      spentBudget: 130,
    };
    expect(projectBudgetDelta(p)).toBe(30);
    expect(projectBudgetDelta({ ...p, budget: NaN })).toBeNull();
  });
});
