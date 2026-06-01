import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export const peso = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n || 0);

function handleErr(e: unknown, fallback = "Something went wrong") {
  const msg = (e as { message?: string })?.message ?? fallback;
  toast.error(msg);
  return msg;
}

/* ------------------------------------------------------------------ */
/* Generic table hook factory                                          */
/* ------------------------------------------------------------------ */

export function useList<T = any>(
  table: string,
  opts: { select?: string; order?: { column: string; ascending?: boolean }; filters?: (q: any) => any } = {},
  queryOpts?: Partial<UseQueryOptions<T[]>>,
) {
  const select = opts.select ?? "*";
  return useQuery<T[]>({
    queryKey: [table, select, opts.order, opts.filters?.toString()],
    queryFn: async () => {
      let q: any = (supabase as any).from(table).select(select);
      if (opts.filters) q = opts.filters(q);
      if (opts.order) q = q.order(opts.order.column, { ascending: opts.order.ascending ?? false });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as T[];
    },
    ...queryOpts,
  });
}

export function useUpsert<T extends Record<string, any>>(table: string, invalidate: string[] = [table]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<T>) => {
      const { data, error } = await (supabase as any).from(table).upsert(row).select().single();
      if (error) throw error;
      return data as unknown as T;
    },
    onSuccess: () => invalidate.forEach((k) => qc.invalidateQueries({ queryKey: [k] })),
    onError: (e) => handleErr(e),
  });
}

export function useInsert<T extends Record<string, any>>(table: string, invalidate: string[] = [table]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<T>) => {
      const { data, error } = await (supabase as any).from(table).insert(row).select().single();
      if (error) throw error;
      return data as unknown as T;
    },
    onSuccess: () => invalidate.forEach((k) => qc.invalidateQueries({ queryKey: [k] })),
    onError: (e) => handleErr(e),
  });
}

export function useUpdate<T extends Record<string, any>>(table: string, invalidate: string[] = [table]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<T> }) => {
      const { data, error } = await (supabase as any).from(table).update(patch).eq("id", id).select().single();
      if (error) throw error;
      return data as unknown as T;
    },
    onSuccess: () => invalidate.forEach((k) => qc.invalidateQueries({ queryKey: [k] })),
    onError: (e) => handleErr(e),
  });
}

export function useDelete(table: string, invalidate: string[] = [table]) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(table).delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => invalidate.forEach((k) => qc.invalidateQueries({ queryKey: [k] })),
    onError: (e) => handleErr(e),
  });
}

/* ------------------------------------------------------------------ */
/* Typed convenience hooks                                             */
/* ------------------------------------------------------------------ */

export const useProducts = () =>
  useList<any>("products", {
    select: "*, brand:brands(id,name), category:categories(id,name)",
    order: { column: "created_at", ascending: false },
  });

export const useBrands = () =>
  useList<any>("brands", { order: { column: "name", ascending: true } });

export const useCategories = () =>
  useList<any>("categories", { order: { column: "name", ascending: true } });

export const useCustomers = () =>
  useList<any>("customers", { order: { column: "created_at", ascending: false } });

export const useBranches = () =>
  useList<any>("branches", { order: { column: "name", ascending: true } });

export const useWarehouses = () =>
  useList<any>("warehouses", {
    select: "*, branch:branches(id,name)",
    order: { column: "name", ascending: true },
  });

export const useVehicles = () =>
  useList<any>("vehicles", {
    select: "*, customer:customers(id,full_name)",
    order: { column: "created_at", ascending: false },
  });

export const useOrders = () =>
  useList<any>("orders", {
    select: "*, customer:customers(id,full_name)",
    order: { column: "created_at", ascending: false },
  });

export const useJobOrders = () =>
  useList<any>("job_orders", {
    select: "*, customer:customers(id,full_name), vehicle:vehicles(id,make,model,plate_number)",
    order: { column: "created_at", ascending: false },
  });

export const useBookings = () =>
  useList<any>("bookings", {
    select: "*, customer:customers(id,full_name), vehicle:vehicles(id,make,model), service:services(id,name)",
    order: { column: "scheduled_at", ascending: false },
  });

export const useServices = () =>
  useList<any>("services", { order: { column: "name", ascending: true } });

export const useFinanceTxns = () =>
  useList<any>("finance_transactions", { order: { column: "txn_date", ascending: false } });

