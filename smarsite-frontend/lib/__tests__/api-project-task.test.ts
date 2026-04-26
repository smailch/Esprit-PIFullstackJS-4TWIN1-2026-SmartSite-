import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getApiBaseUrl,
  getProjectsKey,
  getTasksKey,
  getTasksByProjectKey,
  getTaskKey,
  getProjects,
  createTask,
  createProject,
  deleteTask,
} from "@/lib/api";
import { ApiError } from "@/lib/types";

describe("api — Project & Task SWR keys", () => {
  it("getProjectsKey() returns /projects", () => {
    expect(getProjectsKey()).toBe("/projects");
  });
  it("getTasksKey() returns /tasks", () => {
    expect(getTasksKey()).toBe("/tasks");
  });
  it("getTaskKey(id) embeds id", () => {
    expect(getTaskKey("abc")).toBe("/tasks/abc");
  });
  it("getTasksByProjectKey(projectId) returns nested path", () => {
    expect(getTasksByProjectKey("p1")).toBe("/tasks/projects/p1");
  });
});

describe("api — fetch projects/tasks (mocked fetch)", () => {
  const origEnv = { ...process.env };
  const origFetch = globalThis.fetch;

  beforeEach(() => {
    process.env = { ...origEnv, NODE_ENV: "development" };
    delete process.env.NEXT_PUBLIC_API_URL;
    globalThis.fetch = vi.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    process.env = origEnv;
    globalThis.fetch = origFetch;
    vi.restoreAllMocks();
  });

  it("When getProjects returns 200 Then parses JSON list", async () => {
    const payload = [{ _id: "1", name: "P" }];
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify(payload), { status: 200, headers: { "Content-Type": "application/json" } }),
    );
    const out = await getProjects();
    expect(out).toEqual(payload);
    expect(globalThis.fetch).toHaveBeenCalled();
    const url = String((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(url).toContain("/api-backend/projects");
  });

  it("When createTask is called Then POST with JSON body", async () => {
    const task = { _id: "t1", title: "T" };
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify(task), { status: 200, headers: { "Content-Type": "application/json" } }),
    );
    const out = await createTask({
      title: "T",
      projectId: "507f1f77bcf86cd799439011",
      duration: 1,
      priority: "MEDIUM",
      status: "À faire",
      progress: 0,
      description: "",
      spentBudget: 0,
      assignedTo: "",
      startDate: "",
      endDate: "",
      dependsOn: [],
    });
    expect(out).toEqual(task);
    const init = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1] as RequestInit;
    expect(init?.method).toBe("POST");
  });

  it("When createProject is called Then POST /projects", async () => {
    const p = { _id: "p1" };
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify(p), { status: 201, headers: { "Content-Type": "application/json" } }),
    );
    const out = await createProject({
      name: "N",
      description: "",
      startDate: "2026-01-01",
      status: "En cours",
      type: "Construction",
      createdBy: "507f1f77bcf86cd799439011",
      clientId: "507f1f77bcf86cd799439012",
    });
    expect(out).toEqual(p);
  });

  it("When API returns 400 Then throws ApiError with status", async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ message: "Invalid" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
    await expect(getProjects()).rejects.toBeInstanceOf(ApiError);
  });

  it("getApiBaseUrl in development without env uses proxy path", () => {
    expect(getApiBaseUrl()).toBe("/api-backend");
  });
});

describe("getApiBaseUrl — production safety", () => {
  it("When NODE_ENV is production and URL missing Then throws", () => {
    const orig = { ...process.env };
    process.env.NODE_ENV = "production";
    delete process.env.NEXT_PUBLIC_API_URL;
    expect(() => getApiBaseUrl()).toThrow(/NEXT_PUBLIC_API_URL/);
    process.env = orig;
  });
});
