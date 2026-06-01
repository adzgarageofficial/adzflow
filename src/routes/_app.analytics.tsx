import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { peso } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Line, LineChart, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, differenceInDays, eachDayOfInterval } from "date-fns";
import {
  CalendarIcon, TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Package, Users, Wrench, Tag, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

export const Route = createFileRoute("/_app/analytics")({ component: Analytics });

type PresetKey = "today" | "yesterday" | "7d" | "14d" | "thisMonth" | "lastMonth" | "thisYear" | "custom";

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7d", label: "Last 7 Days" },
  { key: "14d", label: "Last 2 Weeks" },
  { key: "thisMonth", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
  { key: "thisYear", label: "This Year" },
];

function rangeForPreset(key: PresetKey, custom?: DateRange): { from: Date; to: Date } {
  const now = new Date();
  switch (key) {
    case "today": return { from: now, to: now };
    case "yesterday": { const y = subDays(now, 1); return { from: y, to: y }; }
    case "7d": return { from: subDays(now, 6), to: now };
    case "14d": return { from: subDays(now, 13), to: now };
    case "thisMonth": return { from: startOfMonth(now), to: now };
    case "lastMonth": { const lm = subMonths(now, 1); return { from: startOfMonth(lm), to: endOfMonth(lm) }; }
    case "thisYear": return { from: startOfYear(now), to: now };
    case "custom": return { from: custom?.from ?? subDays(now, 6), to: custom?.to ?? now };
  }
}

// Seeded pseudo-random for deterministic mock generation
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function generateSeries(from: Date, to: Date) {
  const days = eachDayOfInterval({ start: from, end: to });
  const bucket: "hour" | "day" | "week" | "month" =
    days.length <= 1 ? "hour" : days.length <= 31 ? "day" : days.length <= 120 ? "week" : "month";

  const rand = seeded(Math.floor(from.getTime() / 86400000) + days.length * 31);

  let series: { label: string; revenue: number; orders: number }[] = [];
  if (bucket === "hour") {
    series = Array.from({ length: 24 }, (_, i) => {
      const base = 800 + Math.sin((i - 6) / 3) * 600 + rand() * 400;
      const rev = Math.max(0, Math.round(base * 60));
      return { label: `${i.toString().padStart(2, "0")}:00`, revenue: rev, orders: Math.round(rev / 1100) };
    });
  } else if (bucket === "day") {
    series = days.map((d) => {
      const weekend = d.getDay() === 0 || d.getDay() === 6 ? 1.35 : 1;
      const rev = Math.round((18000 + rand() * 22000) * weekend);
      return { label: format(d, days.length <= 14 ? "EEE d" : "MMM d"), revenue: rev, orders: Math.round(rev / 850) };
    });
  } else if (bucket === "week") {
    const weeks = Math.ceil(days.length / 7);
    series = Array.from({ length: weeks }, (_, i) => {
      const rev = Math.round(140000 + rand() * 90000);
      return { label: `W${i + 1}`, revenue: rev, orders: Math.round(rev / 870) };
    });
  } else {
    const months = Math.max(1, Math.ceil(days.length / 30));
    series = Array.from({ length: months }, (_, i) => {
      const rev = Math.round(580000 + rand() * 320000);
      return { label: format(new Date(from.getFullYear(), from.getMonth() + i, 1), "MMM"), revenue: rev, orders: Math.round(rev / 880) };
    });
  }

  const totalRevenue = series.reduce((a, b) => a + b.revenue, 0);
  const totalOrders = series.reduce((a, b) => a + b.orders, 0);
  const aov = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  // Best sellers, categories etc. scale with the range
  const scale = totalRevenue / 200000;
  const topProducts = [
    { name: "Synthetic Oil 5W-30", sold: Math.round(142 * scale), revenue: Math.round(68160 * scale) },
    { name: "Brake Pad Set — Front", sold: Math.round(38 * scale), revenue: Math.round(81700 * scale) },
    { name: "Air Filter Universal", sold: Math.round(96 * scale), revenue: Math.round(62400 * scale) },
    { name: "Spark Plug Iridium", sold: Math.round(210 * scale), revenue: Math.round(67200 * scale) },
    { name: "Car Wax Premium", sold: Math.round(54 * scale), revenue: Math.round(48060 * scale) },
  ].sort((a, b) => b.revenue - a.revenue);

  const categories = [
    { name: "Lubricants", value: Math.round(totalRevenue * 0.28) },
    { name: "Brakes", value: Math.round(totalRevenue * 0.22) },
    { name: "Electrical", value: Math.round(totalRevenue * 0.18) },
    { name: "Filters", value: Math.round(totalRevenue * 0.14) },
    { name: "Detailing", value: Math.round(totalRevenue * 0.10) },
    { name: "Other", value: Math.round(totalRevenue * 0.08) },
  ];

  const serviceRevenue = Math.round(totalRevenue * 0.34);
  const installRevenue = Math.round(totalRevenue * 0.21);
  const newCustomers = Math.max(1, Math.round(totalOrders * 0.18));
  const inventoryUnits = Math.round(totalOrders * 1.6);

  // Growth: compare first half vs second half of series
  const mid = Math.floor(series.length / 2);
  const firstHalf = series.slice(0, mid).reduce((a, b) => a + b.revenue, 0) || 1;
  const secondHalf = series.slice(mid).reduce((a, b) => a + b.revenue, 0);
  const growth = ((secondHalf - firstHalf) / firstHalf) * 100;

  return { series, bucket, totalRevenue, totalOrders, aov, topProducts, categories, serviceRevenue, installRevenue, newCustomers, inventoryUnits, growth };
}

const PIE_COLORS = [
  "oklch(0.62 0.24 27)",
  "oklch(0.70 0.18 50)",
  "oklch(0.65 0.15 200)",
  "oklch(0.60 0.18 280)",
  "oklch(0.72 0.16 145)",
  "oklch(0.55 0.05 270)",
];

function Analytics() {
  const [preset, setPreset] = useState<PresetKey>("7d");
  const [custom, setCustom] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);

  const range = useMemo(() => rangeForPreset(preset, custom), [preset, custom]);
  const data = useMemo(() => generateSeries(range.from, range.to), [range.from, range.to]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, [preset, custom?.from, custom?.to]);

  const rangeLabel = differenceInDays(range.to, range.from) === 0
    ? format(range.from, "MMM d, yyyy")
    : `${format(range.from, "MMM d")} – ${format(range.to, "MMM d, yyyy")}`;

  return (
    <PageShell
      title="Analytics"
      subtitle={`Performance insights · ${rangeLabel}`}
    >
      <div className="flex flex-wrap items-center justify-end gap-2 mb-6">
          <div className="flex flex-wrap items-center gap-1 rounded-full bg-muted/60 p-1">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => { setPreset(p.key); setCustom(undefined); }}
                className={cn(
                  "relative px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                  preset === p.key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {preset === p.key && (
                  <motion.span
                    layoutId="filterPill"
                    className="absolute inset-0 rounded-full bg-primary shadow-soft"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{p.label}</span>
              </button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("rounded-full gap-2", preset === "custom" && "border-primary text-primary")}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {preset === "custom" && custom?.from
                  ? `${format(custom.from, "MMM d")}${custom.to ? ` – ${format(custom.to, "MMM d")}` : ""}`
                  : "Custom"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={custom}
                onSelect={(r) => { setCustom(r); if (r?.from && r?.to) setPreset("custom"); }}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={preset + (custom?.from?.toISOString() ?? "")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Total Revenue" value={peso(data.totalRevenue)} delta={data.growth} icon={DollarSign} loading={loading} />
            <KpiCard label="Orders" value={data.totalOrders.toLocaleString()} delta={data.growth * 0.7} icon={ShoppingCart} loading={loading} />
            <KpiCard label="Avg. Order Value" value={peso(data.aov)} delta={data.growth * 0.4} icon={Tag} loading={loading} />
            <KpiCard label="New Customers" value={data.newCustomers.toLocaleString()} delta={data.growth * 0.9} icon={Users} loading={loading} />
          </div>

          {/* Revenue Trend */}
          <Card title="Revenue Trend" subtitle={`Bucketed by ${data.bucket}`}>
            {loading ? (
              <Skeleton className="h-[320px] w-full rounded-xl" />
            ) : data.series.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.62 0.24 27)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="oklch(0.62 0.24 27)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(0.93 0.005 270)" vertical={false} />
                    <XAxis dataKey="label" stroke="oklch(0.5 0.01 270)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.5 0.01 270)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip
                      contentStyle={{ background: "white", border: "1px solid oklch(0.93 0.005 270)", borderRadius: 12, fontSize: 12 }}
                      formatter={(v: number) => peso(v)}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="oklch(0.62 0.24 27)" strokeWidth={2.5} fill="url(#rev)" animationDuration={600} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Orders + Categories */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card title="Orders Volume" subtitle="Order count over time">
                {loading ? <Skeleton className="h-[280px] w-full rounded-xl" /> : (
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.series}>
                        <CartesianGrid stroke="oklch(0.93 0.005 270)" vertical={false} />
                        <XAxis dataKey="label" stroke="oklch(0.5 0.01 270)" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="oklch(0.5 0.01 270)" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.93 0.005 270)", borderRadius: 12, fontSize: 12 }} />
                        <Line type="monotone" dataKey="orders" stroke="oklch(0.55 0.18 250)" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} animationDuration={600} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </div>
            <Card title="Top Categories" subtitle="Revenue share">
              {loading ? <Skeleton className="h-[280px] w-full rounded-xl" /> : (
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.categories} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2} animationDuration={600}>
                        {data.categories.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.93 0.005 270)", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => peso(v)} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          </div>

          {/* Top Products + Revenue Streams */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card title="Best Selling Products" subtitle="Top performers in range">
                {loading ? <Skeleton className="h-[280px] w-full rounded-xl" /> : (
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.topProducts} layout="vertical" margin={{ left: 10 }}>
                        <CartesianGrid stroke="oklch(0.93 0.005 270)" horizontal={false} />
                        <XAxis type="number" stroke="oklch(0.5 0.01 270)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                        <YAxis dataKey="name" type="category" stroke="oklch(0.5 0.01 270)" fontSize={11} tickLine={false} axisLine={false} width={150} />
                        <Tooltip contentStyle={{ background: "white", border: "1px solid oklch(0.93 0.005 270)", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => peso(v)} />
                        <Bar dataKey="revenue" fill="oklch(0.62 0.24 27)" radius={[0, 8, 8, 0]} barSize={20} animationDuration={600} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </div>
            <div className="space-y-4">
              <MiniStat label="Service Revenue" value={peso(data.serviceRevenue)} icon={Wrench} accent="oklch(0.65 0.15 200)" loading={loading} />
              <MiniStat label="Installation Revenue" value={peso(data.installRevenue)} icon={Package} accent="oklch(0.70 0.18 50)" loading={loading} />
              <MiniStat label="Inventory Movement" value={`${data.inventoryUnits.toLocaleString()} units`} icon={Package} accent="oklch(0.60 0.18 280)" loading={loading} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </PageShell>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h3 className="font-semibold tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function KpiCard({ label, value, delta, icon: Icon, loading }: { label: string; value: string; delta: number; icon: React.ElementType; loading: boolean }) {
  const up = delta >= 0;
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-2xl bg-card border border-border shadow-soft p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <div className="h-9 w-9 rounded-xl bg-accent grid place-items-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-28 mt-3" />
      ) : (
        <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      )}
      <div className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", up ? "text-emerald-600" : "text-rose-600")}>
        {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {Math.abs(delta).toFixed(1)}% vs prev.
      </div>
    </motion.div>
  );
}

function MiniStat({ label, value, icon: Icon, accent, loading }: { label: string; value: string; icon: React.ElementType; accent: string; loading: boolean }) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: `color-mix(in oklab, ${accent} 12%, transparent)` }}>
          <Icon className="h-4 w-4" style={{ color: accent }} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          {loading ? <Skeleton className="h-5 w-24 mt-1" /> : <p className="font-semibold tabular-nums">{value}</p>}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-[320px] grid place-items-center text-sm text-muted-foreground">
      <div className="text-center">
        <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-40" />
        No data in selected range
      </div>
    </div>
  );
}