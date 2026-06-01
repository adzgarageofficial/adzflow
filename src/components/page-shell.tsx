import { Topbar } from "@/components/topbar";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

export function PageShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <Topbar title={title} subtitle={subtitle} />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex-1 p-4 md:p-8"
      >
        {actions && <div className="mb-5 flex items-center justify-end gap-2 flex-wrap">{actions}</div>}
        {children}
      </motion.main>
    </>
  );
}
