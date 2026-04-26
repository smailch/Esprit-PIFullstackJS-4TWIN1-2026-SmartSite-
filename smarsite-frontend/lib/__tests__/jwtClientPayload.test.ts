import { describe, expect, it } from "vitest";
import { decodeJwtPayloadLoose } from "../jwtClientPayload";

describe("decodeJwtPayloadLoose", () => {
  it("retourne null si le token est vide", () => {
    expect(decodeJwtPayloadLoose(null)).toBeNull();
    expect(decodeJwtPayloadLoose("")).toBeNull();
  });

  it("décode le payload JWT (2e segment)", () => {
    const payload = { sub: "u1", roleName: "Client", name: "Alice" };
    const t = `x.${btoa(JSON.stringify(payload))}.sig`;
    expect(decodeJwtPayloadLoose(t)).toEqual(payload);
  });

  it("retourne null en cas de JSON invalide", () => {
    const bad = "a." + btoa("not-json") + ".c";
    expect(decodeJwtPayloadLoose(bad)).toBeNull();
  });
});
