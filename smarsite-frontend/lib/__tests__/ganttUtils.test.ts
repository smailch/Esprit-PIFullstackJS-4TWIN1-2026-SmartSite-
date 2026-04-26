import { describe, expect, it } from "vitest";
import {
  MS_PER_DAY,
  calculateGridLayout,
  formatDate,
  getCriticalPath,
  getTaskIcon,
  getTaskPosition,
  mapBackendTasksToCritical,
  priorityToColor,
  progressToColor,
  statusToColor,
  toDate,
  truncateGanttTitle,
} from "../ganttUtils";
import type { BackendTask } from "../types";

describe("ganttUtils", () => {
  describe("toDate", () => {
    it("accepts valid Date", () => {
      const d = new Date("2026-01-15");
      expect(toDate(d)).toBe(d);
    });
    it("rejects invalid Date instance", () => {
      expect(() => toDate(new Date("invalid"))).toThrow(/Invalid Date/);
    });
    it("parses ISO string", () => {
      expect(toDate("2026-01-15").toISOString().slice(0, 10)).toBe("2026-01-15");
    });
  });

  describe("calculateGridLayout", () => {
    it("computes columns for week zoom", () => {
      const layout = calculateGridLayout("2026-01-01", "2026-01-14", "week");
      expect(layout.numColumns).toBeGreaterThanOrEqual(1);
      expect(layout.daysPerCell).toBe(7);
      expect(layout.tickDates.length).toBe(layout.numColumns + 1);
    });
  });

  describe("getTaskPosition", () => {
    it("positions bar", () => {
      const start = new Date("2026-01-01T00:00:00.000Z");
      const pos = getTaskPosition(
        {
          startDate: new Date("2026-01-03T00:00:00.000Z"),
          durationDays: 2,
          rowIndex: 1,
        },
        start,
        "day",
      );
      expect(pos.x).toBeGreaterThanOrEqual(0);
      expect(pos.width).toBeGreaterThanOrEqual(4);
      expect(pos.y).toBeGreaterThan(0);
    });
  });

  describe("getCriticalPath", () => {
    it("returns empty for empty input", () => {
      expect(getCriticalPath([])).toEqual([]);
    });
    it("returns single task", () => {
      expect(getCriticalPath([{ id: "a", durationDays: 3 }])).toEqual(["a"]);
    });
    it("returns longest chain", () => {
      const path = getCriticalPath([
        { id: "a", durationDays: 2 },
        { id: "b", durationDays: 5, dependsOn: ["a"] },
        { id: "c", durationDays: 1, dependsOn: ["b"] },
      ]);
      expect(path).toEqual(["a", "b", "c"]);
    });
    it("returns empty on cycle", () => {
      expect(
        getCriticalPath([
          { id: "a", durationDays: 1, dependsOn: ["b"] },
          { id: "b", durationDays: 1, dependsOn: ["a"] },
        ]),
      ).toEqual([]);
    });
  });

  describe("mapBackendTasksToCritical", () => {
    it("maps ids and duration", () => {
      const tasks = [
        {
          _id: "1",
          title: "t",
          projectId: "p",
          duration: 0,
          priority: "LOW" as const,
          status: "À faire" as const,
          progress: 0,
          createdAt: "",
          dependsOn: ["x"],
        },
      ] as unknown as BackendTask[];
      const out = mapBackendTasksToCritical(tasks);
      expect(out[0]).toMatchObject({ id: "1", durationDays: 1, dependsOn: ["x"] });
    });
  });

  describe("formatDate", () => {
    it("formats day zoom", () => {
      const s = formatDate("2026-06-15", "day");
      expect(s.length).toBeGreaterThan(3);
    });
    it("formats week zoom", () => {
      expect(formatDate("2026-06-15", "week")).toMatch(/^Sem\./);
    });
    it("formats month zoom", () => {
      expect(formatDate("2026-06-15", "month")).toMatch(/2026/);
    });
  });

  describe("priorityToColor / statusToColor", () => {
    it("maps priority", () => {
      expect(priorityToColor("HIGH")).toMatch(/^#/);
      expect(priorityToColor("MEDIUM")).toMatch(/^#/);
      expect(priorityToColor("LOW")).toMatch(/^#/);
    });
    it("maps status", () => {
      expect(statusToColor("Terminé")).toMatch(/^#/);
      expect(statusToColor("En cours")).toMatch(/^#/);
      expect(statusToColor("À faire")).toMatch(/^#/);
    });
  });

  describe("progressToColor", () => {
    it("clamps and returns hex", () => {
      expect(progressToColor(-5)).toMatch(/^#[0-9a-f]{6}$/i);
      expect(progressToColor(150)).toMatch(/^#[0-9a-f]{6}$/i);
      expect(progressToColor(50)).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  describe("truncateGanttTitle", () => {
    it("leaves short titles", () => {
      expect(truncateGanttTitle("ab", 10)).toBe("ab");
    });
    it("truncates long titles", () => {
      expect(truncateGanttTitle("abcdefghijkl", 5)).toContain("…");
    });
  });

  describe("getTaskIcon", () => {
    it("returns emoji from keywords", () => {
      expect(getTaskIcon("Peinture façade")).toBe("🎨");
      expect(getTaskIcon("fondation béton")).toBe("🧱");
      expect(getTaskIcon("random task")).toBe("🔨");
    });
  });

  it("MS_PER_DAY is one day in ms", () => {
    expect(MS_PER_DAY).toBe(86400000);
  });
});
