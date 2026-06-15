import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { peso, useOrders, useProducts } from "@/lib/db";
import { Globe, ShoppingCart, TrendingUp, Clock3 } from "lucide-react";
import { KpiSkeleton, QueryError } from "@/components/query-states";

export const Route = createFileRoute("/_app/ecommerce")({ component: Ecommerce });

const STATUS_META: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  archived: "bg-zinc-200 text-zinc-600",
  out_of_stock: "bg-rose-100 text-rose-700",
};

function Ecommerce() {
  const { data: orders = [], isLoading, isError, error, refetch } = useOrders();
  const { data: products = [] } = useProducts();

  const m = useMemo(() => {
    const onlineOrders = (orders as any[]).filter((o) => o.channel === "ecommerce");
    const onlineRevenue = onlineOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const pending = onlineOrders.filter((o) => o.status === "pending" || o.status === "partial").length;
    const liveListings = (products as any[]).filter((p) => p.status === "active").length;

    return { onlineOrders, onlineRevenue, pending, liveListings };
  }, [orders, products]);

  const stats = [
    { label: "Online Revenue", value: peso(m.onlineRevenue), icon: TrendingUp },
    { label: "Online Orders", value: m.onlineOrders.length, icon: ShoppingCart },
    { label: "Live Listings", value: m.liveListings, icon: Globe },
    { label: "Pending Fulfillment", value: m.pending, icon: Clock3 },
  ];

  const listings = (products as any[]).filter((p) => p.status === "active").slice(0, 6);

  return (
    <PageShell title="Ecommerce" subtitle="Manage your online storefront, listings, and fulfillment.">
      {isError && <QueryError message={(error as Error)?.message} onRetry={refetch} />}
      {isLoading ? (
        <KpiSkeleton count={4} cols="grid-cols-2 md:grid-cols-4" />
      ) : (
      <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border shadow-soft p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border shadow-soft p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold tracking-tight">Recent Online Orders</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Orders placed through the ecommerce channel</p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium py-2">Order #</th>
                <th className="text-left font-medium py-2">Customer</th>
                <th className="text-left font-medium py-2">Date</th>
                <th className="text-left font-medium py-2">Status</th>
                <th className="text-right font-medium py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {m.onlineOrders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No online orders yet.</td></tr>
              ) : m.onlineOrders.slice(0, 8).map((o: any) => (
                <tr key={o.id}>
                  <td className="py-3 font-medium">{o.order_number}</td>
                  <td className="py-3">{o.customer?.full_name ?? "Walk-in"}</td>
                  <td className="py-3 text-muted-foreground">{(o.created_at ?? "").slice(0, 10)}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                      o.status === "paid" || o.status === "completed"
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold">{peso(Number(o.total))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold tracking-tight mb-3">Live Listings</h3>
        {listings.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border shadow-soft p-10 text-center text-sm text-muted-foreground">
            No active listings yet — activate products in Inventory to show them here.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {listings.map((p: any) => (
              <div key={p.id} className="rounded-2xl bg-card border border-border shadow-soft p-5">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="h-12 w-12 rounded-xl object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-secondary grid place-items-center text-lg font-bold text-muted-foreground">
                    {p.name?.[0] ?? "?"}
                  </div>
                )}
                <div className="mt-3 font-semibold truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.category?.name ?? p.brand?.name ?? "Uncategorized"}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold">{peso(Number(p.retail_price ?? p.base_price))}</span>
                  <span className={`text-xs rounded-full px-2.5 py-0.5 capitalize ${STATUS_META[p.status] ?? STATUS_META.draft}`}>
                    {p.status?.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </>
      )}
    </PageShell>
  );
}
