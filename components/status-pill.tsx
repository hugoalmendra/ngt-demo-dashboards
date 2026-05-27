import clsx from "clsx";
import type { ProgressStatus } from "@/lib/types";

const STYLES: Record<ProgressStatus, string> = {
  "On Track": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "Ahead": "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  "Slightly Behind": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "Behind": "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  "At Risk": "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  "Completed": "bg-ngt-yellow/15 text-ngt-yellowDark ring-1 ring-ngt-yellow/40",
};

export function StatusPill({ status }: { status: ProgressStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-semibold rounded-full",
        STYLES[status]
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
