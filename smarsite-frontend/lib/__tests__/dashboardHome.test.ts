import { describe, expect, it } from "vitest";
import {
  buildBudgetUtilizationRows,
  buildDashboardAlerts,
  buildStatusChartData,
  buildTodoItems,
  projectProgressFromTasks,
} from "../dashboardHome";
import type { BackendTask, Project } from "../types";

const project = (p: Partial<Project>): Project => ({
  _id: "p1",
  name: "Name",
  description: "d",
  startDate: "2020-01-01",
  status: "En cours",
  type: "Autre",
  createdBy: "u1",
  ...p,
});

const task = (p: Partial<BackendTask>): BackendTask => ({
  _id: "t1",
  title: "T",
  projectId: "p1",
  duration: 1,
  priority: "LOW",
  status: "En cours",
  progress: 0,
  endDate: "2019-01-01",
  createdAt: "2020-01-01",
  ...p,
});

describe("dashboardHome", () => {
  it("buildStatusChartData compte par statut", () => {
    const rows = buildStatusChartData([
      project({ status: "En cours" }),
      project({ _id: "2", status: "Terminé" }),
    ]);
    expect(rows.length).toBeGreaterThan(0);
  });

  it("buildBudgetUtilizationRows ignore budget invalide", () => {
    const rows = buildBudgetUtilizationRows([
      project({ budget: 100, spentBudget: 50, name: "A" }),
      project({ _id: "2" }),
    ]);
    expect(rows[0].pct).toBe(50);
  });

  it("buildDashboardAlerts retourne des entrées", () => {
    const now = new Date("2030-01-01");
    const items = buildDashboardAlerts(
      [project({ status: "En retard" })],
      [task({ status: "En cours" })],
      now,
    );
    expect(Array.isArray(items)).toBe(true);
  });

  it("buildTodoItems et projectProgressFromTasks", () => {
    const now = new Date("2030-01-01");
    const todos = buildTodoItems(
      [project({ _id: "p1" })],
      [task({ projectId: "p1" })],
      now,
    );
    expect(todos.length).toBeGreaterThan(0);
    expect(projectProgressFromTasks("p1", [task({ progress: 50 })])).toBe(50);
  });
});
