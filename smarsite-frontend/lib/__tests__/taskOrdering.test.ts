import { describe, expect, it } from "vitest";
import { detectCycle, orderTasksByDependencies } from "../taskOrdering";
import type { BackendTask } from "../types";

const base = (id: string, over: Partial<BackendTask> = {}): BackendTask => ({
  _id: id,
  title: "T",
  projectId: "p1",
  duration: 1,
  priority: "LOW",
  status: "À faire",
  progress: 0,
  createdAt: "2020-01-01",
  ...over,
});

describe("taskOrdering", () => {
  it("detectCycle retourne false pour graphe vide ou acyclique", () => {
    expect(detectCycle([])).toBe(false);
    const t: BackendTask[] = [
      base("a", { dependsOn: [] }),
      base("b", { dependsOn: ["a"] }),
    ];
    expect(detectCycle(t)).toBe(false);
  });

  it("orderTasksByDependencies respecte les prérequis", () => {
    const t: BackendTask[] = [
      base("x", { dependsOn: [] }),
      base("y", { dependsOn: ["x"] }),
    ];
    const o = orderTasksByDependencies(t);
    expect(o.map((x) => x._id)).toEqual(["x", "y"]);
  });
});
