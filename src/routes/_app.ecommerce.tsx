import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { peso, products } from "@/lib/mock-data";
import { Globe, ShoppingCart, TrendingUp, Truck } from "lucide-react";

export const Route = createFileRoute("/_app/ecommerce")({ component: Ecommerce });

function Ecommerce() {
  const stats = [
    { label: "Online Revenue", value: peso(184500), icon: TrendingUp },
    { label: "Online Orders", value: 128, icon: ShoppingCart },
    { label: "Live Listings", value: products.length, icon: Globe },
    { label: "In Transit", value: 17, icon: Truck },
  ];

  return (
    <PageShell title="Ecommerce" subtitle="Manage your online storefront, listings, and fulfillment.">
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

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {products.slice(0, 6).map((p) => (
          <div key={p.id} className="rounded-2xl bg-card border border-border shadow-soft p-5">
            <div className="text-3xl">{p.emoji}</div>
            <div className="mt-3 font-semibold">{p.name}</div>
            <div className="text-xs text-muted-foreground">{p.category}</div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold">{peso(p.price)}</span>
              <span className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5">Live</span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}