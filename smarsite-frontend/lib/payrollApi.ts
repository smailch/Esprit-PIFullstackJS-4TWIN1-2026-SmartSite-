import axios from "axios";
import { getApiBaseUrl } from "./api";
import { formatAxiosError } from "./formatAxiosError";

function createClient() {
  return axios.create({
    baseURL: getApiBaseUrl(),
    headers: { "Content-Type": "application/json" },
  });
}

export type PayrollMonthlyRow = {
  humanResourceId: string;
  employeeName: string;
  role: string;
  year: number;
  month: number;
  monthlySalaryDt: number;
  joursOuvrables: number;
  joursPresentsOuvrables: number;
  joursAbsentsPointesOuvrables: number;
  joursSansPointage: number;
  tauxJournalierDt: number;
  deductionAbsencesDt: number;
  salaireNetApresAbsencesDt: number;
  primePointageDt: number;
  primeFacturationDt: number;
  totalVersementDt: number;
};

export type PayrollMonthlyResponse = {
  year: number;
  month: number;
  rows: PayrollMonthlyRow[];
};

export function payrollMonthlySwrKey(year: number, month: number) {
  return ["finance-payroll-monthly", year, month] as const;
}

export async function fetchMonthlyPayroll(
  year: number,
  month: number
): Promise<PayrollMonthlyResponse> {
  try {
    const { data } = await createClient().get<PayrollMonthlyResponse>(
      "/finance/payroll/monthly",
      { params: { year, month } }
    );
    return data;
  } catch (e) {
    throw new Error(formatAxiosError(e));
  }
}
