import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SubNav, TIME_NAV } from "@/components/sub-nav";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarClock, Plus, Pencil, Trash2, Users2 } from "lucide-react";
import { toast } from "sonner";
import {
  useShifts,
  useEmployees,
  useEmployeeShifts,
  useInsert,
  useUpdate,
  useDelete,
} from "@/lib/db";

export const Route = createFileRoute("/_app/shifts")({ component: ShiftsPage });

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ShiftsPage() {
  const { data: shifts = [] } = useShifts();
  const { data: empShifts = [] } = useEmployeeShifts();
  const insert = useInsert<any>("shifts");
  const update = useUpdate<any>("shifts");
  const del = useDelete("shifts");
  const [editing, setEditing] = useState<any | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);

  const empty = {
    name: "",
    start_time: "08:00",
    end_time: "17:00",
    break_minutes: 60,
    grace_period_minutes: 10,
    days_of_week: [1, 2, 3, 4, 5],
    description: "",
    is_active: true,
  };

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const days = Array.from({ length: 7 })
      .map((_, i) => (fd.get(`day_${i}`) ? i : null))
      .filter((v) => v !== null) as number[];
    const payload: any = {
      name: fd.get("name"),
      start_time: fd.get("start_time"),
      end_time: fd.get("end_time"),
      break_minutes: Number(fd.get("break_minutes") || 60),
      grace_period_minutes: Number(fd.get("grace_period_minutes") || 10),
      days_of_week: days.length ? days : [1, 2, 3, 4, 5],
      description: fd.get("description") || null,
      is_active: true,
    };
    try {
      if (editing?.id) await update.mutateAsync({ id: editing.id, patch: payload });
      else await insert.mutateAsync(payload);
      toast.success("Shift saved");
      setEditing(null);
    } catch {}
  };

  return (
    <PageShell
      title="Shifts & Schedules"
      subtitle="Define work shifts and assign them to employees."
      actions={
        <div className="flex gap-2">
          <button
            onClick={() => setAssignOpen(true)}
            className="h-10 px-4 rounded-xl border border-border hover:bg-secondary inline-flex items-center gap-2 text-sm font-medium"
          >
            <Users2 className="h-4 w-4" /> Assign Employee
          </button>
          <button
            onClick={() => setEditing(empty)}
            className="h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center gap-2 text-sm font-semibold shadow-glow"
          >
            <Plus className="h-4 w-4" /> New Shift
          </button>
        </div>
      }
    >
      <SubNav items={TIME_NAV} label="Time & Attendance" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shifts.map((s: any) => (
          <div key={s.id} className="glass-card rounded-2xl p-5 group">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 grid place-items-center">
                    <CalendarClock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)} · {s.break_minutes}m break
                    </div>
                  </div>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition">
                <button onClick={() => setEditing(s)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary">
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={async () => {
                    if (confirm(`Delete shift "${s.name}"?`)) {
                      await del.mutateAsync(s.id);
                      toast.success("Deleted");
                    }
                  }}
                  className="h-8 w-8 grid place-items-center rounded-lg hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex gap-1 flex-wrap">
              {DAY_LABELS.map((d, i) => {
                const on = (s.days_of_week || []).includes(i);
                return (
                  <span
                    key={d}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${on ? "bg-primary/15 text-primary font-semibold" : "bg-secondary text-muted-foreground"}`}
                  >
                    {d}
                  </span>
                );
              })}
            </div>
            {s.description && <p className="mt-3 text-xs text-muted-foreground">{s.description}</p>}
            <div className="mt-3 text-[11px] text-muted-foreground">
              Grace: {s.grace_period_minutes}min ·{" "}
              {empShifts.filter((e: any) => e.shift_id === s.id && e.is_active).length} assigned
            </div>
          </div>
        ))}
        {shifts.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
            No shifts yet. Click "New Shift" to get started.
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Shift" : "New Shift"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={save} className="space-y-3">
              <input name="name" defaultValue={editing.name} placeholder="Shift name (e.g. Morning)" required className="input" />
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs">
                  Start time
                  <input name="start_time" type="time" defaultValue={editing.start_time?.slice(0, 5)} required className="input mt-1" />
                </label>
                <label className="text-xs">
                  End time
                  <input name="end_time" type="time" defaultValue={editing.end_time?.slice(0, 5)} required className="input mt-1" />
                </label>
                <label className="text-xs">
                  Break (mins)
                  <input name="break_minutes" type="number" defaultValue={editing.break_minutes} className="input mt-1" />
                </label>
                <label className="text-xs">
                  Grace period (mins)
                  <input name="grace_period_minutes" type="number" defaultValue={editing.grace_period_minutes} className="input mt-1" />
                </label>
              </div>
              <div>
                <div className="text-xs mb-1.5">Days of week</div>
                <div className="flex gap-2 flex-wrap">
                  {DAY_LABELS.map((d, i) => (
                    <label key={d} className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                      <input type="checkbox" name={`day_${i}`} defaultChecked={(editing.days_of_week || []).includes(i)} />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
              <textarea name="description" defaultValue={editing.description || ""} placeholder="Description (optional)" className="input min-h-[72px]" />
              <button className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-glow">Save Shift</button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AssignEmployeeDialog open={assignOpen} onClose={() => setAssignOpen(false)} />
    </PageShell>
  );
}

function AssignEmployeeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: employees = [] } = useEmployees();
  const { data: shifts = [] } = useShifts();
  const insert = useInsert<any>("employee_shifts");

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await insert.mutateAsync({
        employee_id: fd.get("employee_id"),
        shift_id: fd.get("shift_id"),
        effective_from: fd.get("effective_from"),
      });
      toast.success("Assigned");
      onClose();
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Shift to Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <select name="employee_id" required className="input">
            <option value="">Select employee</option>
            {employees.map((e: any) => (
              <option key={e.id} value={e.id}>
                {e.first_name} {e.last_name} ({e.employee_number})
              </option>
            ))}
          </select>
          <select name="shift_id" required className="input">
            <option value="">Select shift</option>
            {shifts.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.start_time?.slice(0, 5)}–{s.end_time?.slice(0, 5)})
              </option>
            ))}
          </select>
          <label className="text-xs">
            Effective from
            <input name="effective_from" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="input mt-1" />
          </label>
          <button className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-semibold shadow-glow">Assign</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}