import { describe, expect, it } from "vitest";
import { cn } from "../utils";

describe("cn", () => {
  it("fusionne les classes et résout les conflits Tailwind (dernière gagne)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("accepte les chaînes conditionnelles", () => {
    expect(cn("base", false && "hidden", "block")).toBe("base block");
  });
});
