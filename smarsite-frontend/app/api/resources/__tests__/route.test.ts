import { describe, expect, it } from "vitest";
import { GET, POST } from "../route";

describe("api/resources", () => {
  it("GET retourne les ressources", async () => {
    const res = await GET(new Request("http://localhost/api/resources"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("GET filtre par type", async () => {
    const res = await GET(
      new Request("http://localhost/api/resources?type=Human"),
    );
    const data = await res.json();
    expect(data.every((r: { type: string }) => r.type === "Human")).toBe(true);
  });

  it("POST 400 si nom manquant", async () => {
    const res = await POST(
      new Request("http://localhost/api/resources", {
        method: "POST",
        body: JSON.stringify({ type: "Human" }),
        headers: { "Content-Type": "application/json" },
      }),
    );
    expect(res.status).toBe(400);
  });
});
