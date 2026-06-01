import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { peso } from "@/lib/mock-data";
import { Banknote, CreditCard, Link2, Smartphone, Building2 } from "lucide-react";

export const Route = createFileRoute("/_app/payments")({ component: Payments });

const methods = [
  { name: "Cash", vol: 184200, share: 36, icon: Banknote },
  { name: "GCash", vol: 142800, share: 28, icon: Smartphone },
  { name: "Card", vol: 96400, share: 19, icon: CreditCard },
  { name: "Maya", vol: 48200, share: 9, icon: Smartphone },
  { name: "Bank Transfer", vol: 28600, share: 5, icon: Building2 },
  { name: "Payment Links", vol: 16400, share: 3, icon: Link2 },
];

function Payments() {
  return (
    <PageShell title="Payments" subtitle="All payment methods, one view.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map((m) => (
          <div key={m.name} className="rounded-2xl bg-card border border-border shadow-soft p-5">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-accent grid place-items-center">
                <m.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{m.share}%</span>
            </div>
            <p className="mt-3 text-sm font-medium text-muted-foreground">{m.name}</p>
            <p className="text-xl font-semibold tracking-tight">{peso(m.vol)}</p>
            <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-gradient-red" style={{ width: `${m.share}%` }} />
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
