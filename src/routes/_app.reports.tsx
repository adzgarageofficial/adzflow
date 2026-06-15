import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { ReportsPanel } from "@/components/reports-panel";

export const Route = createFileRoute("/_app/reports")({ component: Reports });

function Reports() {
  return (
    <PageShell title="Reports" subtitle="Live exports across sales, inventory, jobs, finance & HR.">
      <ReportsPanel />
    </PageShell>
  );
}
