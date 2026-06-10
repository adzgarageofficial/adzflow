import { createFileRoute } from "@tanstack/react-router";
import adzLogo from "@/assets/adz-logo.png";
import { useState } from "react";
import { Search, Droplets, Calendar, Gauge, Car, CalendarPlus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Public page — no login required.
// Share the link directly with customers: /oil-history
export const Route = createFileRoute("/oil-history")({ component: OilHistoryPage });

type OilRecord = {
  vehicle_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string | null;
  make: string;
  model: string;
  year_made: number | null;
  plate_number: string | null;
  current_mileage: number | null;
  last_service_date: string | null;
  last_service_mileage: number | null;
  last_oil_used: string | null;
  next_service_date: string | null;
  next_service_mileage: number | null;
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function OilHistoryPage() {
  const [surname, setSurname] = useState("");
  const [plate, setPlate] = useState("");
  const [results, setResults] = useState<OilRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [bookingFor, setBookingFor] = useState<OilRecord | null>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [bookingDone, setBookingDone] = useState<string | null>(null);

  async function handleSearch() {
    if (!surname.trim() || !plate.trim()) {
      toast.error("Ilagay ang surname at plate number.");
      return;
    }
    setLoading(true);
    setSearched(true);
    setResults([]);
    setBookingFor(null);
    try {
      const { data, error } = await supabase.rpc("public_oil_history_lookup", {
        p_surname: surname.trim(),
        p_plate: plate.trim(),
      });
      if (error) throw error;
      setResults((data ?? []) as OilRecord[]);
    } catch (e: any) {
      toast.error(e.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function openBook(r: OilRecord) {
    setBookingFor(r);
    setScheduledAt("");
    setNotes("");
    setBookingDone(null);
  }

  async function saveBooking() {
    if (!scheduledAt || !bookingFor) return toast.error("Piliin ang petsa at oras.");
    setSaving(true);
    try {
      const { data, error } = await supabase.rpc("public_book_appointment", {
        p_customer_id: bookingFor.customer_id,
        p_vehicle_id: bookingFor.vehicle_id,
        p_scheduled_at: new Date(scheduledAt).toISOString(),
        p_notes: notes || null,
      });
      if (error) throw error;
      setBookingDone(data as string);
    } catch (e: any) {
      toast.error(e.message ?? "Booking failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-surface px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <img src={adzLogo} alt="ADZ Garage" className="mx-auto h-12 w-12 rounded-2xl object-cover mb-3" />
          <h1 className="text-2xl font-bold tracking-tight">Oil Change History</h1>
          <p className="text-sm text-muted-foreground mt-1">
            I-search ang inyong huling oil change gamit ang surname at plate number.
          </p>
        </div>

        {/* Search panel */}
        <div className="rounded-2xl border border-border bg-card shadow-soft p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">
                Surname <span className="text-rose-500">*</span>
              </label>
              <input
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. Dela Cruz"
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">
                Plate Number <span className="text-rose-500">*</span>
              </label>
              <input
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. ABC 1234"
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            {loading ? "Hinahanap…" : "Hanapin"}
          </button>
        </div>

        {/* Results */}
        {searched && !loading && (
          results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Car className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-sm">Walang nahanap.</p>
              <p className="text-xs mt-1">I-check ang spelling ng surname o plate number.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((r) => (
                <div key={r.vehicle_id} className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
                  <div className="p-5">
                    {/* Customer + vehicle */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="h-11 w-11 rounded-xl bg-gradient-red text-primary-foreground grid place-items-center text-sm font-bold shrink-0">
                        {r.customer_name.split(" ").map((s: string) => s[0]).slice(0, 2).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base truncate">{r.customer_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {[r.year_made, r.make, r.model].filter(Boolean).join(" ")} · {r.plate_number ?? "No plate"}
                        </div>
                        {r.customer_phone && <div className="text-xs text-muted-foreground">{r.customer_phone}</div>}
                      </div>
                    </div>

                    {/* Last oil change */}
                    <div className="rounded-xl border border-border bg-secondary/40 p-3 mb-4">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Last Oil Change</p>
                      {r.last_service_date ? (
                        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                          <dt className="flex items-center gap-1.5 text-muted-foreground text-xs whitespace-nowrap">
                            <Calendar className="h-3.5 w-3.5 shrink-0" /> Date
                          </dt>
                          <dd className="font-semibold text-sm">{fmtDate(r.last_service_date)}</dd>

                          <dt className="flex items-center gap-1.5 text-muted-foreground text-xs whitespace-nowrap">
                            <Gauge className="h-3.5 w-3.5 shrink-0" /> Odometer
                          </dt>
                          <dd className="font-semibold text-sm">
                            {r.last_service_mileage != null ? `${Number(r.last_service_mileage).toLocaleString()} km` : "—"}
                          </dd>

                          <dt className="flex items-center gap-1.5 text-muted-foreground text-xs whitespace-nowrap">
                            <Droplets className="h-3.5 w-3.5 shrink-0" /> Oil Used
                          </dt>
                          <dd className="font-semibold text-sm">{r.last_oil_used ?? "—"}</dd>

                          {r.next_service_date && (
                            <>
                              <dt className="flex items-center gap-1.5 text-muted-foreground text-xs whitespace-nowrap">
                                <Calendar className="h-3.5 w-3.5 shrink-0" /> Next Due
                              </dt>
                              <dd className="font-semibold text-sm text-amber-600">
                                {fmtDate(r.next_service_date)}
                                {r.next_service_mileage != null && ` or ${Number(r.next_service_mileage).toLocaleString()} km`}
                              </dd>
                            </>
                          )}
                        </dl>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">Walang recorded service pa.</p>
                      )}
                    </div>

                    {/* Book button */}
                    {bookingFor?.vehicle_id !== r.vehicle_id && (
                      <button
                        onClick={() => openBook(r)}
                        className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center justify-center gap-2 hover:opacity-95"
                      >
                        <CalendarPlus className="h-4 w-4" /> Book Appointment
                      </button>
                    )}
                  </div>

                  {/* Inline booking form */}
                  {bookingFor?.vehicle_id === r.vehicle_id && (
                    <div className="border-t border-border bg-secondary/30 p-5">
                      {bookingDone ? (
                        <div className="text-center space-y-2 py-2">
                          <div className="text-2xl">✓</div>
                          <p className="font-semibold text-sm">Booking confirmed!</p>
                          <p className="text-xs text-muted-foreground">
                            Booking #: <span className="font-mono font-bold">{bookingDone}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Makikipag-ugnayan ang aming staff para sa kumpirmasyon.
                          </p>
                          <button
                            onClick={() => setBookingFor(null)}
                            className="mt-2 h-9 px-6 rounded-lg border border-border text-sm"
                          >
                            Close
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold">Book Appointment</p>
                            <button onClick={() => setBookingFor(null)} className="h-7 w-7 rounded-lg hover:bg-secondary inline-flex items-center justify-center">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">
                                Preferred Date & Time <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="datetime-local"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block mb-1">Notes (optional)</label>
                              <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={2}
                                placeholder="Any additional requests…"
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                              />
                            </div>
                            <button
                              onClick={saveBooking}
                              disabled={saving}
                              className="w-full h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 hover:opacity-95"
                            >
                              {saving ? "Saving…" : "Confirm Booking"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          ADZ Garage — For inquiries, please visit us or call our branch.
        </p>
      </div>
    </div>
  );
}
