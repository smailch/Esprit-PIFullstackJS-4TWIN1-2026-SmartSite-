import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchMonthlyPayroll, payrollMonthlySwrKey } from "../payrollApi";

vi.mock("axios", () => ({
  default: { create: vi.fn() },
}));

vi.mock("../api", () => ({
  getApiBaseUrl: () => "http://localhost:3200",
}));

describe("payrollApi", () => {
  const get = vi.fn();

  beforeEach(() => {
    vi.mocked(axios.create).mockReturnValue({ get } as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("payrollMonthlySwrKey is stable", () => {
    expect(payrollMonthlySwrKey(2026, 4)).toEqual([
      "finance-payroll-monthly",
      2026,
      4,
    ]);
  });

  it("fetchMonthlyPayroll returns payload", async () => {
    const payload = { year: 2026, month: 4, rows: [] };
    get.mockResolvedValue({ data: payload });

    const out = await fetchMonthlyPayroll(2026, 4);
    expect(out).toEqual(payload);
    expect(get).toHaveBeenCalledWith("/finance/payroll/monthly", {
      params: { year: 2026, month: 4 },
    });
  });

  it("fetchMonthlyPayroll wraps axios error", async () => {
    get.mockRejectedValue({
      response: { data: { message: "bad" } },
    });

    await expect(fetchMonthlyPayroll(2026, 1)).rejects.toThrow("bad");
  });
});
