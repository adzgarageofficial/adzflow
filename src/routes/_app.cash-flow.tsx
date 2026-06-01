import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { cashFlowSeries, peso } from "@/lib/mock-data";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { StatCard } from "@/components/stat-card";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

export const Route = createFileRoute("/_app/cash-flow")({ component: CashFlow });

function CashFlow() {
  return (
    <PageShell title="Cash Flow" subtitle="Track inflow and outflow over time.">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Inflow (Month)" value={peso(420000)} delta="+14.2%" icon={ArrowDownLeft} />
        <StatCard label="Outflow (Month)" value={peso(163000)} delta="-3.1%" icon={ArrowUpRight} />
        <StatCard label="Net Position" value={peso(257000)} delta="+22.4%" icon={Wallet} />
      </div>
      <div className="rounded-2xl bg-card border border-border shadow-soft p-6 mt-6">
        <h3 className="font-semibold tracking-tight">4-Week Cash Flow</h3>
        <div className="h-[320px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashFlowSeries}>
              <defs>
                <linearGradient id="in" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.18 160)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.7 0.18 160)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="out" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.24 27)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="oklch(0.62 0.24 27)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.93 0.005 270)" vertical={false} />
              <XAxis dataKey="d" stroke="oklch(0.5 0.01 270)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.5 0.01 270)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.93 0.005 270)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="inflow" stroke="oklch(0.6 0.18 160)" strokeWidth={2.5} fill="url(#in)" />
              <Area type="monotone" dataKey="outflow" stroke="oklch(0.62 0.24 27)" strokeWidth={2.5} fill="url(#out)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageShell>
  );
}
