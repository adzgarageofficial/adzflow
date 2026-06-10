import { createFileRoute } from "@tanstack/react-router";
import adzLogo from "@/assets/adz-logo.png";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, PackageCheck, PackageX, PackageMinus, Boxes } from "lucide-react";

// Unlisted page — reachable only by knowing this exact URL.
// Share the link directly with the owner and sales staff; it isn't linked
// from anywhere inside the app and needs no account or password to open.
export const Route = createFileRoute("/stock-check-4bb144df5336")({ component: StockCheckPage });

type Row = {
  id: string;
  sku: string;
  name: string;
  brand: string | null;
  category: string | null;
  image_url: string | null;
  quantity_available: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
};

const STATUS_META: Record<Row["status"], { label: string; icon: any; cls: string }> = {
  in_stock: { label: "Available", icon: PackageCheck, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  low_stock: { label: "Low stock", icon: PackageMinus, cls: "text-amber-700 bg-amber-50 border-amber-200" },
  out_of_stock: { label: "Out of stock", icon: PackageX, cls: "text-rose-700 bg-rose-50 border-rose-200" },
};

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function StockCheckPage() {
  const [query, setQuery] = useState("");
  const search = useDebounced(query.trim(), 300);

  const { data: rows = [], isLoading, isFetching } = useQuery<Row[]>({
    queryKey: ["public_stock_lookup", search],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("public_stock_lookup", { p_search: search || null });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  return (
    <div className="min-h-screen w-full bg-surface px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="text-center mb-6">
          <img src={adzLogo} alt="ADZ Garage" className="mx-auto h-12 w-12 rounded-2xl object-cover" />
          <h1 className="mt-3 text-2xl font-bold tracking-tight">Stock Check</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search a part name or SKU to see if it's currently available — for ADZ Garage owner & sales use only.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-soft p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a product name or SKU…"
              className="h-11 pl-9"
            />
          </div>

          <div className="mt-4 space-y-2">
            {isLoading || (isFetching && rows.length === 0 && search) ? (
              <p className="text-sm text-muted-foreground text-center py-8">Checking stock…</p>
            ) : !search ? (
              <div className="text-center py-10 text-muted-foreground">
                <Boxes className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start typing to check item availability.</p>
              </div>
            ) : rows.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No matching item found.</p>
            ) : (
              rows.map((r) => {
                const meta = STATUS_META[r.status];
                const Icon = meta.icon;
                return (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    {r.image_url ? (
                      <img src={r.image_url} alt="" className="h-11 w-11 rounded-lg object-cover border border-border shrink-0" />
                    ) : (
                      <div className="h-11 w-11 rounded-lg bg-secondary grid place-items-center shrink-0">
                        <Boxes className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{r.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.sku}{r.brand ? ` · ${r.brand}` : ""}{r.category ? ` · ${r.category}` : ""}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${meta.cls}`}>
                      <Icon className="h-3.5 w-3.5" />
                      {meta.label}
                      {r.status !== "out_of_stock" && <span className="opacity-70">· {r.quantity_available} pc</span>}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          This link is for internal use only — please don't share it outside the team.
        </p>
      </div>
    </div>
  );
}
