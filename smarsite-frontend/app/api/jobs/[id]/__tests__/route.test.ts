import { describe, expect, it } from "vitest";
import { GET, DELETE } from "../route";

const params1 = Promise.resolve({ id: "1" });
const params404 = Promise.resolve({ id: "999999" });

describe("api/jobs/[id]", () => {
  it("GET 200 pour un job existant", async () => {
    const res = await GET(
      new Request("http://localhost/api/jobs/1"),
      { params: params1 },
    );
    expect(res.status).toBe(200);
  });

  it("GET 404 si id inconnu", async () => {
    const res = await GET(
      new Request("http://localhost/api/jobs/999999"),
      { params: params404 },
    );
    expect(res.status).toBe(404);
  });

  it("DELETE 404 si id inconnu", async () => {
    const res = await DELETE(
      new Request("http://localhost"),
      { params: params404 },
    );
    expect(res.status).toBe(404);
  });
});
