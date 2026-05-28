"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { CalendarClock, Check, RotateCcw, X } from "lucide-react";
import type { Milestone } from "@/lib/types";
import { MilestoneStatusBadge } from "./milestone-status-badge";
import { formatDate } from "@/lib/format";

const PRESETS = [
  { days: 7, label: "+7 days" },
  { days: 14, label: "+14 days" },
  { days: 30, label: "+30 days" },
];

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

interface Props {
  milestones: Milestone[];
  onClose: () => void;
}

export function ExtendDueDatesModal({ milestones, onClose }: Props) {
  // Only let students extend things that aren't already done.
  const extendable = useMemo(
    () => milestones.filter((m) => m.status !== "Complete"),
    [milestones]
  );

  // Per-milestone proposed extension (in days). 0 = no change.
  const [pending, setPending] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalChanges = Object.values(pending).filter((d) => d > 0).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleApply = () => {
    setSubmitted(true);
    setTimeout(onClose, 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-6 py-5 border-b border-ngt-line flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-ngt-yellow/15 text-ngt-yellowDark grid place-items-center shrink-0">
              <CalendarClock size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ngt-text leading-tight">
                Extend Milestone Due Dates
              </h2>
              <p className="text-[12px] text-ngt-muted mt-1 max-w-md">
                Need more time? Pick a new date for any milestone below. Extensions
                are subject to your coach's review.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ngt-muted hover:text-ngt-text shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </header>

        {extendable.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-emerald-600 font-semibold">🎉 All caught up!</div>
            <p className="text-[13px] text-ngt-muted mt-2">
              You don't have any pending milestones that need extending.
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 divide-y divide-ngt-line">
            {extendable.map((m) => {
              const proposed = pending[m.id] ?? 0;
              const newDate = proposed > 0 ? addDays(m.dueDate, proposed) : null;
              return (
                <div key={m.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{m.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <MilestoneStatusBadge status={m.status} size="sm" />
                        <span className="text-[11px] text-ngt-muted uppercase tracking-wider">
                          {m.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] uppercase tracking-widest text-ngt-muted font-semibold">
                        Current due
                      </div>
                      <div className="text-sm font-semibold tabular-nums">
                        {formatDate(m.dueDate)}
                      </div>
                      {newDate && (
                        <div className="mt-1">
                          <div className="text-[10px] uppercase tracking-widest text-emerald-600 font-semibold">
                            New due
                          </div>
                          <div className="text-sm font-bold text-emerald-700 tabular-nums">
                            {formatDate(newDate)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {PRESETS.map((p) => {
                      const active = proposed === p.days;
                      return (
                        <button
                          key={p.days}
                          type="button"
                          onClick={() =>
                            setPending((cur) => ({ ...cur, [m.id]: active ? 0 : p.days }))
                          }
                          className={clsx(
                            "h-8 px-3 rounded-md text-[11px] font-bold uppercase tracking-widest border transition",
                            active
                              ? "border-ngt-yellow bg-ngt-yellow/15 text-ngt-yellowDark"
                              : "border-ngt-line text-ngt-muted hover:text-ngt-text hover:bg-ngt-bg"
                          )}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                    {proposed > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setPending((cur) => {
                            const next = { ...cur };
                            delete next[m.id];
                            return next;
                          })
                        }
                        className="h-8 px-2 rounded-md text-[11px] font-semibold text-ngt-muted hover:text-ngt-text inline-flex items-center gap-1"
                      >
                        <RotateCcw size={11} /> Reset
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {extendable.length > 0 && (
          <footer className="px-6 py-4 border-t border-ngt-line bg-ngt-bg/60 flex items-center justify-between gap-3">
            <div className="text-[12px] text-ngt-muted">
              {totalChanges === 0 ? (
                <>No changes yet — pick a preset on any milestone above.</>
              ) : (
                <>
                  <span className="text-ngt-text font-semibold">{totalChanges}</span>{" "}
                  milestone{totalChanges === 1 ? "" : "s"} will be extended.
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="h-9 px-4 rounded-md text-[11px] font-bold uppercase tracking-widest text-ngt-muted hover:text-ngt-text border border-transparent hover:border-ngt-line"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={totalChanges === 0 || submitted}
                className={clsx(
                  "h-9 px-4 rounded-md text-[11px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 transition",
                  submitted
                    ? "bg-emerald-500 text-white cursor-default"
                    : totalChanges === 0
                    ? "bg-ngt-line text-ngt-muted cursor-not-allowed"
                    : "bg-ngt-yellow hover:bg-ngt-yellowDark text-black"
                )}
              >
                {submitted ? (
                  <>
                    <Check size={12} /> Extension requested
                  </>
                ) : (
                  <>Request Extension</>
                )}
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
