import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { GROUPS, DASHBOARD, MY_WORKSPACE } from "@/components/app-sidebar";
import { useRbac } from "@/lib/rbac";
import { useCustomers, useOrders, useProducts, useJobOrders, peso } from "@/lib/db";
import { ShoppingBag, Users, Wrench, Package } from "lucide-react";

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  const { can } = useRbac();
  const [query, setQuery] = useState("");

  const { data: products = [] } = useProducts();
  const { data: customers = [] } = useCustomers();
  const { data: orders = [] } = useOrders();
  const { data: jobs = [] } = useJobOrders();

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const navItems = useMemo(() => {
    const all = [DASHBOARD, MY_WORKSPACE, ...GROUPS.flatMap((g) => g.items)];
    return all.filter((i) => can(i.mod, "view"));
  }, [can]);

  const go = (url: string) => {
    onOpenChange(false);
    navigate({ to: url });
  };

  const q = query.trim().toLowerCase();
  const matchedProducts = q ? (products as any[]).filter((p) => p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)).slice(0, 5) : [];
  const matchedCustomers = q ? (customers as any[]).filter((c) => c.full_name?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)).slice(0, 5) : [];
  const matchedOrders = q ? (orders as any[]).filter((o) => o.order_number?.toLowerCase().includes(q)).slice(0, 5) : [];
  const matchedJobs = q ? (jobs as any[]).filter((j) => j.job_number?.toLowerCase().includes(q) || j.vehicle?.plate_number?.toLowerCase().includes(q)).slice(0, 5) : [];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search products, orders, customers, job orders, or jump to a page…" value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {matchedProducts.length > 0 && (
          <CommandGroup heading="Products">
            {matchedProducts.map((p) => (
              <CommandItem key={p.id} value={`product-${p.id}-${p.name}-${p.sku}`} onSelect={() => go("/products")}>
                <Package className="mr-2 h-4 w-4" />
                <span className="truncate">{p.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{p.sku} · {peso(Number(p.retail_price ?? p.base_price))}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {matchedCustomers.length > 0 && (
          <CommandGroup heading="Customers">
            {matchedCustomers.map((c) => (
              <CommandItem key={c.id} value={`customer-${c.id}-${c.full_name}-${c.phone}`} onSelect={() => go("/customers")}>
                <Users className="mr-2 h-4 w-4" />
                <span className="truncate">{c.full_name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{c.phone ?? c.email ?? ""}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {matchedOrders.length > 0 && (
          <CommandGroup heading="Orders">
            {matchedOrders.map((o) => (
              <CommandItem key={o.id} value={`order-${o.id}-${o.order_number}`} onSelect={() => go("/orders")}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span className="truncate">{o.order_number}</span>
                <span className="ml-auto text-xs text-muted-foreground">{o.customer?.full_name ?? "Walk-in"} · {peso(Number(o.total))}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {matchedJobs.length > 0 && (
          <CommandGroup heading="Job Orders">
            {matchedJobs.map((j) => (
              <CommandItem key={j.id} value={`job-${j.id}-${j.job_number}`} onSelect={() => go("/job-orders")}>
                <Wrench className="mr-2 h-4 w-4" />
                <span className="truncate">{j.job_number}</span>
                <span className="ml-auto text-xs text-muted-foreground">{j.customer?.full_name ?? "—"} · {j.status}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {(matchedProducts.length > 0 || matchedCustomers.length > 0 || matchedOrders.length > 0 || matchedJobs.length > 0) && (
          <CommandSeparator />
        )}

        <CommandGroup heading="Go to">
          {navItems.map((item) => (
            <CommandItem key={item.url} value={`page-${item.title}`} onSelect={() => go(item.url)}>
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
