import clsx from "clsx";
import type { MilestoneStatus } from "@/lib/types";

// Colors mirror the legend in the existing NGT.Academy student dashboard:
// Complete = green, Sent Back = navy, Ready for Review = light blue,
// Overdue = orange/red, Incomplete = grey.
const STYLES: Record<MilestoneStatus, { dot: string; chip: string }> = {
  Complete: { dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  "Sent Back": { dot: "bg-slate-700", chip: "bg-slate-100 text-slate-800 ring-1 ring-slate-300" },
  "Ready for Review": { dot: "bg-sky-500", chip: "bg-sky-50 text-sky-700 ring-1 ring-sky-200" },
  Overdue: { dot: "bg-rose-500", chip: "bg-rose-50 text-rose-700 ring-1 ring-rose-200" },
  Incomplete: { dot: "bg-ngt-line", chip: "bg-ngt-bg text-ngt-muted ring-1 ring-ngt-line" },
};

export function MilestoneStatusBadge({
  status,
  size = "md",
}: {
  status: MilestoneStatus;
  size?: "sm" | "md";
}) {
  const s = STYLES[status];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-semibold rounded-full",
        s.chip,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]"
      )}
    >
      <span className={clsx("rounded-full", s.dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {status}
    </span>
  );
}

export function MilestoneStatusLegend() {
  const order: MilestoneStatus[] = ["Complete", "Sent Back", "Ready for Review", "Overdue", "Incomplete"];
  return (
    <div className="flex flex-wrap items-center gap-3">
      {order.map((s) => (
        <div key={s} className="inline-flex items-center gap-1.5 text-[11px] text-ngt-muted">
          <span className={clsx("w-2.5 h-2.5 rounded-sm", STYLES[s].dot)} />
          {s}
        </div>
      ))}
    </div>
  );
}

// Compact dot-row for tables: small colored squares per status with counts.
export function MilestoneStatusCounts({
  milestones,
}: {
  milestones: { status: MilestoneStatus }[];
}) {
  const counts: Record<MilestoneStatus, number> = {
    Complete: 0,
    "Sent Back": 0,
    "Ready for Review": 0,
    Overdue: 0,
    Incomplete: 0,
  };
  for (const m of milestones) counts[m.status] += 1;
  const order: MilestoneStatus[] = ["Overdue", "Ready for Review", "Sent Back", "Complete", "Incomplete"];
  return (
    <div className="flex items-center gap-1.5">
      {order.map((s) =>
        counts[s] === 0 ? null : (
          <span
            key={s}
            title={`${counts[s]} ${s}`}
            className={clsx(
              "inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded",
              STYLES[s].chip
            )}
          >
            <span className={clsx("w-1.5 h-1.5 rounded-full", STYLES[s].dot)} />
            {counts[s]}
          </span>
        )
      )}
    </div>
  );
}
