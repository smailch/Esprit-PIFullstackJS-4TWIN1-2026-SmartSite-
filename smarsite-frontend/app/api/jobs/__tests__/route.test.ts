import { describe, expect, it } from "vitest";
import { GET, POST } from "../route";

describe("api/jobs", () => {
  it("GET retourne le store jobs", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("POST 400 si champs requis manquants", async () => {
    const res = await POST(
      new Request("http://localhost/api/jobs", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(res.status).toBe(400);
  });
});
