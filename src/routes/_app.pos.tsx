import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useProducts, useCustomers, useBranches, useOrders, peso,
  useMyProfile, useCurrentUserRoles, useDiscountApprovals, useInsert, useUpdate, useInventoryLevels, useList,
} from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search, Plus, Minus, Trash2, Banknote, Smartphone, CreditCard,
  Building2, Link2, Check, Receipt, Pause, FileText, Undo2, PlusCircle, Wrench, Hammer, Package,
  Wallet, Printer, ScanBarcode, Car, Download, ShieldCheck, ShieldAlert, ShieldQuestion, Hourglass, X, CalendarClock, Truck, ShoppingBag,
  BookmarkPlus, Upload, ImageIcon, Tag, Mail, Phone,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { downloadElementAsPdf } from "@/lib/pdf";

export const Route = createFileRoute("/_app/pos")({ component: POSPage });

function fuzzyMatch(haystack: string, query: string): boolean {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const h = haystack.toLowerCase();
  return words.every((w) => h.includes(w));
}

type CartItem = { id: string; name: string; sku: string; price: number; qty: number; custom?: boolean };
type Suspended = {
  id: string;
  label: string;
  cart: CartItem[];
  discountAmount: number;
  customerId: string;
  branchId: string;
  notes?: string;
  savedAt: number;
};

const PARK_KEY = "pos.parked.v1";
const DRAFT_KEY = "pos.drafts.v1";
const loadLS = <T,>(k: string): T[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch { return []; }
};
const saveLS = (k: string, v: any) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const methods = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "gcash", label: "GCash", icon: Smartphone },
  { id: "maya", label: "Maya", icon: Smartphone },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "bank_transfer", label: "Bank", icon: Building2 },
  { id: "other", label: "Link", icon: Link2 },
] as const;

const FULFILLMENT_TYPES = [
  { id: "takeout", label: "Takeout", icon: ShoppingBag },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "installation", label: "Ikakabit", icon: Wrench },
] as const;

const FULFILLMENT_LABELS: Record<string, string> = {
  takeout: "For Takeout",
  shipping: "For Shipping",
  installation: "For Installation",
};

