import { describe, expect, it } from "vitest";
import { isTaskLate } from "../taskLate";
import type { BackendTask } from "../types";

describe("isTaskLate", () => {
  const now = new Date("2026-06-15T12:00:00.000Z");

  it("retourne false si la tâche est Terminée", () => {
    const t: Pick<BackendTask, "endDate" | "status"> = {
      status: "Terminé",
      endDate: "2020-01-01",
    };
    expect(isTaskLate(t, now)).toBe(false);
  });

  it("retourne false si pas de date de fin", () => {
    const t: Pick<BackendTask, "endDate" | "status"> = {
      status: "En cours",
      endDate: undefined,
    };
    expect(isTaskLate(t, now)).toBe(false);
  });

  it("retourne true si la fin est passée et le statut n'est pas Terminé", () => {
    const t: Pick<BackendTask, "endDate" | "status"> = {
      status: "En cours",
      endDate: "2026-01-01T00:00:00.000Z",
    };
    expect(isTaskLate(t, now)).toBe(true);
  });

  it("retourne false si la fin est dans le futur", () => {
    const t: Pick<BackendTask, "endDate" | "status"> = {
      status: "En cours",
      endDate: "2027-01-01",
    };
    expect(isTaskLate(t, now)).toBe(false);
  });
});
