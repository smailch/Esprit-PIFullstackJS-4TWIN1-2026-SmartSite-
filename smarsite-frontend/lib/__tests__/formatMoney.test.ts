import { describe, expect, it } from "vitest";
import { formatDh } from "../formatMoney";

describe("formatDh", () => {
  it("affiche un montant en euros formaté fr-FR", () => {
    expect(formatDh(1234.5)).toMatch(/1[\s\u00a0]234,5/);
    expect(formatDh(1234.5)).toContain("€");
  });

  it("traite undefined, null et non fini comme 0", () => {
    expect(formatDh(undefined)).toMatch(/0/);
    expect(formatDh(null)).toMatch(/0/);
    expect(formatDh(Number.NaN)).toMatch(/0/);
  });
});
