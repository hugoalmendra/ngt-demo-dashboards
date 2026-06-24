"use client";

import { useState } from "react";
import { CalendarClock } from "lucide-react";
import type { Milestone } from "@/lib/types";
import { ExtendDueDatesModal } from "./extend-due-dates-modal";

export function ExtendDueDatesButton({
  milestones,
  variant = "student",
}: {
  milestones: Milestone[];
  variant?: "student" | "ssm";
}) {
  const [open, setOpen] = useState(false);
  const extendableCount = milestones.filter((m) => m.status !== "Complete").length;
  const disabled = extendableCount === 0;
  const label = variant === "ssm" ? "Extend Milestones" : "Extend Due Dates";
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled}
        title={
          disabled
            ? "No pending milestones to extend"
            : variant === "ssm"
            ? `Extend due dates for ${extendableCount} pending milestone(s)`
            : `Request a new due date for any of your ${extendableCount} pending milestone(s)`
        }
        className={
          disabled
            ? "inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[11px] font-bold uppercase tracking-widest border border-ngt-line text-ngt-muted/60 bg-ngt-bg cursor-not-allowed"
            : "inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[11px] font-bold uppercase tracking-widest border border-ngt-yellow text-ngt-yellowDark hover:bg-ngt-yellow/10 transition"
        }
      >
        <CalendarClock size={13} />
        {label}
      </button>
      {open && (
        <ExtendDueDatesModal milestones={milestones} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
