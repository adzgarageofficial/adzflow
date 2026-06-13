import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getPOByToken = createServerFn({ method: "GET" })
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const { data: rawPo, error } = await supabaseAdmin
      .from("purchase_orders")
      .select(
        "id, po_number, status, expected_at, notes, supplier_ref, " +
        "supplier:suppliers(id, name), " +
        "items:purchase_order_items(id, quantity, received_quantity, unit_type, product_id, product:products(id, name, sku))"
      )
      .eq("delivery_token", data.token)
      .not("delivery_token", "is", null)
      .maybeSingle();

    if (error || !rawPo) return null;

    const po = rawPo as any;

    const { data: pending } = await supabaseAdmin
      .from("po_delivery_receipts")
      .select("id, submitted_at, supplier_name")
      .eq("purchase_order_id", po.id)
      .eq("status", "pending")
      .maybeSingle();

    return { po, pendingReceipt: pending ?? null };
  });

const submitSchema = z.object({
  token: z.string(),
  supplier_name: z.string().min(1, "Ilagay ang iyong pangalan."),
  delivery_date: z.string().min(1, "Ilagay ang delivery date."),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      purchase_order_item_id: z.string().uuid(),
      product_id: z.string().uuid(),
      quantity_delivered: z.number().int().min(0),
    })
  ),
});

export const submitDeliveryReceipt = createServerFn({ method: "POST" })
  .inputValidator(submitSchema)
  .handler(async ({ data }) => {
    const { data: po } = await supabaseAdmin
      .from("purchase_orders")
      .select("id")
      .eq("delivery_token", data.token)
      .not("delivery_token", "is", null)
      .maybeSingle();

    if (!po) throw new Error("Invalid delivery link.");

    const { data: existing } = await supabaseAdmin
      .from("po_delivery_receipts")
      .select("id")
      .eq("purchase_order_id", po.id)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      throw new Error("May nakasubmit na delivery receipt para sa PO na ito. Hintayin ang confirmation ng ADZ Garage.");
    }

    const { data: poItems } = await supabaseAdmin
      .from("purchase_order_items")
      .select("id, quantity, received_quantity")
      .eq("purchase_order_id", po.id);

    const itemMap = new Map((poItems ?? []).map((i) => [i.id, i]));

    for (const item of data.items) {
      if (item.quantity_delivered === 0) continue;
      const poItem = itemMap.get(item.purchase_order_item_id);
      if (!poItem) throw new Error("Hindi valid ang item.");
      const remaining = poItem.quantity - poItem.received_quantity;
      if (item.quantity_delivered > remaining) {
        throw new Error(`Sobra ang quantity. Max remaining: ${remaining}`);
      }
    }

    const deliveredItems = data.items.filter((i) => i.quantity_delivered > 0);
    if (deliveredItems.length === 0) {
      throw new Error("Walang items na may delivered quantity.");
    }

    const { data: receipt, error: receiptErr } = await supabaseAdmin
      .from("po_delivery_receipts")
      .insert({
        purchase_order_id: po.id,
        supplier_name: data.supplier_name,
        delivery_date: data.delivery_date,
        notes: data.notes ?? null,
        status: "pending",
      })
      .select("id")
      .single();

    if (receiptErr || !receipt) throw new Error("Hindi ma-save ang delivery receipt.");

    const { error: itemsErr } = await supabaseAdmin
      .from("po_delivery_receipt_items")
      .insert(
        deliveredItems.map((item) => ({
          delivery_receipt_id: receipt.id,
          purchase_order_item_id: item.purchase_order_item_id,
          product_id: item.product_id,
          quantity_delivered: item.quantity_delivered,
        }))
      );

    if (itemsErr) throw new Error("Hindi ma-save ang mga item.");

    return { receiptId: receipt.id };
  });
