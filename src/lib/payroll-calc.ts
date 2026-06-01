// PH Payroll Calculations (semi-monthly cutoff)
// References: SSS 2024, PhilHealth 5% (2024), Pag-IBIG 2%, BIR Train Law 2023+

export interface PayrollInput {
  basicMonthly: number;
  allowanceMonthly: number;
  daysWorked: number; // days in this cutoff
  workingDaysInPeriod: number; // expected working days in the cutoff
  overtimeHours: number;
  lateMinutes: number;
  hourlyRate?: number; // optional override
}

export interface PayrollBreakdown {
  basicPay: number;
  allowance: number;
  overtimePay: number;
  lateDeduction: number;
  grossPay: number;
  sss: number;
  philhealth: number;
  pagibig: number;
  withholdingTax: number;
  totalDeductions: number;
  netPay: number;
}

// SSS employee share (semi-monthly = half of monthly)
function sssMonthly(monthlySalary: number): number {
  // 2024 simplified: 4.5% of MSC, MSC capped at 30,000
  const msc = Math.min(Math.max(monthlySalary, 4000), 30000);
  return Math.round(msc * 0.045 * 100) / 100;
}

function philhealthMonthly(monthlySalary: number): number {
  // 2024: 5% of salary, split 50/50 between EE & ER. Floor 10k, ceiling 100k.
  const base = Math.min(Math.max(monthlySalary, 10000), 100000);
  return Math.round(base * 0.025 * 100) / 100;
}

function pagibigMonthly(monthlySalary: number): number {
  // 2% EE, MSC cap 10,000 → max 200/month
  const base = Math.min(monthlySalary, 10000);
  return Math.round(base * 0.02 * 100) / 100;
}

// BIR Withholding — semi-monthly compensation table (TRAIN Law, 2023+)
function withholdingTaxSemiMonthly(taxable: number): number {
  if (taxable <= 10417) return 0;
  if (taxable <= 16667) return (taxable - 10417) * 0.15;
  if (taxable <= 33333) return 937.5 + (taxable - 16667) * 0.2;
  if (taxable <= 83333) return 4270.7 + (taxable - 33333) * 0.25;
  if (taxable <= 333333) return 16770.7 + (taxable - 83333) * 0.3;
  return 91770.7 + (taxable - 333333) * 0.35;
}

export function computePayroll(input: PayrollInput): PayrollBreakdown {
  const basicSemi = input.basicMonthly / 2;
  const allowSemi = input.allowanceMonthly / 2;

  // Pro-rate basic by days worked vs expected working days in cutoff
  const dayRatio =
    input.workingDaysInPeriod > 0
      ? Math.min(1, input.daysWorked / input.workingDaysInPeriod)
      : 1;
  const basicPay = Math.round(basicSemi * dayRatio * 100) / 100;
  const allowance = Math.round(allowSemi * dayRatio * 100) / 100;

  const hourly =
    input.hourlyRate ??
    // assume 8 hours x ~22 working days = 176 hours/month
    input.basicMonthly / 176;
  const overtimePay = Math.round(input.overtimeHours * hourly * 1.25 * 100) / 100;
  const lateDeduction = Math.round((input.lateMinutes / 60) * hourly * 100) / 100;

  const grossPay = Math.round((basicPay + allowance + overtimePay) * 100) / 100;

  // Gov contributions: monthly amount split in half (apply on 2nd cutoff typically,
  // but for simplicity split evenly across both cutoffs)
  const sss = Math.round((sssMonthly(input.basicMonthly) / 2) * 100) / 100;
  const philhealth = Math.round((philhealthMonthly(input.basicMonthly) / 2) * 100) / 100;
  const pagibig = Math.round((pagibigMonthly(input.basicMonthly) / 2) * 100) / 100;

  const taxable = Math.max(0, grossPay - sss - philhealth - pagibig);
  const withholdingTax = Math.round(withholdingTaxSemiMonthly(taxable) * 100) / 100;

  const totalDeductions =
    Math.round((sss + philhealth + pagibig + withholdingTax + lateDeduction) * 100) / 100;
  const netPay = Math.round((grossPay - totalDeductions) * 100) / 100;

  return {
    basicPay,
    allowance,
    overtimePay,
    lateDeduction,
    grossPay,
    sss,
    philhealth,
    pagibig,
    withholdingTax,
    totalDeductions,
    netPay,
  };
}

// Count working days (Mon-Sat) between two dates inclusive
export function countWorkingDays(startISO: string, endISO: string, daysOfWeek = [1, 2, 3, 4, 5, 6]) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  let count = 0;
  const d = new Date(start);
  while (d <= end) {
    if (daysOfWeek.includes(d.getDay())) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

// Build the two semi-monthly cutoffs for a given month
export function buildSemiMonthlyPeriods(year: number, month: number) {
  // month is 0-indexed
  const lastDay = new Date(year, month + 1, 0).getDate();
  const first = {
    period_start: `${year}-${String(month + 1).padStart(2, "0")}-01`,
    period_end: `${year}-${String(month + 1).padStart(2, "0")}-15`,
    pay_date: `${year}-${String(month + 1).padStart(2, "0")}-15`,
    cutoff_label: "1st",
  };
  const second = {
    period_start: `${year}-${String(month + 1).padStart(2, "0")}-16`,
    period_end: `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
    pay_date: `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
    cutoff_label: "2nd",
  };
  return { first, second };
}