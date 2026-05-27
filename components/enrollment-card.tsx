"use client";

import { useState } from "react";
import {
  Award,
  BookOpen,
  CalendarRange,
  ChevronDown,
  GraduationCap,
  Library,
} from "lucide-react";
import clsx from "clsx";
import type { EnrollmentStatus, ProgramEnrollment } from "@/lib/types";
import { ProgressBar } from "./progress-bar";
import { ProgramTree } from "./program-tree";
import { MilestoneList } from "./milestone-list";
import { formatDate } from "@/lib/format";

const STATUS_STYLES: Record<EnrollmentStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Completed: "bg-ngt-yellow/15 text-ngt-yellowDark ring-1 ring-ngt-yellow/40",
  Expired: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  Paused: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

interface Props {
  enrollment: ProgramEnrollment;
  variant: "student" | "ssm";
  defaultOpen?: boolean;
}

export function EnrollmentCard({ enrollment, variant, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const isCourse = enrollment.kind === "Course";

  // Build a Program-shaped object so we can reuse <ProgramTree> for courses too.
  const baseTree =
    enrollment.kind === "Program" && enrollment.program
      ? enrollment.program
      : enrollment.course
      ? { id: enrollment.course.id, name: enrollment.name, courses: [enrollment.course] }
      : null;

  // For a Completed enrollment the module-level %s on the shared static
  // program data don't reflect this student's actual history (those numbers
  // are used by other still-in-progress students). Force every module to
  // 100% so the historical view is honest.
  const treeProgram =
    baseTree && enrollment.status === "Completed"
      ? {
          ...baseTree,
          courses: baseTree.courses.map((c) => ({
            ...c,
            modules: c.modules.map((m) => ({ ...m, progressPct: 100 })),
          })),
        }
      : baseTree;

  return (
    <div className="bg-white border border-ngt-line rounded-lg shadow-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-ngt-bg/40 text-left"
      >
        <div
          className={clsx(
            "w-10 h-10 rounded-md grid place-items-center shrink-0",
            isCourse ? "bg-violet-50 text-violet-600" : "bg-amber-50 text-amber-700"
          )}
        >
          {isCourse ? <Library size={18} /> : <GraduationCap size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-widest text-ngt-muted font-semibold">
              {isCourse ? "Add-on Course" : "Program"}
            </span>
            <span
              className={clsx(
                "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full",
                STATUS_STYLES[enrollment.status]
              )}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {enrollment.status}
            </span>
          </div>
          <div className="font-bold text-sm mt-0.5 truncate">{enrollment.name}</div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-ngt-muted mt-1">
            <span className="inline-flex items-center gap-1">
              <CalendarRange size={11} /> {formatDate(enrollment.enrolledAt)}
              {enrollment.completedAt && <> → {formatDate(enrollment.completedAt)}</>}
            </span>
            <span>· {enrollment.cohort}</span>
            {enrollment.certsEarned && enrollment.certsEarned.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <Award size={11} /> {enrollment.certsEarned.length} certs earned
              </span>
            )}
          </div>
        </div>
        <div className="w-[140px] hidden md:block">
          <ProgressBar
            value={enrollment.progressPct}
            variant={enrollment.status === "Completed" ? "green" : "auto"}
            size="sm"
            showLabel
          />
        </div>
        <ChevronDown
          size={16}
          className={clsx("text-ngt-muted transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="border-t border-ngt-line bg-ngt-bg/30 px-5 py-4 space-y-4">
          {enrollment.certsEarned && enrollment.certsEarned.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1.5">
                Certifications earned
              </div>
              <div className="flex flex-wrap gap-1.5">
                {enrollment.certsEarned.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  >
                    <Award size={11} /> {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {treeProgram && (
            <div>
              <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1.5 flex items-center gap-1.5">
                <BookOpen size={11} /> Curriculum
              </div>
              <ProgramTree program={treeProgram} friendly={variant === "student"} />
            </div>
          )}

          {enrollment.milestones && enrollment.milestones.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-widest text-ngt-muted font-semibold mb-1.5">
                Milestones
              </div>
              <MilestoneList milestones={enrollment.milestones} variant={variant} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