export const useCampaigns = () =>
  useList<any>("marketing_campaigns", { order: { column: "created_at", ascending: false } });

export const useDiscounts = () =>
  useList<any>("discounts", { order: { column: "created_at", ascending: false } });

export const useInventoryLevels = () =>
  useList<any>("inventory_levels", {
    select: "*, product:products(id,name,sku,base_price,cost_price,retail_price), warehouse:warehouses(id,name)",
  });

export const useQuotations = () =>
  useList<any>("quotations", {
    select: "*, customer:customers(id,full_name), vehicle:vehicles(id,make,model)",
    order: { column: "created_at", ascending: false },
  });

export const useSuppliers = () =>
  useList<any>("suppliers", { order: { column: "name", ascending: true } });

export const usePurchaseOrders = () =>
  useList<any>("purchase_orders", {
    select: "*, supplier:suppliers(id,name), warehouse:warehouses(id,name)",
    order: { column: "created_at", ascending: false },
  });

export const useStockMovements = () =>
  useList<any>("stock_movements", {
    select: "*, product:products(id,name,sku), warehouse:warehouses(id,name)",
    order: { column: "created_at", ascending: false },
  });

export const useStockTransfers = () =>
  useList<any>("stock_transfers", {
    select: "*",
    order: { column: "created_at", ascending: false },
  });

export const useCashDrawerSessions = () =>
  useList<any>("cash_drawer_sessions", {
    select: "*, branch:branches(id,name)",
    order: { column: "opened_at", ascending: false },
  });

export const useOrderRefunds = () =>
  useList<any>("order_refunds", {
    select: "*, order:orders(id,order_number,total)",
    order: { column: "created_at", ascending: false },
  });

/* ------------------------------------------------------------------ */
/* Phase 9: Admin & Audit                                              */
/* ------------------------------------------------------------------ */

export const useAuditLogs = () =>
  useList<any>("audit_logs", { order: { column: "created_at", ascending: false } });

export const useNotifications = () =>
  useList<any>("notifications", { order: { column: "created_at", ascending: false } });

export const useCompanySettings = () =>
  useList<any>("company_settings", { order: { column: "created_at", ascending: true } });

export const useTaxRates = () =>
  useList<any>("tax_rates", { order: { column: "rate", ascending: true } });

export const useSavedReports = () =>
  useList<any>("saved_reports", { order: { column: "created_at", ascending: false } });

export const usePurchaseOrderItems = (poId?: string) =>
  useList<any>("purchase_order_items", {
    select: "*, product:products(id,name,sku)",
    filters: poId ? (q: any) => q.eq("purchase_order_id", poId) : undefined,
  });

export const useJobOrderHistory = (jobId?: string) =>
  useList<any>("job_order_status_history", {
    order: { column: "created_at", ascending: false },
    filters: jobId ? (q: any) => q.eq("job_order_id", jobId) : undefined,
  });

export const useOrderItems = (orderId?: string) =>
  useQuery<any[]>({
    queryKey: ["order_items", orderId],
    enabled: !!orderId,
    queryFn: async () => {
      const { data, error } = await supabase.from("order_items").select("*").eq("order_id", orderId!);
      if (error) throw error;
      return data ?? [];
    },
  });

export { handleErr };

export const useProfiles = () =>
  useList<any>("profiles", {
    select: "*, branch:branches(id,name)",
    order: { column: "created_at", ascending: false },
  });

export const useUserRoles = () =>
  useList<any>("user_roles", { order: { column: "created_at", ascending: false } });

/* ------------------------------------------------------------------ */
/* HR Core                                                              */
/* ------------------------------------------------------------------ */

export const useDepartments = () =>
  useList<any>("departments", {
    select: "*, manager:employees!departments_manager_fk(id,first_name,last_name)",
    order: { column: "name", ascending: true },
  });

export const usePositions = () =>
  useList<any>("positions", {
    select: "*, department:departments(id,name)",
    order: { column: "title", ascending: true },
  });

export const useEmployees = () =>
  useList<any>("employees", {
    select:
      "*, department:departments(id,name), position:positions(id,title), branch:branches(id,name)",
    order: { column: "created_at", ascending: false },
  });

