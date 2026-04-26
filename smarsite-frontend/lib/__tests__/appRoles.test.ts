import { describe, expect, it } from "vitest";
import {
  labelForRole,
  normalizeRoleName,
  parseJwtRoleName,
  parseJwtSub,
  sortRegisterRoles,
  sidebarNavFilter,
} from "../appRoles";

function b64(obj: object): string {
  return btoa(JSON.stringify(obj));
}

describe("appRoles", () => {
  it("normalizeRoleName gère null et espaces", () => {
    expect(normalizeRoleName(null)).toBe("");
    expect(normalizeRoleName("  PM  ")).toBe("PM");
  });

  it("sortRegisterRoles respecte l’ordre d’inscription", () => {
    const a = { name: "Financier" as const };
    const b = { name: "Client" as const };
    const c = { name: "Zebra" as const };
    const s = sortRegisterRoles([a, b, c]);
    expect(s.map((x) => x.name)).toEqual(["Client", "Financier", "Zebra"]);
  });

  it("labelForRole retourne le libellé ou le nom tel quel", () => {
    expect(labelForRole({ name: "Client" })).toBe("Client");
    expect(labelForRole({ name: "Inconnu" })).toBe("Inconnu");
  });

  it("parseJwtRoleName et parseJwtSub décodent le payload", () => {
    const payload = { sub: "64abcf123", roleName: "Site Engineer" };
    const t = `h.${b64(payload)}.s`;
    expect(parseJwtRoleName(t)).toBe("Site Engineer");
    expect(parseJwtSub(t)).toBe("64abcf123");
  });

  it("parseJwt* retournent des valeurs vides si le token est invalide", () => {
    expect(parseJwtRoleName("bad")).toBe("");
    expect(parseJwtSub("bad")).toBe("");
  });

  it("sidebarNavFilter retourne 'all' pour Admin", () => {
    expect(sidebarNavFilter("Admin")).toBe("all");
  });

  it("sidebarNavFilter restreint le menu Client", () => {
    const f = sidebarNavFilter("Client");
    expect(f).not.toBe("all");
    if (typeof f === "function") {
      expect(f("client-dashboard" as "client-dashboard")).toBe(true);
    }
  });
});