function POSPage() {
  const { data: products = [] } = useProducts();
  const { data: inventoryLevels = [] } = useInventoryLevels();
  const { data: activePromos = [] } = useList<any>("promos", {
    filters: (q: any) => q.eq("is_active", true),
    order: { column: "name", ascending: true },
  });
  const { data: customers = [] } = useCustomers();
  const { data: branches = [] } = useBranches();
  const { data: recentOrders = [] } = useOrders();
  const { data: myProfile } = useMyProfile();
  const { data: myRoles = [] } = useCurrentUserRoles();
  const isApprover = myRoles.includes("owner") || myRoles.includes("admin");
  const { data: discountApprovalRows = [] } = useDiscountApprovals({ enabled: isApprover, refetchInterval: isApprover ? 15_000 : false });
  const pendingApprovals = (discountApprovalRows as any[]).filter((r) => r.status === "pending");
  const decideApproval = useUpdate<any>("discount_approvals");
  const qc = useQueryClient();

  const [query, setQuery] = useState("");
  const [showPromos, setShowPromos] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountRequestId, setDiscountRequestId] = useState<string | null>(null);
  const [requestingApproval, setRequestingApproval] = useState(false);
  const [showApprovals, setShowApprovals] = useState(false);
  const [method, setMethod] = useState<(typeof methods)[number]["id"]>("cash");
  const [fulfillment, setFulfillment] = useState<"takeout" | "shipping" | "installation">("installation");
  const [customerId, setCustomerId] = useState<string>("");
  const [branchId, setBranchId] = useState<string>("");
  const [cashReceived, setCashReceived] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [receipt, setReceipt] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const [parked, setParked] = useState<Suspended[]>([]);
  const [drafts, setDrafts] = useState<Suspended[]>([]);
  const [showParked, setShowParked] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [draftNotes, setDraftNotes] = useState("");
  const [customItem, setCustomItem] = useState({ name: "", price: "", qty: "1" });

  // Reservation
  const [showReserve, setShowReserve] = useState(false);
  const [reserveForm, setReserveForm] = useState({ customerName: "", vehicle: "", plateNumber: "", downPayment: "", notes: "" });
  const [reserveReceiptFile, setReserveReceiptFile] = useState<File | null>(null);
  const [reserveReceiptPreview, setReserveReceiptPreview] = useState<string | null>(null);
  const [reserving, setReserving] = useState(false);
  const reserveFileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Walk-in info & custom labor
  const [walkInName, setWalkInName] = useState("");
  const [walkInEmail, setWalkInEmail] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInVehicle, setWalkInVehicle] = useState("");
  const [walkInPlate, setWalkInPlate] = useState("");
  const [showCustomLabor, setShowCustomLabor] = useState(false);
  const [laborItem, setLaborItem] = useState({ name: "Labor", price: "", qty: "1" });
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  useEffect(() => { setParked(loadLS<Suspended>(PARK_KEY)); setDrafts(loadLS<Suspended>(DRAFT_KEY)); }, []);
  useEffect(() => { saveLS(PARK_KEY, parked); }, [parked]);
  useEffect(() => { saveLS(DRAFT_KEY, drafts); }, [drafts]);

  // Sum quantity across all warehouses per product
  const stockByProduct = useMemo(() => {
    const map: Record<string, number> = {};
    for (const lvl of inventoryLevels as any[]) {
      if (lvl.product_id == null) continue;
      map[lvl.product_id] = (map[lvl.product_id] ?? 0) + (lvl.quantity ?? 0);
    }
    return map;
  }, [inventoryLevels]);

  // FIFO/FEFO: earliest expiry/best-by date on hand per product, across all warehouses —
  // tires age even unsold, so the picker nudges cashiers to move the oldest batch first.
  const earliestExpiryByProduct = useMemo(() => {
    const map: Record<string, string> = {};
    for (const lvl of inventoryLevels as any[]) {
      if (!lvl.expiry_date || lvl.product_id == null) continue;
      if (!map[lvl.product_id] || lvl.expiry_date < map[lvl.product_id]) map[lvl.product_id] = lvl.expiry_date;
    }
    return map;
  }, [inventoryLevels]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = (products as any[]).filter((p) => {
      if (!q) return true;
      const haystack = [p.name, p.brand?.name].filter(Boolean).join(" ");
      return fuzzyMatch(haystack, q);
    });
    // A product is OOS only when it has inventory records that sum to ≤ 0
    const isOOS = (p: any) => p.id in stockByProduct && stockByProduct[p.id] <= 0;
    // Sort: in-stock first, OOS always at the bottom; within each group sort by FIFO expiry
    return [...matched].sort((a, b) => {
      const aOOS = isOOS(a) ? 1 : 0;
      const bOOS = isOOS(b) ? 1 : 0;
      if (aOOS !== bOOS) return aOOS - bOOS;
      const ea = earliestExpiryByProduct[a.id];
      const eb = earliestExpiryByProduct[b.id];
      if (ea && eb) return ea.localeCompare(eb);
      if (ea) return -1;
      if (eb) return 1;
      return 0;
    });
  }, [products, query, stockByProduct, earliestExpiryByProduct]);

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const requestedDiscount = Math.min(Math.max(0, Number(discountAmount) || 0), subtotal);

  // Live status of the cashier's discount-approval request (polls while pending)
  const { data: discountRequest } = useQuery<any | null>({
    queryKey: ["discount_approval", discountRequestId],
    queryFn: async () => {
      if (!discountRequestId) return null;
      const { data, error } = await (supabase as any).from("discount_approvals").select("*").eq("id", discountRequestId).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!discountRequestId,
    refetchInterval: (q) => (q.state.data?.status === "pending" ? 4000 : false),
  });
  // A request only counts once its approved amount still matches what's typed now —
  // editing the discount after approval invalidates it and requires a fresh approval.
  const approvalCurrent = !!discountRequest && Number(discountRequest.amount) === requestedDiscount && requestedDiscount > 0;
  const discountApproved = approvalCurrent && discountRequest.status === "approved";
  const discountPending = approvalCurrent && discountRequest.status === "pending";
  const discountDenied = approvalCurrent && discountRequest.status === "denied";
  const discount = discountApproved ? requestedDiscount : 0;
  const total = subtotal - discount;
  const change = Math.max(0, Number(cashReceived || 0) - total);

  // Preload cart from quotation handoff
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pos.preload");
      if (!raw) return;
      const p = JSON.parse(raw);
      if (Array.isArray(p.cart) && p.cart.length) {
        setCart(p.cart);
        if (p.customerId) setCustomerId(p.customerId);
        if (typeof p.discountAmount === "number") setDiscountAmount(p.discountAmount);
        if (p.pendingOrderId) setPendingOrderId(p.pendingOrderId);
        if (typeof p.notes === "string" && p.notes) {
          // Try to parse "Walk-in: NAME | Vehicle: MAKE | Plate: ABC123"
          const m = /Walk-in:\s*([^|]+)/.exec(p.notes);
          const v = /Vehicle:\s*([^|]+)/.exec(p.notes);
          const pl = /Plate:\s*([^|]+)/.exec(p.notes);
          if (m) setWalkInName(m[1].trim());
          if (v) setWalkInVehicle(v[1].trim());
          if (pl) setWalkInPlate(pl[1].trim());
        }
        toast.success(`Loaded ${p.label || "quotation"} into cart`);
      }
      localStorage.removeItem("pos.preload");
    } catch {}
  }, []);

  function addToCart(p: any) {
    const price = Number(p.retail_price ?? p.base_price ?? 0);
    setCart((c) => {
      const ex = c.find((x) => x.id === p.id);
      if (ex) return c.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
      return [...c, { id: p.id, name: p.name, sku: p.sku, price, qty: 1 }];
    });
  }

  function addPromoToCart(p: any) {
    const cartId = `promo-${p.id}`;
    setCart((c) => {
      const ex = c.find((x) => x.id === cartId);
      if (ex) return c.map((x) => (x.id === cartId ? { ...x, qty: x.qty + 1 } : x));
      return [...c, { id: cartId, name: `🏷 ${p.name}`, sku: "PROMO", price: Number(p.promo_price), qty: 1, custom: true }];
    });
    toast.success(`${p.name} added to cart`);
  }
  function updateQty(id: string, delta: number) {
    setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty + delta) } : x)));
  }
  function removeItem(id: string) { setCart((c) => c.filter((x) => x.id !== id)); }

  function addCustomLine(name: string, price: number, qty = 1, sku = "CUSTOM") {
    if (!name || price <= 0) return;
    setCart((c) => [...c, { id: `custom-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, name, sku, price, qty, custom: true }]);
  }
  function snapshot(label: string, notes?: string): Suspended {
    return { id: `s-${Date.now()}`, label, cart, discountAmount, customerId, branchId, notes, savedAt: Date.now() };
  }
  function resetSale() {
    setCart([]); setDiscountAmount(0); setDiscountRequestId(null); setCustomerId(""); setBranchId(""); setCashReceived("");
    setPaymentReference(""); setMethod("cash"); setFulfillment("takeout");
    setWalkInName(""); setWalkInEmail(""); setWalkInPhone(""); setWalkInVehicle(""); setWalkInPlate(""); setPendingOrderId(null);
  }
  function parkOrder() {
    if (cart.length === 0) return toast.error("Cart is empty");
    const cust = customers.find((c: any) => c.id === customerId);
    const label = cust?.full_name || `Walk-in #${parked.length + 1}`;
    setParked((p) => [snapshot(label), ...p]);
    resetSale();
    toast.success("Order parked");
  }
  function resume(s: Suspended, from: "park" | "draft") {
    setCart(s.cart); setDiscountAmount(s.discountAmount ?? 0); setDiscountRequestId(null);
    setCustomerId(s.customerId); setBranchId(s.branchId);
    if (from === "park") { setParked((p) => p.filter((x) => x.id !== s.id)); setShowParked(false); }
    else { setDrafts((d) => d.filter((x) => x.id !== s.id)); setShowDrafts(false); }
    toast.success("Resumed");
  }
  function saveDraft() {
    if (cart.length === 0) return toast.error("Cart is empty");
    const cust = customers.find((c: any) => c.id === customerId);
    const label = cust?.full_name || `Draft #${drafts.length + 1}`;
    setDrafts((d) => [snapshot(label, draftNotes), ...d]);
    setDraftNotes("");
    resetSale();
    toast.success("Draft saved");
  }

  async function requestDiscountApproval() {
    if (requestedDiscount <= 0) return toast.error("Maglagay muna ng halaga ng discount");
    setRequestingApproval(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const cust = customers.find((c: any) => c.id === customerId);
      const label = cust?.full_name || walkInName || "Walk-in customer";
      const { data: created, error } = await (supabase as any)
        .from("discount_approvals")
        .insert({
          requested_by: userRes.user?.id ?? null,
          requested_by_name: myProfile?.display_name ?? null,
          amount: requestedDiscount,
          subtotal,
          customer_label: label,
        })
        .select().single();
      if (error) throw error;
      setDiscountRequestId(created.id);
      qc.invalidateQueries({ queryKey: ["discount_approvals"] });
      await supabase.from("notifications").insert({
        title: "Discount approval needed",
        body: `${myProfile?.display_name || "Cashier"} is requesting a ${peso(requestedDiscount)} discount for ${label} (subtotal ${peso(subtotal)}).`,
        severity: "warning",
        category: "finance",
        audience_role: "owner",
        link: "/pos",
      });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Approval request sent — hintayin ang owner/admin");
    } catch (e: any) {
      toast.error(e.message ?? "Hindi naipadala ang request");
    } finally {
      setRequestingApproval(false);
    }
  }

  async function checkout() {
    if (cart.length === 0) return toast.error("Cart is empty");
    if (requestedDiscount > 0 && !discountApproved) {
      return toast.error("Kailangan munang aprubahan ng owner/admin ang discount bago mag-checkout");
    }
    if (method !== "cash" && !paymentReference.trim()) {
      return toast.error("Ilagay ang reference number / approval code ng bayad");
    }
    setProcessing(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const status = method === "cash" && Number(cashReceived || 0) >= total ? "paid" : method === "cash" ? "pending" : "paid";

      // Compose walk-in notes when no registered customer is selected
      const walkInNote = !customerId
        ? [
            walkInName && `Walk-in: ${walkInName}`,
            walkInVehicle && `Vehicle: ${walkInVehicle}`,
            walkInPlate && `Plate: ${walkInPlate}`,
          ].filter(Boolean).join(" | ")
        : "";

      // Auto-create customer from walk-in contact info so they appear in marketing lists
      let resolvedCustomerId = customerId;
      if (!customerId && walkInName.trim() && (walkInEmail.trim() || walkInPhone.trim())) {
        try {
          // Check if customer already exists by email
          let existing: any = null;
          if (walkInEmail.trim()) {
            const { data: found } = await (supabase as any)
              .from("customers").select("id").eq("email", walkInEmail.trim()).maybeSingle();
            existing = found;
          }
          if (existing) {
            resolvedCustomerId = existing.id;
            // Patch phone if missing
            if (walkInPhone.trim()) {
              await (supabase as any).from("customers")
                .update({ phone: walkInPhone.trim() }).eq("id", existing.id);
            }
          } else {
            const { data: created } = await (supabase as any).from("customers").insert({
              full_name: walkInName.trim(),
              email: walkInEmail.trim() || null,
              phone: walkInPhone.trim() || null,
            }).select("id").single();
            if (created) resolvedCustomerId = created.id;
          }
          qc.invalidateQueries({ queryKey: ["customers"] });
        } catch { /* non-blocking — order still proceeds */ }
      }

      let order: any;
      if (pendingOrderId) {
        // Pay an existing pending order — update instead of insert
        const { data: updated, error: uerr } = await supabase
          .from("orders")
          .update({
            status,
            customer_id: resolvedCustomerId || null,
            branch_id: branchId || null,
            subtotal, discount, tax: 0, total,
            amount_paid: status === "paid" ? total : 0,
            notes: walkInNote || null,
            fulfillment_type: fulfillment,
          })
          .eq("id", pendingOrderId)
          .select().single();
        if (uerr) throw uerr;
        order = updated;
      } else {
        const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
        const { data: inserted, error: oerr } = await supabase
          .from("orders")
          .insert({
            order_number: orderNumber,
            channel: "pos",
            status,
            customer_id: resolvedCustomerId || null,
            branch_id: branchId || null,
            cashier_id: userRes.user?.id ?? null,
            subtotal, discount, tax: 0, total,
            amount_paid: status === "paid" ? total : 0,
            notes: walkInNote || null,
            fulfillment_type: fulfillment,
          })
          .select().single();
        if (oerr) throw oerr;
        order = inserted;

        const items = cart.map((c) => ({
          order_id: order.id, product_id: c.custom ? null : c.id, name: c.name, sku: c.sku,
          quantity: c.qty, unit_price: c.price, line_total: c.price * c.qty,
        }));
        const { error: ierr } = await supabase.from("order_items").insert(items);
        if (ierr) throw ierr;
      }

      if (status === "paid") {
        await supabase.from("order_payments").insert({
          order_id: order.id, method, amount: total,
          reference: method !== "cash" ? paymentReference.trim() : null,
          created_by: userRes.user?.id ?? null,
        });
        // Auto-deduct inventory for paid orders
        const { error: sErr } = await supabase.rpc("adjust_stock_for_order", {
          p_order_id: order.id, p_direction: "deduct",
        });
        if (sErr) console.warn("Stock deduct failed:", sErr.message);
        qc.invalidateQueries({ queryKey: ["inventory_levels"] });
      }

      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["finance_transactions"] });
      setReceipt({
        ...order,
        items: cart.map((c) => ({ name: c.name, quantity: c.qty, line_total: c.price * c.qty })),
        change, method, fulfillment,
        walkInName, walkInVehicle, walkInPlate,
        customerName: customers.find((x: any) => x.id === resolvedCustomerId)?.full_name ?? (resolvedCustomerId !== customerId ? walkInName : undefined),
      });
      resetSale();
      toast.success(status === "pending" ? "Order saved as pending" : "Sale completed");
    } catch (e: any) {
      toast.error(e.message ?? "Checkout failed");
    } finally {
      setProcessing(false);
    }
  }

  // Barcode scanner: hardware scanners type SKU + Enter into the search field
  function handleBarcodeEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return;
    const code = query.trim();
    if (!code) return;
    const match = (products as any[]).find(
      (p) => (p.sku ?? "").toLowerCase() === code.toLowerCase() ||
             (p.barcode ?? "").toLowerCase() === code.toLowerCase(),
    );
    if (match) {
      addToCart(match);
      setQuery("");
      toast.success(`+ ${match.name}`);
    } else if (filtered.length === 1) {
      addToCart(filtered[0]);
      setQuery("");
    } else {
      toast.error(`No product for code "${code}"`);
    }
  }

  function printReceipt() {
    if (typeof window !== "undefined") window.print();
  }

  async function refundOrder(order: any, amount: number, reason: string) {
    if (amount <= 0) return toast.error("Invalid refund amount");
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const { error } = await supabase.from("finance_transactions").insert({
        direction: "out",
        category: "refund",
        amount,
        description: `Refund ${order.order_number}${reason ? ` — ${reason}` : ""}`,
        method: "cash",
        reference_type: "order",
        reference_id: order.id,
        branch_id: order.branch_id ?? null,
        created_by: userRes.user?.id ?? null,
      });
      if (error) throw error;
      // Auto-restore inventory on refund
      const { error: sErr } = await supabase.rpc("adjust_stock_for_order", {
        p_order_id: order.id, p_direction: "restore",
      });
      if (sErr) console.warn("Stock restore failed:", sErr.message);
      await supabase.from("orders").update({ status: "refunded" }).eq("id", order.id);
      qc.invalidateQueries({ queryKey: ["inventory_levels"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["finance_transactions"] });
      toast.success(`Refunded ${peso(amount)}`);
      setShowRefund(false);
    } catch (e: any) {
      toast.error(e.message ?? "Refund failed");
    }
  }

  async function decideDiscountApproval(request: any, decision: "approved" | "denied", note: string) {
    try {
      const { data: userRes } = await supabase.auth.getUser();
      await decideApproval.mutateAsync({
        id: request.id,
        patch: {
          status: decision,
          decided_by: userRes.user?.id ?? null,
          decided_by_name: myProfile?.display_name ?? null,
          decided_at: new Date().toISOString(),
          decision_note: note || null,
        },
      });
      toast.success(decision === "approved" ? "Discount approved" : "Discount request denied");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to update request");
    }
  }

  async function submitReservation() {
    if (!reserveForm.customerName.trim()) return toast.error("Ilagay ang pangalan ng customer");
    if (!reserveForm.vehicle.trim()) return toast.error("Ilagay ang sasakyan");
    if (!reserveForm.plateNumber.trim()) return toast.error("Ilagay ang plate number");
    if (cart.length === 0) return toast.error("Walang items/services sa cart");
    if (!reserveForm.downPayment || Number(reserveForm.downPayment) <= 0) return toast.error("Ilagay ang halaga ng down payment");
    if (!reserveReceiptFile) return toast.error("I-upload ang larawan ng resibo ng down payment");

    setReserving(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();

      // Upload receipt image
      const ext = reserveReceiptFile.name.split(".").pop() ?? "jpg";
      const filePath = `receipts/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("reservation-receipts")
        .upload(filePath, reserveReceiptFile, { upsert: false });
      if (upErr) throw upErr;

      const { data: pubData } = supabase.storage.from("reservation-receipts").getPublicUrl(filePath);
      const receiptUrl = pubData?.publicUrl ?? null;

      const reservationNumber = `RES-${Date.now().toString().slice(-8)}`;
      const { error: insErr } = await (supabase as any).from("reservations").insert({
        reservation_number: reservationNumber,
        customer_name: reserveForm.customerName.trim(),
        vehicle: reserveForm.vehicle.trim(),
        plate_number: reserveForm.plateNumber.trim().toUpperCase(),
        items: cart.map((c) => ({ id: c.id, name: c.name, sku: c.sku, price: c.price, qty: c.qty })),
        down_payment_amount: Number(reserveForm.downPayment),
        down_payment_receipt_url: receiptUrl,
        notes: reserveForm.notes.trim() || null,
        reserved_by: userRes.user?.id ?? null,
        reserved_by_name: myProfile?.display_name ?? null,
        status: "pending",
      });
      if (insErr) throw insErr;

      qc.invalidateQueries({ queryKey: ["reservations"] });
      await supabase.from("notifications").insert({
        title: "Bagong Reservation",
        body: `${reserveForm.customerName} ay nag-reserve ng ${cart.length} item(s). Down payment: ${peso(Number(reserveForm.downPayment))}. Plate: ${reserveForm.plateNumber.toUpperCase()}.`,
        severity: "info",
        category: "ops",
        audience_role: "owner",
        link: "/reservations",
      });
      qc.invalidateQueries({ queryKey: ["notifications"] });

      toast.success(`Reservation ${reservationNumber} saved!`);
      setShowReserve(false);
      setReserveForm({ customerName: "", vehicle: "", plateNumber: "", downPayment: "", notes: "" });
      setReserveReceiptFile(null);
      setReserveReceiptPreview(null);
      resetSale();
      navigate({ to: "/reservations" });
    } catch (e: any) {
      toast.error(e.message ?? "Hindi na-save ang reservation");
    } finally {
      setReserving(false);
    }
  }

  return (
    <PageShell title="POS" subtitle="Point of sale checkout.">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link to="/cash-drawer" className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary">
          <Wallet className="h-3.5 w-3.5" />Cash Drawer
        </Link>
        <button onClick={() => setShowParked(true)} className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary">
          <Pause className="h-3.5 w-3.5" />Parked <span className="text-muted-foreground">({parked.length})</span>
        </button>
        <button onClick={() => setShowDrafts(true)} className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary">
          <FileText className="h-3.5 w-3.5" />Drafts <span className="text-muted-foreground">({drafts.length})</span>
        </button>
        <button onClick={() => setShowRefund(true)} className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary">
          <Undo2 className="h-3.5 w-3.5" />Returns & Refunds
        </button>
        {isApprover && (
          <button onClick={() => setShowApprovals(true)} className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary">
            <ShieldCheck className="h-3.5 w-3.5" />Discount Approvals
            {pendingApprovals.length > 0 && (
              <span className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold">{pendingApprovals.length}</span>
            )}
          </button>
        )}
        <button onClick={() => setShowCustom(true)} className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary">
          <PlusCircle className="h-3.5 w-3.5" />Custom Item
        </button>
        <button onClick={() => { setLaborItem({ name: "Labor", price: "", qty: "1" }); setShowCustomLabor(true); }} className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary">
          <Hammer className="h-3.5 w-3.5" />+ Custom Labor
        </button>
        <button onClick={() => addCustomLine("Service fee", 150, 1, "SERVICE")} className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary">
          <Wrench className="h-3.5 w-3.5" />+ Service
        </button>
        <button onClick={() => addCustomLine("Installation fee", 200, 1, "INSTALL")} className="h-9 px-3 rounded-lg border border-border text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-secondary">
          <Package className="h-3.5 w-3.5" />+ Install
        </button>
        <div className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ScanBarcode className="h-3.5 w-3.5" />Barcode scanner ready — scan into search
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_600px] gap-5">
        {/* Catalog */}
        <div className="rounded-2xl bg-card border border-border shadow-soft p-4">
          {/* Tab toggle: Products / Promos */}
          <div className="flex items-center gap-1 mb-3 bg-secondary/50 rounded-xl p-1 w-fit">
            <button
              onClick={() => setShowPromos(false)}
              className={`h-8 px-4 rounded-lg text-xs font-semibold transition-colors ${!showPromos ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Products
            </button>
            <button
              onClick={() => setShowPromos(true)}
              className={`h-8 px-4 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5 ${showPromos ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Tag className="h-3.5 w-3.5" />
              Promos
              {activePromos.length > 0 && (
                <span className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {activePromos.length}
                </span>
              )}
            </button>
          </div>

          {showPromos ? (
            /* ---- PROMOS CATALOG ---- */
            activePromos.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                <Tag className="h-8 w-8 mx-auto mb-2 opacity-30" />
                Walang active promos. Gumawa sa Promotions page.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[70vh] overflow-y-auto pr-1">
                {activePromos.map((p: any) => (
                  <motion.button
                    key={p.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => addPromoToCart(p)}
                    className="text-left rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-3 hover:border-primary/40 transition"
                  >
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-24 object-cover rounded-lg mb-2 border border-border" />
                    ) : (
                      <div className="w-full h-24 rounded-lg bg-secondary/60 mb-2 flex items-center justify-center">
                        <Tag className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="text-xs font-semibold line-clamp-2">{p.name}</div>
                    {p.description && (
                      <div className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{p.description}</div>
                    )}
                    {p.inclusions?.length > 0 && (
                      <div className="mt-1.5 space-y-0.5">
                        {(p.inclusions as string[]).slice(0, 3).map((inc, i) => (
                          <div key={i} className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-primary/60 shrink-0" />
                            {inc}
                          </div>
                        ))}
                        {p.inclusions.length > 3 && (
                          <div className="text-[10px] text-muted-foreground">+{p.inclusions.length - 3} more…</div>
                        )}
                      </div>
                    )}
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-sm font-bold text-primary">{peso(Number(p.promo_price))}</span>
                      <span className="text-[11px] line-through text-muted-foreground">{peso(Number(p.original_price))}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            )
          ) : (
          /* ---- PRODUCTS CATALOG ---- */
          <>
          <div className="relative mb-4">
            <ScanBarcode className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleBarcodeEnter}
              placeholder="Search by brand, variant, size…"
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-border bg-background text-sm"
            />
          </div>
          {products.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No products yet. Add products in the Products page first.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[70vh] overflow-y-auto pr-1">
              {filtered.map((p: any) => {
                const oldestStock = earliestExpiryByProduct[p.id];
                const stock = stockByProduct[p.id] ?? 0;
                const oos = stock <= 0;
                let badgeTone = "bg-secondary text-muted-foreground border-border";
                if (oldestStock) {
                  const days = Math.round((new Date(oldestStock).getTime() - Date.now()) / 86400000);
                  badgeTone = days < 0 ? "bg-rose-50 text-rose-700 border-rose-100" : days <= 60 ? "bg-amber-50 text-amber-700 border-amber-100" : badgeTone;
                }
                return (
                <motion.button
                  key={p.id} whileTap={{ scale: 0.97 }}
                  onClick={() => addToCart(p)}
                  className={`text-left rounded-xl border p-3 transition ${
                    oos
                      ? "border-rose-100 bg-rose-50/40 opacity-60"
                      : "border-border bg-background hover:border-foreground/30"
                  }`}
                >
                  <div className="aspect-square rounded-lg bg-secondary/60 mb-2 flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
                    {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" /> : p.sku}
                  </div>
                  <div className="text-xs font-semibold line-clamp-2">{p.name}</div>
                  <div className="text-sm font-bold mt-1">{peso(Number(p.retail_price ?? p.base_price ?? 0))}</div>
                  {oos ? (
                    <div className="mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border inline-flex items-center gap-1 bg-rose-50 text-rose-600 border-rose-100">
                      <Package className="h-2.5 w-2.5 shrink-0" />Out of stock
                    </div>
                  ) : oldestStock ? (
                    <div className={`mt-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border inline-flex items-center gap-1 ${badgeTone}`} title="Sell this batch first (FIFO/FEFO) — oldest stock on hand">
                      <CalendarClock className="h-2.5 w-2.5 shrink-0" />Sell first · {new Date(oldestStock).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                    </div>
                  ) : null}
                </motion.button>
              );})}
            </div>
          )}
          </>
          )}
        </div>

        {/* Cart */}
        <div className="rounded-2xl bg-card border border-border shadow-soft p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Current Sale</h3>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
            )}
          </div>

          <div className="flex gap-2 mb-3">
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="flex-1 h-9 px-2 rounded-lg border border-border text-xs bg-background">
              <option value="">Walk-in customer</option>
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
            <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className="w-32 h-9 px-2 rounded-lg border border-border text-xs bg-background">
              <option value="">Branch</option>
              {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          {/* Walk-in details — only when no registered customer is selected */}
          {!customerId && (
            <div className="mb-3 rounded-lg border border-dashed border-amber-300 p-2.5 space-y-1.5 bg-amber-50/40">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">Walk-in details</div>
                <div className="text-[10px] text-amber-600">Email + phone → mapupunta sa marketing list</div>
              </div>
              <input value={walkInName} onChange={(e) => setWalkInName(e.target.value)}
                placeholder="Pangalan ng customer" className="w-full h-8 px-2 rounded border border-border text-xs bg-background" />
              <div className="grid grid-cols-2 gap-1.5">
                <div className="relative">
                  <Mail className="h-3 w-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={walkInEmail} onChange={(e) => setWalkInEmail(e.target.value)}
                    type="email" placeholder="Email address"
                    className={`w-full h-8 pl-6 pr-2 rounded border text-xs bg-background ${walkInName && !walkInEmail ? "border-amber-400 bg-amber-50" : "border-border"}`}
                  />
                </div>
                <div className="relative">
                  <Phone className="h-3 w-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={walkInPhone} onChange={(e) => setWalkInPhone(e.target.value)}
                    type="tel" placeholder="Phone / Mobile"
                    className={`w-full h-8 pl-6 pr-2 rounded border text-xs bg-background ${walkInName && !walkInPhone ? "border-amber-400 bg-amber-50" : "border-border"}`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="relative">
                  <Car className="h-3 w-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={walkInVehicle} onChange={(e) => setWalkInVehicle(e.target.value)}
                    placeholder="Sasakyan (e.g. Toyota Vios)" className="w-full h-8 pl-6 pr-2 rounded border border-border text-xs bg-background" />
                </div>
                <input value={walkInPlate} onChange={(e) => setWalkInPlate(e.target.value.toUpperCase())}
                  placeholder="Plate No." className="h-8 px-2 rounded border border-border text-xs bg-background font-mono uppercase" />
              </div>
            </div>
          )}

          {/* Registered customer missing contact info */}
          {customerId && (() => {
            const cust = (customers as any[]).find((c) => c.id === customerId);
            const missingEmail = !cust?.email;
            const missingPhone = !cust?.phone;
            if (!missingEmail && !missingPhone) return null;
            return (
              <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-[11px] text-amber-800 flex items-start gap-1.5">
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>
                  Customer walang {[missingEmail && "email", missingPhone && "phone"].filter(Boolean).join(" at ")} — i-update sa <b>Customers page</b> para makapasok sa marketing list.
                </span>
              </div>
            );
          })()}

          {pendingOrderId && (
            <div className="mb-3 text-[11px] rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1.5">
              Completing payment for pending order
            </div>
          )}

          <div className="flex-1 min-h-[200px] max-h-[40vh] overflow-y-auto space-y-2 mb-3">
            <AnimatePresence>
              {cart.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground py-12">No items yet</div>
              ) : cart.map((it) => (
                <motion.div key={it.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-2 rounded-lg border border-border">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{it.name}</div>
                    <div className="text-[11px] text-muted-foreground">{peso(it.price)} each</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(it.id, -1)} className="h-6 w-6 rounded border border-border inline-flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                    <span className="text-xs font-semibold w-6 text-center">{it.qty}</span>
                    <button onClick={() => updateQty(it.id, 1)} className="h-6 w-6 rounded border border-border inline-flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="text-xs font-bold w-16 text-right">{peso(it.price * it.qty)}</div>
                  <button onClick={() => removeItem(it.id)} className="h-6 w-6 rounded inline-flex items-center justify-center text-rose-600 hover:bg-rose-50"><Trash2 className="h-3 w-3" /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-2 text-xs border-t border-border pt-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{peso(subtotal)}</span></div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Discount ₱</span>
              <input
                type="number" min={0} step="0.01" inputMode="decimal"
                value={discountAmount || ""} placeholder="0.00"
                onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value) || 0))}
                className="w-24 h-7 px-2 rounded border border-border text-right"
              />
            </div>
            {requestedDiscount > 0 && (
              <div className={`flex items-center justify-between gap-2 rounded-lg border px-2 py-1.5 text-[11px] ${
                discountApproved ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : discountDenied ? "bg-rose-50 border-rose-200 text-rose-700"
                : discountPending ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-secondary/50 border-border text-muted-foreground"
              }`}>
                <span className="inline-flex items-center gap-1.5">
                  {discountApproved && <ShieldCheck className="h-3.5 w-3.5 shrink-0" />}
                  {discountDenied && <ShieldAlert className="h-3.5 w-3.5 shrink-0" />}
                  {discountPending && <Hourglass className="h-3.5 w-3.5 shrink-0" />}
                  {!discountApproved && !discountDenied && !discountPending && <ShieldQuestion className="h-3.5 w-3.5 shrink-0" />}
                  <span>
                    {discountApproved && <>Approved by {discountRequest?.decided_by_name || "owner/admin"}</>}
                    {discountDenied && <>Denied{discountRequest?.decided_by_name ? ` by ${discountRequest.decided_by_name}` : ""}{discountRequest?.decision_note ? ` — ${discountRequest.decision_note}` : ""}</>}
                    {discountPending && <>Waiting for owner/admin approval…</>}
                    {!discountApproved && !discountDenied && !discountPending && <>Needs owner/admin approval before checkout</>}
                  </span>
                </span>
                {!discountPending && !discountApproved && (
                  <button
                    onClick={requestDiscountApproval} disabled={requestingApproval}
                    className="h-6 px-2 rounded-md bg-foreground text-background text-[10px] font-semibold disabled:opacity-50 shrink-0"
                  >
                    {requestingApproval ? "Sending…" : discountDenied ? "Request again" : "Request approval"}
                  </button>
                )}
              </div>
            )}
            <div className="flex justify-between text-base font-bold border-t border-border pt-2"><span>Total</span><span>{peso(total)}</span></div>
          </div>

          <div className="mt-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Order type</div>
            <div className="grid grid-cols-3 gap-1.5">
              {FULFILLMENT_TYPES.map((f) => (
                <button key={f.id} onClick={() => setFulfillment(f.id as typeof fulfillment)}
                  className={`h-9 rounded-lg text-[11px] font-semibold inline-flex items-center justify-center gap-1 border transition ${fulfillment === f.id ? "bg-foreground text-background border-foreground" : "border-border hover:bg-secondary"}`}>
                  <f.icon className="h-3 w-3" />{f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Payment</div>
            <div className="grid grid-cols-3 gap-1.5">
            {methods.map((m) => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={`h-9 rounded-lg text-[11px] font-semibold inline-flex items-center justify-center gap-1 border transition ${method === m.id ? "bg-foreground text-background border-foreground" : "border-border hover:bg-secondary"}`}>
                <m.icon className="h-3 w-3" />{m.label}
              </button>
            ))}
            </div>
          </div>

          {method === "cash" && (
            <input type="number" value={cashReceived} onChange={(e) => setCashReceived(e.target.value)}
              placeholder="Cash received" className="mt-2 w-full h-9 px-3 rounded-lg border border-border text-sm" />
          )}
          {method === "cash" && Number(cashReceived) >= total && total > 0 && (
            <div className="text-xs text-emerald-700 mt-1">Change: {peso(change)}</div>
          )}
          {method !== "cash" && (
            <div className="mt-2">
              <input
                value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)}
                placeholder={`${methods.find((m) => m.id === method)?.label ?? "Payment"} reference / approval code`}
                className="w-full h-9 px-3 rounded-lg border border-border text-sm"
              />
              <div className="text-[10px] text-muted-foreground mt-1">Itype ang reference no. / approval code mula sa kumpirmasyon ng customer — para ito ang ma-track ng owner.</div>
            </div>
          )}

          <button disabled={processing || cart.length === 0 || (requestedDiscount > 0 && !discountApproved) || (method !== "cash" && !paymentReference.trim())} onClick={checkout}
            className="mt-3 h-11 w-full rounded-xl bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 shadow-soft hover:opacity-95">
            <Check className="h-4 w-4" />{processing ? "Processing..." : `Charge ${peso(total)}`}
          </button>

          <button
            disabled={cart.length === 0}
            onClick={() => { if (cart.length === 0) return toast.error("Magdagdag muna ng items sa cart bago mag-reserve"); setShowReserve(true); }}
            className="mt-2 h-10 w-full rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-amber-100 disabled:opacity-40"
          >
            <BookmarkPlus className="h-4 w-4" />Reserve
          </button>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button onClick={parkOrder} disabled={cart.length === 0}
              className="h-9 rounded-lg border border-border text-xs font-semibold inline-flex items-center justify-center gap-1 hover:bg-secondary disabled:opacity-50">
              <Pause className="h-3.5 w-3.5" />Park
            </button>
            <button onClick={saveDraft} disabled={cart.length === 0}
              className="h-9 rounded-lg border border-border text-xs font-semibold inline-flex items-center justify-center gap-1 hover:bg-secondary disabled:opacity-50">
              <FileText className="h-3.5 w-3.5" />Save Draft
            </button>
          </div>
        </div>
      </div>

      <Dialog open={!!receipt} onOpenChange={(o) => !o && setReceipt(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" />Receipt</DialogTitle></DialogHeader>
          {receipt && (
            <div className="space-y-3 text-sm">
              <div id="pos-receipt-print" className="space-y-3 text-sm bg-white text-black p-3 rounded">
                <div className="text-center">
                  <div className="font-extrabold text-base tracking-tight">ADZ GARAGE</div>
                  <div className="text-[10px] text-muted-foreground">Official Receipt</div>
                  <div className="text-[11px] mt-1">{receipt.order_number}</div>
                  <div className="text-[10px] text-muted-foreground">{new Date().toLocaleString()}</div>
                  {receipt.fulfillment && receipt.fulfillment !== "takeout" && (
                    <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-700">
                      {FULFILLMENT_LABELS[receipt.fulfillment] ?? receipt.fulfillment}
                    </div>
                  )}
                </div>
                {(receipt.customerName || receipt.walkInName || receipt.walkInVehicle || receipt.walkInPlate) && (
                  <div className="border-t border-dashed border-zinc-300 pt-2 text-[11px] space-y-0.5">
                    {receipt.customerName && <div>Customer: <b>{receipt.customerName}</b></div>}
                    {receipt.walkInName && <div>Walk-in: <b>{receipt.walkInName}</b></div>}
                    {receipt.walkInVehicle && <div>Vehicle: {receipt.walkInVehicle}</div>}
                    {receipt.walkInPlate && <div>Plate: {receipt.walkInPlate}</div>}
                  </div>
                )}
                <div className="border-t border-dashed border-zinc-300 pt-2 space-y-1">
                  {receipt.items.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between text-[11px]">
                      <span>{it.name} × {it.quantity}</span><span>{peso(it.line_total)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-zinc-300 pt-2 text-[12px] space-y-0.5">
                  <div className="flex justify-between"><span>Subtotal</span><span>{peso(Number(receipt.subtotal ?? 0))}</span></div>
                  {Number(receipt.discount) > 0 && <div className="flex justify-between"><span>Discount</span><span>-{peso(Number(receipt.discount))}</span></div>}
                  <div className="flex justify-between font-bold text-base"><span>TOTAL</span><span>{peso(Number(receipt.total))}</span></div>
                  <div className="flex justify-between capitalize"><span>Paid via</span><span>{receipt.method} · {receipt.status}</span></div>
                  {receipt.change > 0 && <div className="flex justify-between text-emerald-700"><span>Change</span><span>{peso(receipt.change)}</span></div>}
                </div>
                <div className="text-center text-[10px] text-zinc-500 pt-2">Salamat sa pagbili!</div>
              </div>
              <div className="grid grid-cols-3 gap-2 print:hidden">
                <button onClick={printReceipt} className="h-10 rounded-xl border border-border text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-secondary">
                  <Printer className="h-4 w-4" />Print
                </button>
                <button
                  onClick={() => downloadElementAsPdf(document.getElementById("pos-receipt-print"), `Receipt-${receipt.order_number}`)}
                  className="h-10 rounded-xl border border-border text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-secondary"
                >
                  <Download className="h-4 w-4" />PDF
                </button>
                <button onClick={() => setReceipt(null)} className="h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Done</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Parked orders */}
      <Dialog open={showParked} onOpenChange={setShowParked}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Pause className="h-4 w-4" />Parked Orders</DialogTitle></DialogHeader>
          {parked.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">No parked orders</div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {parked.map((s) => {
                const sub = s.cart.reduce((a, b) => a + b.price * b.qty, 0);
                return (
                  <div key={s.id} className="flex items-center gap-2 p-3 rounded-lg border border-border">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{s.label}</div>
                      <div className="text-xs text-muted-foreground">{s.cart.length} items · {peso(sub)} · {new Date(s.savedAt).toLocaleString()}</div>
                    </div>
                    <button onClick={() => resume(s, "park")} className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Resume</button>
                    <button onClick={() => setParked((p) => p.filter((x) => x.id !== s.id))} className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Drafts */}
      <Dialog open={showDrafts} onOpenChange={setShowDrafts}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="h-4 w-4" />Draft Orders</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <input value={draftNotes} onChange={(e) => setDraftNotes(e.target.value)} placeholder="Notes for next draft (optional)"
              className="w-full h-9 px-3 rounded-lg border border-border text-sm" />
            {drafts.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">No drafts yet</div>
            ) : (
              <div className="space-y-2 max-h-[55vh] overflow-y-auto">
                {drafts.map((s) => {
                  const sub = s.cart.reduce((a, b) => a + b.price * b.qty, 0);
                  return (
                    <div key={s.id} className="flex items-center gap-2 p-3 rounded-lg border border-border">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{s.label}</div>
                        <div className="text-xs text-muted-foreground">{s.cart.length} items · {peso(sub)}</div>
                        {s.notes && <div className="text-xs italic text-muted-foreground mt-0.5 truncate">"{s.notes}"</div>}
                      </div>
                      <button onClick={() => resume(s, "draft")} className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Resume</button>
                      <button onClick={() => setDrafts((d) => d.filter((x) => x.id !== s.id))} className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom item */}
      <Dialog open={showCustom} onOpenChange={setShowCustom}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Custom Item</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <input value={customItem.name} onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
              placeholder="Item name" className="w-full h-10 px-3 rounded-lg border border-border text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" value={customItem.price} onChange={(e) => setCustomItem({ ...customItem, price: e.target.value })}
                placeholder="Price" className="h-10 px-3 rounded-lg border border-border text-sm" />
              <input type="number" value={customItem.qty} onChange={(e) => setCustomItem({ ...customItem, qty: e.target.value })}
                placeholder="Qty" className="h-10 px-3 rounded-lg border border-border text-sm" />
            </div>
            <button onClick={() => {
              addCustomLine(customItem.name, Number(customItem.price) || 0, Number(customItem.qty) || 1);
              setCustomItem({ name: "", price: "", qty: "1" });
              setShowCustom(false);
            }} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Add to Cart</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Labor */}
      <Dialog open={showCustomLabor} onOpenChange={setShowCustomLabor}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Hammer className="h-4 w-4" />Custom Labor Price</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <input value={laborItem.name} onChange={(e) => setLaborItem({ ...laborItem, name: e.target.value })}
              placeholder="Labor description (e.g. Engine tune-up)" className="w-full h-10 px-3 rounded-lg border border-border text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <input type="number" autoFocus value={laborItem.price} onChange={(e) => setLaborItem({ ...laborItem, price: e.target.value })}
                placeholder="Labor price" className="h-10 px-3 rounded-lg border border-border text-sm" />
              <input type="number" value={laborItem.qty} onChange={(e) => setLaborItem({ ...laborItem, qty: e.target.value })}
                placeholder="Qty" className="h-10 px-3 rounded-lg border border-border text-sm" />
            </div>
            <div className="flex flex-wrap gap-1">
              {[150, 300, 500, 800, 1000, 1500].map((p) => (
                <button key={p} onClick={() => setLaborItem((l) => ({ ...l, price: String(p) }))}
                  className="h-7 px-2 rounded-md border border-border text-[11px] hover:bg-secondary">{peso(p)}</button>
              ))}
            </div>
            <button onClick={() => {
              const price = Number(laborItem.price) || 0;
              if (!laborItem.name || price <= 0) return toast.error("Enter labor name and price");
              addCustomLine(laborItem.name, price, Number(laborItem.qty) || 1, "LABOR");
              setShowCustomLabor(false);
            }} className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Add Labor to Cart</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund */}
      <Dialog open={showRefund} onOpenChange={setShowRefund}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Undo2 className="h-4 w-4" />Returns & Refunds</DialogTitle></DialogHeader>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">No orders to refund</div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {recentOrders.slice(0, 30).map((o: any) => (
                <RefundRow key={o.id} order={o} onRefund={refundOrder} />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reservation Dialog */}
      <Dialog open={showReserve} onOpenChange={(o) => { if (!reserving) { setShowReserve(o); if (!o) { setReserveReceiptFile(null); setReserveReceiptPreview(null); } } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><BookmarkPlus className="h-5 w-5 text-amber-600" />Mag-Reserve</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            {/* Cart preview */}
            <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Reserved Items / Services</div>
              {cart.map((it) => (
                <div key={it.id} className="flex justify-between text-xs">
                  <span className="truncate flex-1">{it.name} × {it.qty}</span>
                  <span className="font-semibold ml-2">{peso(it.price * it.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs font-bold border-t border-border pt-1.5 mt-1.5">
                <span>Subtotal</span><span>{peso(subtotal)}</span>
              </div>
            </div>

            {/* Customer Name */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Customer Name *</label>
              <input
                value={reserveForm.customerName}
                onChange={(e) => setReserveForm((f) => ({ ...f, customerName: e.target.value }))}
                placeholder="Buong pangalan ng customer"
                className="mt-1 w-full h-10 px-3 rounded-lg border border-border text-sm bg-background"
              />
            </div>

            {/* Vehicle */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sasakyan *</label>
              <div className="relative mt-1">
                <Car className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={reserveForm.vehicle}
                  onChange={(e) => setReserveForm((f) => ({ ...f, vehicle: e.target.value }))}
                  placeholder="e.g. Toyota Vios 2020"
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-border text-sm bg-background"
                />
              </div>
            </div>

            {/* Plate Number */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Plate Number *</label>
              <input
                value={reserveForm.plateNumber}
                onChange={(e) => setReserveForm((f) => ({ ...f, plateNumber: e.target.value.toUpperCase() }))}
                placeholder="e.g. ABC 1234"
                className="mt-1 w-full h-10 px-3 rounded-lg border border-border text-sm bg-background font-mono uppercase"
              />
            </div>

            {/* Down Payment */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Down Payment Amount *</label>
              <input
                type="number" min={1} step="0.01"
                value={reserveForm.downPayment}
                onChange={(e) => setReserveForm((f) => ({ ...f, downPayment: e.target.value }))}
                placeholder="0.00"
                className="mt-1 w-full h-10 px-3 rounded-lg border border-border text-sm bg-background"
              />
            </div>

            {/* Receipt Upload */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Larawan ng Down Payment Receipt *</label>
              <input
                ref={reserveFileRef}
                type="file" accept="image/*" className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setReserveReceiptFile(f);
                  if (f) {
                    const url = URL.createObjectURL(f);
                    setReserveReceiptPreview(url);
                  } else {
                    setReserveReceiptPreview(null);
                  }
                }}
              />
              {reserveReceiptPreview ? (
                <div className="mt-1 relative">
                  <img src={reserveReceiptPreview} alt="Receipt preview" className="w-full max-h-48 object-contain rounded-lg border border-border" />
                  <button
                    onClick={() => { setReserveReceiptFile(null); setReserveReceiptPreview(null); if (reserveFileRef.current) reserveFileRef.current.value = ""; }}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-rose-600 text-white inline-flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => reserveFileRef.current?.click()}
                  className="mt-1 w-full h-20 rounded-lg border-2 border-dashed border-border text-xs text-muted-foreground inline-flex flex-col items-center justify-center gap-1 hover:border-foreground/30 hover:bg-secondary/40 transition"
                >
                  <Upload className="h-4 w-4" />
                  <span>I-click para mag-upload ng larawan</span>
                </button>
              )}
            </div>

            {/* Notes (optional) */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Notes (optional)</label>
              <textarea
                value={reserveForm.notes}
                onChange={(e) => setReserveForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Dagdag na impormasyon…"
                rows={2}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-border text-sm bg-background resize-none"
              />
            </div>

            <button
              onClick={submitReservation}
              disabled={reserving}
              className="w-full h-11 rounded-xl bg-amber-600 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-amber-700"
            >
              <BookmarkPlus className="h-4 w-4" />
              {reserving ? "Sine-save…" : "I-save ang Reservation"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Discount Approvals — owner/admin review cashier requests */}
      {isApprover && (
        <Dialog open={showApprovals} onOpenChange={setShowApprovals}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Discount Approvals</DialogTitle></DialogHeader>
            {discountApprovalRows.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">No discount requests yet</div>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {(discountApprovalRows as any[]).slice(0, 30).map((r) => (
                  <ApprovalRow key={r.id} request={r} onDecide={decideDiscountApproval} />
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </PageShell>
  );
}

function ApprovalRow({ request, onDecide }: { request: any; onDecide: (r: any, decision: "approved" | "denied", note: string) => Promise<void> }) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<"approved" | "denied" | null>(null);
  const pending = request.status === "pending";

  const decide = async (decision: "approved" | "denied") => {
    setBusy(decision);
    await onDecide(request, decision, note);
    setBusy(null);
  };

  return (
    <div className="rounded-lg border border-border p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{request.customer_label || "Walk-in customer"}</div>
          <div className="text-xs text-muted-foreground">Requested by {request.requested_by_name || "cashier"} · {new Date(request.created_at).toLocaleString()}</div>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 capitalize ${
          request.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : request.status === "denied" ? "bg-rose-50 text-rose-700 border-rose-200"
          : "bg-amber-50 text-amber-800 border-amber-200"
        }`}>{request.status}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Subtotal {peso(Number(request.subtotal))}</span>
        <span className="font-bold text-rose-600">− {peso(Number(request.amount))}</span>
      </div>
      {pending ? (
        <>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional — e.g. reason for denial)"
            className="w-full h-8 px-2 rounded border border-border text-xs bg-background" />
          <div className="grid grid-cols-2 gap-2">
            <button disabled={!!busy} onClick={() => decide("denied")}
              className="h-8 rounded-lg border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 disabled:opacity-50 inline-flex items-center justify-center gap-1.5">
              <X className="h-3.5 w-3.5" />{busy === "denied" ? "Denying…" : "Deny"}
            </button>
            <button disabled={!!busy} onClick={() => decide("approved")}
              className="h-8 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-1.5">
              <Check className="h-3.5 w-3.5" />{busy === "approved" ? "Approving…" : "Approve"}
            </button>
          </div>
        </>
      ) : (
        <div className="text-[11px] text-muted-foreground">
          {request.status === "approved" ? "Approved" : "Denied"} by {request.decided_by_name || "—"}
          {request.decided_at ? ` · ${new Date(request.decided_at).toLocaleString()}` : ""}
          {request.decision_note ? ` — "${request.decision_note}"` : ""}
        </div>
      )}
    </div>
  );
}