export const useEmploymentContracts = (employeeId?: string) =>
  useList<any>("employment_contracts", {
    order: { column: "start_date", ascending: false },
    filters: employeeId ? (q: any) => q.eq("employee_id", employeeId) : undefined,
  });

export const useEmployeeDocuments = (employeeId?: string) =>
  useList<any>("employee_documents", {
    order: { column: "created_at", ascending: false },
    filters: employeeId ? (q: any) => q.eq("employee_id", employeeId) : undefined,
  });

/* ------------------------------------------------------------------ */
/* Attendance / Shifts / Overtime                                      */
/* ------------------------------------------------------------------ */

export const useShifts = () =>
  useList<any>("shifts", { order: { column: "name", ascending: true } });

export const useEmployeeShifts = () =>
  useList<any>("employee_shifts", {
    select: "*, employee:employees(id,first_name,last_name,employee_number), shift:shifts(id,name,start_time,end_time)",
    order: { column: "effective_from", ascending: false },
  });

export const useAttendanceLogs = (params?: { from?: string; to?: string; employeeId?: string }) =>
  useList<any>("attendance_logs", {
    select:
      "*, employee:employees(id,first_name,last_name,employee_number,avatar_url), shift:shifts(id,name,start_time,end_time)",
    order: { column: "log_date", ascending: false },
    filters: (q: any) => {
      if (params?.from) q = q.gte("log_date", params.from);
      if (params?.to) q = q.lte("log_date", params.to);
      if (params?.employeeId) q = q.eq("employee_id", params.employeeId);
      return q;
    },
  });

export const useOvertimeRequests = (status?: string) =>
  useList<any>("overtime_requests", {
    select: "*, employee:employees(id,first_name,last_name,employee_number)",
    order: { column: "ot_date", ascending: false },
    filters: status ? (q: any) => q.eq("status", status) : undefined,
  });

/* ------------------------------------------------------------------ */
/* Leave Management                                                    */
/* ------------------------------------------------------------------ */

export const useLeaveTypes = () =>
  useList<any>("leave_types", { order: { column: "name", ascending: true } });

export const useLeaveBalances = (employeeId?: string, year?: number) =>
  useList<any>("leave_balances", {
    select: "*, employee:employees(id,first_name,last_name,employee_number), leave_type:leave_types(id,code,name,color)",
    order: { column: "year", ascending: false },
    filters: (q: any) => {
      if (employeeId) q = q.eq("employee_id", employeeId);
      if (year) q = q.eq("year", year);
      return q;
    },
  });

export const useLeaveRequests = (status?: string) =>
  useList<any>("leave_requests", {
    select: "*, employee:employees(id,first_name,last_name,employee_number,avatar_url), leave_type:leave_types(id,code,name,color,is_paid)",
    order: { column: "created_at", ascending: false },
    filters: status ? (q: any) => q.eq("status", status) : undefined,
  });

/* ------------------------------------------------------------------ */
/* Payroll                                                              */
/* ------------------------------------------------------------------ */

export const usePayrollPeriods = () =>
  useList<any>("payroll_periods", { order: { column: "period_start", ascending: false } });

export const usePayslips = (periodId?: string) =>
  useList<any>("payslips", {
    select: "*, employee:employees(id,first_name,last_name,employee_number,avatar_url,basic_salary,allowance,bank_name,bank_account_number,sss_number,philhealth_number,pagibig_number,tin_number), period:payroll_periods(id,period_code,period_start,period_end,pay_date,cutoff_label)",
    order: { column: "created_at", ascending: false },
    filters: periodId ? (q: any) => q.eq("period_id", periodId) : undefined,
  });

/* ------------------------------------------------------------------ */
/* Performance Management                                              */
/* ------------------------------------------------------------------ */

export const useKpiCategories = () =>
  useList<any>("kpi_categories", { order: { column: "name", ascending: true } });

export const usePerformanceReviews = () =>
  useList<any>("performance_reviews", {
    select: "*, employee:employees(id,first_name,last_name,employee_number,avatar_url)",
    order: { column: "review_date", ascending: false },
  });

export const usePerformanceGoals = (employeeId?: string) =>
  useList<any>("performance_goals", {
    select: "*, employee:employees(id,first_name,last_name,employee_number)",
    order: { column: "created_at", ascending: false },
    filters: employeeId ? (q: any) => q.eq("employee_id", employeeId) : undefined,
  });

