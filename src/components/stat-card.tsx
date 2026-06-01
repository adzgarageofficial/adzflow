import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-2xl bg-card border border-border shadow-soft p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-accent grid place-items-center">
          <Icon className="h-[18px] w-[18px] text-primary" />
        </div>
      </div>
      {delta && (
        <p className="mt-3 text-xs font-medium text-emerald-600">{delta} vs last period</p>
      )}
    </motion.div>
  );
}