function RefundRow({ order, onRefund }: { order: any; onRefund: (o: any, amt: number, reason: string) => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(Number(order.total) || 0));
  const [reason, setReason] = useState("");
  const [mode, setMode] = useState<"full" | "partial" | "exchange">("full");
  return (
    <div className="rounded-lg border border-border">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-2 p-3 text-left hover:bg-secondary/40">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{order.order_number} · {order.customer?.full_name || "Walk-in"}</div>
          <div className="text-xs text-muted-foreground">{peso(Number(order.total))} · {order.status} · {new Date(order.created_at).toLocaleDateString()}</div>
        </div>
        <Undo2 className="h-4 w-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="p-3 border-t border-border space-y-2 bg-secondary/30">
          <div className="flex gap-1">
            {(["full", "partial", "exchange"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); if (m === "full") setAmount(String(Number(order.total) || 0)); }}
                className={`h-8 px-3 rounded-lg text-xs font-semibold capitalize border ${mode === m ? "bg-foreground text-background border-foreground" : "border-border"}`}>{m}</button>
            ))}
          </div>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={mode === "full"}
            className="w-full h-9 px-3 rounded-lg border border-border text-sm disabled:opacity-60" placeholder="Refund amount" />
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason (optional)"
            className="w-full h-9 px-3 rounded-lg border border-border text-sm" />
          <button onClick={() => onRefund(order, Number(amount) || 0, reason || mode)}
            className="w-full h-9 rounded-lg bg-rose-600 text-white text-xs font-semibold">Process {mode === "exchange" ? "Exchange" : "Refund"} {peso(Number(amount) || 0)}</button>
        </div>
      )}
    </div>
  );
}
