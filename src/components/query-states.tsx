import { AlertCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ── Table Skeleton ───────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
      <div className="px-6 py-3 bg-secondary/60 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1 max-w-[120px]" />
        ))}
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center px-6 py-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className={`h-4 flex-1 ${j === 0 ? "max-w-[80px]" : j === cols - 1 ? "max-w-[60px] ml-auto" : "max-w-[140px]"}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Card Grid Skeleton ───────────────────────────────────────────────────────
export function CardGridSkeleton({
  count = 6,
  cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  cols?: string;
}) {
  return (
    <div className={`grid ${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card shadow-soft p-5 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <Skeleton className="h-7 w-3/5" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// ── KPI / Stat Skeleton ──────────────────────────────────────────────────────
export function KpiSkeleton({ count = 4, cols = "grid-cols-2 md:grid-cols-4" }: { count?: number; cols?: string }) {
  return (
    <div className={`grid ${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card shadow-soft p-5 space-y-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

// ── Row List Skeleton (for card-row lists) ───────────────────────────────────
export function RowListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card shadow-soft p-4 flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ── Query Error ──────────────────────────────────────────────────────────────
export function QueryError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-10 text-center space-y-3">
      <AlertCircle className="h-8 w-8 text-rose-400 mx-auto" />
      <div className="text-sm font-semibold text-rose-700">Hindi ma-load ang data</div>
      {message && (
        <div className="text-xs text-rose-500 max-w-sm mx-auto font-mono">{message}</div>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg border border-rose-300 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Subukan ulit
        </button>
      )}
    </div>
  );
}
