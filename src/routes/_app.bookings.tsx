import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, Grid3x3, List, Search, Filter, X, Trash2, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookings, useCustomers, useVehicles, useServices, useBranches, useInsert, useUpdate, useDelete, useIsOwner } from "@/lib/db";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/bookings")({ component: BookingsPage });

/* ── Status config ─────────────────────────────────────── */
const STATUSES = ["scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"] as const;
type Status = typeof STATUSES[number];

const STATUS_COLOR: Record<Status, { bg: string; pill: string; dot: string }> = {
  scheduled:   { bg: "bg-blue-500",   pill: "bg-blue-100 text-blue-700 border-blue-200",   dot: "bg-blue-400" },
  confirmed:   { bg: "bg-emerald-500", pill: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
  in_progress: { bg: "bg-purple-500",  pill: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-400" },
  completed:   { bg: "bg-zinc-400",    pill: "bg-zinc-100 text-zinc-600 border-zinc-200",   dot: "bg-zinc-400" },
  cancelled:   { bg: "bg-rose-500",    pill: "bg-rose-100 text-rose-700 border-rose-200",   dot: "bg-rose-400" },
  no_show:     { bg: "bg-amber-500",   pill: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-400" },
};

/* ── Internal event shape ──────────────────────────────── */
interface CalEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: Status;
  bookingNumber: string;
  raw: any;
}

function bookingToEvent(b: any): CalEvent {
  const start = new Date(b.scheduled_at);
  const end = new Date(start.getTime() + (b.duration_minutes ?? 60) * 60000);
  return {
    id: b.id,
    title: b.customer?.full_name ?? b.walk_in_name ?? b.booking_number,
    subtitle: b.service?.name ?? "",
    description: b.notes ?? "",
    startTime: start,
    endTime: end,
    status: b.status as Status,
    bookingNumber: b.booking_number,
    raw: b,
  };
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
}

/* ── Page ──────────────────────────────────────────────── */
function BookingsPage() {
  const { data: bookings = [] } = useBookings();
  const { data: customers = [] } = useCustomers();
  const { data: vehicles = [] } = useVehicles();
  const { data: services = [] } = useServices();
  const { data: branches = [] } = useBranches();
  const ins = useInsert("bookings");
  const upd = useUpdate("bookings");
  const del = useDelete("bookings");
  const canEdit = useIsOwner();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day" | "list">("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);

  const events = useMemo(() => (bookings as any[]).map(bookingToEvent), [bookings]);

  const filteredEvents = useMemo(() => events.filter((ev) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (![ev.title, ev.subtitle, ev.bookingNumber, ev.description].join(" ").toLowerCase().includes(q)) return false;
    }
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(ev.status)) return false;
    return true;
  }), [events, searchQuery, selectedStatuses]);

  const hasFilters = selectedStatuses.length > 0;

  /* navigation */
  const shiftDate = useCallback((dir: "prev" | "next") => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (view === "month") d.setMonth(d.getMonth() + (dir === "next" ? 1 : -1));
      else if (view === "week") d.setDate(d.getDate() + (dir === "next" ? 7 : -7));
      else d.setDate(d.getDate() + (dir === "next" ? 1 : -1));
      return d;
    });
  }, [view]);

  /* drag-and-drop reschedule */
  const handleDrop = useCallback(async (date: Date, hour?: number) => {
    if (!draggedId || !canEdit) return;
    const bk = (bookings as any[]).find((b: any) => b.id === draggedId);
    if (!bk) return;
    const newStart = new Date(date);
    if (hour !== undefined) newStart.setHours(hour, 0, 0, 0);
    else newStart.setHours(new Date(bk.scheduled_at).getHours(), new Date(bk.scheduled_at).getMinutes(), 0, 0);
    await upd.mutateAsync({ id: draggedId, patch: { scheduled_at: newStart.toISOString() } });
    toast.success("Booking rescheduled");
    setDraggedId(null);
  }, [draggedId, bookings, upd, canEdit]);

  /* open create */
  function openCreate() { setEditingBooking(null); setIsCreating(true); setDialogOpen(true); }
  /* open edit */
  function openEdit(ev: CalEvent) { setEditingBooking(ev.raw); setIsCreating(false); setDialogOpen(true); }

  /* save */
  async function handleSave(v: any) {
    if (isCreating) await ins.mutateAsync({ ...v, booking_number: `BK-${Date.now().toString().slice(-8)}` });
    else await upd.mutateAsync({ id: editingBooking.id, patch: v });
    toast.success("Saved!"); setDialogOpen(false);
  }

  /* delete */
  async function handleDelete(id: string) {
    if (!confirm("Delete this booking?")) return;
    await del.mutateAsync(id);
    toast.success("Deleted"); setDialogOpen(false);
  }

  const titleLabel = view === "month"
    ? currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : view === "week"
    ? `Week of ${currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
    : view === "day"
    ? currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "All Bookings";

  return (
    <PageShell title="Bookings" subtitle="Service appointments & schedule.">
      {/* ── top bar ── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
        {/* title + nav */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <h2 className="text-lg font-semibold">{titleLabel}</h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => shiftDate("prev")}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="h-8" onClick={() => setCurrentDate(new Date())}>Today</Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => shiftDate("next")}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* view switcher + new */}
        <div className="flex items-center gap-2">
          {/* mobile select */}
          <div className="sm:hidden flex-1">
            <Select value={view} onValueChange={(v: any) => setView(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="month"><div className="flex items-center gap-2"><Calendar className="h-4 w-4" />Month</div></SelectItem>
                <SelectItem value="week"><div className="flex items-center gap-2"><Grid3x3 className="h-4 w-4" />Week</div></SelectItem>
                <SelectItem value="day"><div className="flex items-center gap-2"><Clock className="h-4 w-4" />Day</div></SelectItem>
                <SelectItem value="list"><div className="flex items-center gap-2"><List className="h-4 w-4" />List</div></SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* desktop buttons */}
          <div className="hidden sm:flex items-center gap-1 rounded-lg border bg-card p-1">
            {(["month","week","day","list"] as const).map((v) => (
              <Button key={v} variant={view === v ? "secondary" : "ghost"} size="sm" className="h-8 capitalize" onClick={() => setView(v)}>
                {v === "month" && <Calendar className="h-4 w-4 mr-1" />}
                {v === "week" && <Grid3x3 className="h-4 w-4 mr-1" />}
                {v === "day" && <Clock className="h-4 w-4 mr-1" />}
                {v === "list" && <List className="h-4 w-4 mr-1" />}
                {v}
              </Button>
            ))}
          </div>
          <Button disabled={!canEdit} onClick={openCreate} className="h-9 px-4">
            <Plus className="h-4 w-4 mr-1" />New Booking
          </Button>
        </div>
      </div>

      {/* ── search + filter ── */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search bookings…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
          {searchQuery && <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setSearchQuery("")}><X className="h-4 w-4" /></Button>}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Filter className="h-4 w-4" />Status
              {selectedStatuses.length > 0 && <Badge variant="secondary" className="h-4 px-1 text-[10px]">{selectedStatuses.length}</Badge>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUSES.map((s) => (
              <DropdownMenuCheckboxItem key={s} checked={selectedStatuses.includes(s)}
                onCheckedChange={(c) => setSelectedStatuses((prev) => c ? [...prev, s] : prev.filter((x) => x !== s))}>
                <div className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", STATUS_COLOR[s].dot)} />
                  <span className="capitalize">{s.replace("_", " ")}</span>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-9 gap-1" onClick={() => setSelectedStatuses([])}>
            <X className="h-3.5 w-3.5" />Clear
          </Button>
        )}

        <span className="text-xs text-muted-foreground ml-auto">{filteredEvents.length} booking{filteredEvents.length !== 1 ? "s" : ""}</span>
      </div>

      {/* ── active filter chips ── */}
      {selectedStatuses.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selectedStatuses.map((s) => (
            <Badge key={s} variant="secondary" className="gap-1 capitalize">
              <span className={cn("h-2 w-2 rounded-full", STATUS_COLOR[s].dot)} />
              {s.replace("_", " ")}
              <button onClick={() => setSelectedStatuses((p) => p.filter((x) => x !== s))}><X className="h-3 w-3" /></button>
            </Badge>
          ))}
        </div>
      )}

      {/* ── calendar views ── */}
      {view === "month" && (
        <MonthView currentDate={currentDate} events={filteredEvents}
          onEventClick={openEdit} onDragStart={(e) => setDraggedId(e.id)} onDragEnd={() => setDraggedId(null)} onDrop={handleDrop} />
      )}
      {view === "week" && (
        <WeekView currentDate={currentDate} events={filteredEvents}
          onEventClick={openEdit} onDragStart={(e) => setDraggedId(e.id)} onDragEnd={() => setDraggedId(null)} onDrop={handleDrop} />
      )}
      {view === "day" && (
        <DayView currentDate={currentDate} events={filteredEvents}
          onEventClick={openEdit} onDragStart={(e) => setDraggedId(e.id)} onDragEnd={() => setDraggedId(null)} onDrop={handleDrop} />
      )}
      {view === "list" && (
        <ListView events={filteredEvents} onEventClick={openEdit} />
      )}

      {/* ── booking dialog ── */}
      <BookingDialog
        open={dialogOpen} isCreating={isCreating} editing={editingBooking}
        customers={customers} vehicles={vehicles} services={services} branches={branches}
        canEdit={canEdit}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        onLogOil={(bk: any) => { setDialogOpen(false); navigate({ to: "/oil-records" }); }}
      />
    </PageShell>
  );
}

/* ── EventCard ─────────────────────────────────────────── */
function EventCard({ ev, onClick, onDragStart, onDragEnd, variant = "compact" }: {
  ev: CalEvent; onClick: (e: CalEvent) => void;
  onDragStart: (e: CalEvent) => void; onDragEnd: () => void;
  variant?: "compact" | "block";
}) {
  const [hovered, setHovered] = useState(false);
  const cfg = STATUS_COLOR[ev.status];

  if (variant === "block") {
    return (
      <div draggable onDragStart={() => onDragStart(ev)} onDragEnd={onDragEnd} onClick={() => onClick(ev)}
        className={cn("cursor-pointer rounded-lg px-3 py-2 text-white transition-all", cfg.bg, hovered && "opacity-90 shadow-lg scale-[1.02]")}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className="font-semibold text-sm truncate">{ev.title}</div>
        {ev.subtitle && <div className="text-xs opacity-80 truncate">{ev.subtitle}</div>}
        <div className="text-xs opacity-70 mt-0.5">{formatTime(ev.startTime)} – {formatTime(ev.endTime)}</div>
      </div>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div draggable onDragStart={() => onDragStart(ev)} onDragEnd={onDragEnd} onClick={() => onClick(ev)}
        className={cn("cursor-pointer rounded px-1.5 py-0.5 text-white text-xs font-medium truncate transition-all", cfg.bg, hovered && "opacity-90")}>
        {ev.title}
      </div>
      {hovered && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 pointer-events-none">
          <Card className="border-2 shadow-xl p-3 space-y-1.5">
            <div className="font-semibold text-sm">{ev.title}</div>
            {ev.subtitle && <div className="text-xs text-muted-foreground">{ev.subtitle}</div>}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />{formatTime(ev.startTime)} – {formatTime(ev.endTime)}
            </div>
            <Badge variant="secondary" className={cn("text-[10px] capitalize border", cfg.pill)}>{ev.status.replace("_"," ")}</Badge>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ── Month View ────────────────────────────────────────── */
function MonthView({ currentDate, events, onEventClick, onDragStart, onDragEnd, onDrop }: {
  currentDate: Date; events: CalEvent[];
  onEventClick: (e: CalEvent) => void; onDragStart: (e: CalEvent) => void;
  onDragEnd: () => void; onDrop: (d: Date) => void;
}) {
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  startDate.setDate(1 - startDate.getDay());
  const days = Array.from({ length: 42 }, (_, i) => { const d = new Date(startDate); d.setDate(d.getDate() + i); return d; });

  function dayEvents(date: Date) {
    return events.filter((e) =>
      e.startTime.getDate() === date.getDate() && e.startTime.getMonth() === date.getMonth() && e.startTime.getFullYear() === date.getFullYear()
    );
  }

  const todayStr = new Date().toDateString();

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-7 border-b bg-secondary/40">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2 border-r last:border-r-0">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const de = dayEvents(day);
          const inMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === todayStr;
          return (
            <div key={i}
              className={cn("min-h-24 border-b border-r p-1.5 transition-colors last:border-r-0", !inMonth && "bg-muted/30", "hover:bg-accent/30")}
              onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(day)}>
              <div className={cn("h-6 w-6 flex items-center justify-center rounded-full text-xs mb-1",
                isToday ? "bg-primary text-primary-foreground font-bold" : !inMonth ? "text-muted-foreground" : "")}>
                {day.getDate()}
              </div>
              <div className="space-y-0.5">
                {de.slice(0, 3).map((ev) => (
                  <EventCard key={ev.id} ev={ev} onClick={onEventClick} onDragStart={onDragStart} onDragEnd={onDragEnd} />
                ))}
                {de.length > 3 && <div className="text-[10px] text-muted-foreground pl-1">+{de.length - 3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ── Week View ─────────────────────────────────────────── */
function WeekView({ currentDate, events, onEventClick, onDragStart, onDragEnd, onDrop }: {
  currentDate: Date; events: CalEvent[];
  onEventClick: (e: CalEvent) => void; onDragStart: (e: CalEvent) => void;
  onDragEnd: () => void; onDrop: (d: Date, h: number) => void;
}) {
  const start = new Date(currentDate); start.setDate(currentDate.getDate() - currentDate.getDay());
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  function slotEvents(date: Date, hour: number) {
    return events.filter((e) =>
      e.startTime.getDate() === date.getDate() && e.startTime.getMonth() === date.getMonth() &&
      e.startTime.getFullYear() === date.getFullYear() && e.startTime.getHours() === hour
    );
  }

  return (
    <Card className="overflow-auto">
      <div className="grid grid-cols-8 border-b bg-secondary/40 sticky top-0 z-10">
        <div className="border-r p-2 text-xs text-muted-foreground" />
        {days.map((d) => (
          <div key={d.toISOString()} className="border-r last:border-r-0 p-2 text-center text-xs font-medium">
            <div>{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
            <div className="text-muted-foreground">{d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-8">
        {hours.map((hour) => (
          <>
            <div key={`t${hour}`} className="border-b border-r p-2 text-xs text-muted-foreground text-right pr-3 min-h-14">
              {String(hour).padStart(2,"0")}:00
            </div>
            {days.map((day) => {
              const se = slotEvents(day, hour);
              return (
                <div key={`${day.toISOString()}-${hour}`}
                  className="min-h-14 border-b border-r last:border-r-0 p-0.5 hover:bg-accent/30 transition-colors"
                  onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(day, hour)}>
                  <div className="space-y-0.5">
                    {se.map((ev) => <EventCard key={ev.id} ev={ev} onClick={onEventClick} onDragStart={onDragStart} onDragEnd={onDragEnd} />)}
                  </div>
                </div>
              );
            })}
          </>
        ))}
      </div>
    </Card>
  );
}

/* ── Day View ──────────────────────────────────────────── */
function DayView({ currentDate, events, onEventClick, onDragStart, onDragEnd, onDrop }: {
  currentDate: Date; events: CalEvent[];
  onEventClick: (e: CalEvent) => void; onDragStart: (e: CalEvent) => void;
  onDragEnd: () => void; onDrop: (d: Date, h: number) => void;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  function slotEvents(hour: number) {
    return events.filter((e) =>
      e.startTime.getDate() === currentDate.getDate() && e.startTime.getMonth() === currentDate.getMonth() &&
      e.startTime.getFullYear() === currentDate.getFullYear() && e.startTime.getHours() === hour
    );
  }

  return (
    <Card className="overflow-auto">
      {hours.map((hour) => {
        const se = slotEvents(hour);
        return (
          <div key={hour} className="flex border-b last:border-b-0"
            onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(currentDate, hour)}>
            <div className="w-16 shrink-0 border-r p-2 text-xs text-muted-foreground text-right">{String(hour).padStart(2,"0")}:00</div>
            <div className="flex-1 min-h-16 p-1.5 hover:bg-accent/30 transition-colors">
              <div className="space-y-1.5">
                {se.map((ev) => <EventCard key={ev.id} ev={ev} onClick={onEventClick} onDragStart={onDragStart} onDragEnd={onDragEnd} variant="block" />)}
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

/* ── List View ─────────────────────────────────────────── */
function ListView({ events, onEventClick }: { events: CalEvent[]; onEventClick: (e: CalEvent) => void }) {
  const sorted = [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const groups = sorted.reduce<Record<string, CalEvent[]>>((acc, ev) => {
    const key = ev.startTime.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    (acc[key] ??= []).push(ev);
    return acc;
  }, {});

  if (sorted.length === 0) {
    return (
      <Card className="p-12 text-center text-muted-foreground">
        <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p>No bookings found.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([label, evs]) => (
        <div key={label}>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">{label}</div>
          <Card className="divide-y">
            {evs.map((ev) => {
              const cfg = STATUS_COLOR[ev.status];
              return (
                <div key={ev.id} onClick={() => onEventClick(ev)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent/40 cursor-pointer transition-colors">
                  <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", cfg.dot)} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{ev.title}</div>
                    {ev.subtitle && <div className="text-xs text-muted-foreground truncate">{ev.subtitle}</div>}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{formatTime(ev.startTime)} – {formatTime(ev.endTime)}</div>
                  <Badge variant="secondary" className={cn("text-[10px] capitalize border hidden sm:inline-flex", cfg.pill)}>{ev.status.replace("_"," ")}</Badge>
                </div>
              );
            })}
          </Card>
        </div>
      ))}
    </div>
  );
}

/* ── Booking Dialog ────────────────────────────────────── */
function BookingDialog({ open, isCreating, editing, customers, vehicles, services, branches, canEdit, onClose, onSave, onDelete, onLogOil }: any) {
  const blank = { customer_name: "", vehicle_info: "", service_name: "", branch_name: "", scheduled_at: "", duration_minutes: 60, status: "scheduled", notes: "" };
  const [v, setV] = useState<any>(blank);

  useMemo(() => {
    if (!open) return;
    if (editing) {
      setV({
        customer_name: editing.customer?.full_name ?? editing.walk_in_name ?? "",
        vehicle_info: editing.vehicle ? `${editing.vehicle.make ?? ""} ${editing.vehicle.model ?? ""}`.trim() : "",
        service_name: editing.service?.name ?? "",
        branch_name: editing.branch_name ?? "",
        scheduled_at: editing.scheduled_at ?? "",
        duration_minutes: editing.duration_minutes ?? 60,
        status: editing.status ?? "scheduled",
        notes: editing.notes ?? "",
      });
    } else {
      setV(blank);
    }
  }, [open, editing]);

  function field(key: string, val: any) { setV((p: any) => ({ ...p, [key]: val })); }

  function buildPayload() {
    const customer = customers.find((c: any) => c.full_name.toLowerCase() === v.customer_name.trim().toLowerCase());
    const vehicle  = vehicles.find((x: any) => `${x.make ?? ""} ${x.model ?? ""}`.trim().toLowerCase() === v.vehicle_info.trim().toLowerCase());
    const service  = services.find((s: any) => s.name.toLowerCase() === v.service_name.trim().toLowerCase());
    const branch   = branches.find((b: any) => b.name.toLowerCase() === v.branch_name.trim().toLowerCase());
    return {
      customer_id: customer?.id ?? null,
      vehicle_id:  vehicle?.id  ?? null,
      service_id:  service?.id  ?? null,
      branch_id:   branch?.id   ?? null,
      scheduled_at:     v.scheduled_at,
      duration_minutes: v.duration_minutes,
      status: v.status,
      notes:  v.notes,
    };
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isCreating ? "New Booking" : "Edit Booking"}</DialogTitle>
          <DialogDescription>{isCreating ? "Schedule a new service appointment." : `Booking ${editing?.booking_number ?? ""}`}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Customer Name</Label>
            <Input className="mt-1" placeholder="e.g. Juan dela Cruz" value={v.customer_name} onChange={(e) => field("customer_name", e.target.value)} />
          </div>
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Vehicle</Label>
            <Input className="mt-1" placeholder="e.g. Toyota Vios" value={v.vehicle_info} onChange={(e) => field("vehicle_info", e.target.value)} />
          </div>
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Service</Label>
            <Input className="mt-1" placeholder="e.g. Tire Change" value={v.service_name} onChange={(e) => field("service_name", e.target.value)} />
          </div>
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Branch</Label>
            <Input className="mt-1" placeholder="e.g. Main Branch" value={v.branch_name} onChange={(e) => field("branch_name", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Date & Time *</Label>
              <Input type="datetime-local" className="mt-1"
                value={v.scheduled_at ? new Date(v.scheduled_at).toISOString().slice(0, 16) : ""}
                onChange={(e) => field("scheduled_at", new Date(e.target.value).toISOString())} />
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Duration (min)</Label>
              <Input type="number" className="mt-1" value={v.duration_minutes ?? 60}
                onChange={(e) => field("duration_minutes", Number(e.target.value))} />
            </div>
          </div>
          {!isCreating && (
            <div>
              <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</Label>
              <Select value={v.status} onValueChange={(val) => field("status", val)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}><span className="capitalize">{s.replace("_"," ")}</span></SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Notes</Label>
            <Textarea className="mt-1" rows={2} value={v.notes ?? ""} onChange={(e) => field("notes", e.target.value)} />
          </div>
        </div>

        <DialogFooter className="gap-2 flex-wrap">
          {!isCreating && canEdit && (
            <Button variant="destructive" size="sm" onClick={() => onDelete(editing?.id)} className="mr-auto">
              <Trash2 className="h-3.5 w-3.5 mr-1" />Delete
            </Button>
          )}
          {!isCreating && (
            <Button variant="outline" size="sm" onClick={() => onLogOil(editing)} className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50">
              <Droplets className="h-3.5 w-3.5" />Log Oil Change
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!canEdit} onClick={() => { if (!v.scheduled_at) return toast.error("Pumili ng date/time"); onSave(buildPayload()); }}>
            {isCreating ? "Create Booking" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