export const useRecognitions = () =>
  useList<any>("recognitions", {
    select: "*, employee:employees(id,first_name,last_name,employee_number,avatar_url)",
    order: { column: "awarded_at", ascending: false },
  });

/* ------------------------------------------------------------------ */
/* Recruitment                                                         */
/* ------------------------------------------------------------------ */

export const useJobPostings = () =>
  useList<any>("job_postings", {
    select: "*, department:departments(id,name), position:positions(id,title), branch:branches(id,name)",
    order: { column: "created_at", ascending: false },
  });

export const useApplicants = () =>
  useList<any>("applicants", { order: { column: "created_at", ascending: false } });

export const useApplications = () =>
  useList<any>("applications", {
    select: "*, applicant:applicants(id,first_name,last_name,email,phone,resume_url), posting:job_postings(id,title,posting_number)",
    order: { column: "applied_at", ascending: false },
  });

export const useInterviews = () =>
  useList<any>("interviews", {
    select: "*, application:applications(id,application_number,applicant:applicants(id,first_name,last_name), posting:job_postings(id,title))",
    order: { column: "scheduled_at", ascending: false },
  });

/* ------------------------------------------------------------------ */
/* Training & Certifications                                           */
/* ------------------------------------------------------------------ */

export const useTrainingPrograms = () =>
  useList<any>("training_programs", { order: { column: "title", ascending: true } });

export const useTrainingSessions = () =>
  useList<any>("training_sessions", {
    select: "*, program:training_programs(id,code,title,duration_hours)",
    order: { column: "start_date", ascending: false },
  });

export const useTrainingEnrollments = (sessionId?: string) =>
  useList<any>("training_enrollments", {
    select: "*, employee:employees(id,first_name,last_name,employee_number,avatar_url), session:training_sessions(id,session_code,program:training_programs(id,title))",
    order: { column: "enrolled_at", ascending: false },
    filters: sessionId ? (q: any) => q.eq("session_id", sessionId) : undefined,
  });

export const useCertifications = (employeeId?: string) =>
  useList<any>("certifications", {
    select: "*, employee:employees(id,first_name,last_name,employee_number)",
    order: { column: "issue_date", ascending: false },
    filters: employeeId ? (q: any) => q.eq("employee_id", employeeId) : undefined,
  });

/* ------------------------------------------------------------------ */
/* Current user roles & permission helpers                             */
/* ------------------------------------------------------------------ */

export function useCurrentUserRoles() {
  return useQuery<string[]>({
    queryKey: ["current_user_roles"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return [];
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      if (error) return [];
      return (data ?? []).map((r: any) => r.role as string);
    },
    staleTime: 60_000,
  });
}

export function useIsOwner() {
  const { data: roles = [] } = useCurrentUserRoles();
  return roles.includes("owner");
}

export function useSetUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user_id, role }: { user_id: string; role: string }) => {
      // remove existing roles for this user
      const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", user_id);
      if (delErr) throw delErr;
      const { error } = await (supabase as any).from("user_roles").insert({ user_id, role });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user_roles"] }),
    onError: (e) => handleErr(e),
  });
}

/* ------------------------------------------------------------------ */
/* Customer Experience: Loyalty, CRM, Feedback, Referrals              */
/* ------------------------------------------------------------------ */

export const useLoyaltyTiers = () =>
  useList<any>("loyalty_tiers", { order: { column: "min_points", ascending: true } });

export const useLoyaltyTransactions = (customerId?: string) =>
  useList<any>("loyalty_transactions", {
    select: "*, customer:customers(id,full_name,loyalty_points)",
    order: { column: "created_at", ascending: false },
    filters: customerId ? (q: any) => q.eq("customer_id", customerId) : undefined,
  });

export const useCustomerInteractions = (customerId?: string) =>
  useList<any>("customer_interactions", {
    select: "*, customer:customers(id,full_name,phone,email)",
    order: { column: "created_at", ascending: false },
    filters: customerId ? (q: any) => q.eq("customer_id", customerId) : undefined,
  });

export const useCustomerFeedback = () =>
  useList<any>("customer_feedback", {
    select: "*, customer:customers(id,full_name), order:orders(id,order_number)",
    order: { column: "created_at", ascending: false },
  });

export const useReferrals = () =>
  useList<any>("referrals", {
    select: "*",
    order: { column: "created_at", ascending: false },
  });